import { lstat, opendir, readdir } from 'fs/promises';
import EventEmitter from 'events';
import { join } from 'path';
import { parentPort } from 'node:worker_threads';
import { EVENTS, MAX_PROCS } from '../../../constants/workers.constants.js';
import { GLOBAL_IGNORE } from '../../constants/global-ignored.constants.js';
var ETaskOperation;
(function (ETaskOperation) {
  ETaskOperation[(ETaskOperation['explore'] = 0)] = 'explore';
  ETaskOperation[(ETaskOperation['getFolderSize'] = 1)] = 'getFolderSize';
  ETaskOperation[(ETaskOperation['getFolderSizeChild'] = 2)] =
    'getFolderSizeChild';
})(ETaskOperation || (ETaskOperation = {}));
(() => {
  let id = 0;
  let fileWalker;
  let tunnel;
  if (parentPort === null) {
    throw new Error('Worker must be spawned from a parent thread.');
  }
  parentPort.on('message', (message) => {
    if (message?.type === EVENTS.startup) {
      id = message.value.id;
      tunnel = message.value.channel;
      fileWalker = new FileWalker();
      initTunnelListeners();
      initFileWalkerListeners();
      notifyWorkerReady();
    }
  });
  function notifyWorkerReady() {
    tunnel.postMessage({
      type: EVENTS.alive,
      value: null,
    });
  }
  function initTunnelListeners() {
    tunnel.on('message', (message) => {
      if (message?.type === EVENTS.exploreConfig) {
        fileWalker.setSearchConfig(message.value);
      }
      if (message?.type === EVENTS.explore) {
        fileWalker.enqueueTask(message.value.path, ETaskOperation.explore);
      }
      if (message?.type === EVENTS.getFolderSize) {
        fileWalker.enqueueTask(
          message.value.path,
          ETaskOperation.getFolderSize,
          true,
        );
      }
      if (message?.type === EVENTS.stop) {
        fileWalker.stop();
      }
    });
  }
  function initFileWalkerListeners() {
    fileWalker.events.on('newResult', ({ results }) => {
      tunnel.postMessage({
        type: EVENTS.scanResult,
        value: { results, workerId: id, pending: fileWalker.pendingJobs },
      });
    });
    fileWalker.events.on('folderSizeResult', (result) => {
      tunnel.postMessage({
        type: EVENTS.GetSizeResult,
        value: {
          results: result,
          workerId: id,
          pending: fileWalker.pendingJobs,
        },
      });
    });
  }
})();
class FileWalker {
  events = new EventEmitter();
  searchConfig = {
    rootPath: '',
    targets: [''],
    exclude: [],
  };
  taskQueue = [];
  completedTasks = 0;
  procs = 0;
  shouldStop = false;
  setSearchConfig(params) {
    this.searchConfig = params;
  }
  stop() {
    this.shouldStop = true;
  }
  enqueueTask(path, operation, priorize = false, sizeCollector) {
    if (this.shouldStop) {
      return;
    }
    const task = { path, operation };
    if (sizeCollector) {
      task.sizeCollector = sizeCollector;
    }
    if (priorize) {
      this.taskQueue.unshift(task);
    } else {
      this.taskQueue.push(task);
    }
    this.processQueue();
  }
  async run(path) {
    this.updateProcs(1);
    try {
      const dir = await opendir(path);
      await this.analizeDir(path, dir);
    } catch {
      this.completeTask();
    }
  }
  async analizeDir(path, dir) {
    const results = [];
    let entry = null;
    while ((entry = await dir.read().catch(() => null)) != null) {
      this.newDirEntry(path, entry, results);
    }
    await dir.close();
    this.completeTask();
    this.events.emit('newResult', { results });
    if (this.taskQueue.length === 0 && this.procs === 0) {
      this.completeAll();
    }
  }
  async runGetFolderSize(path) {
    this.updateProcs(1);
    try {
      const collector = {
        total: 0,
        pending: 1,
        onComplete: (finalSize) => {
          this.events.emit('folderSizeResult', { path, size: finalSize });
        },
      };
      this.enqueueTask(
        path,
        ETaskOperation.getFolderSizeChild,
        false,
        collector,
      );
      this.completeTask();
    } catch {
      // If anything fails during setup, emit size 0 and complete
      this.completeTask();
      this.events.emit('folderSizeResult', { path, size: 0 });
    }
  }
  async runGetFolderSizeChild(path, collector) {
    if (!collector) {
      // Should not happen with proper initiation, but safe.
      this.completeTask();
      return;
    }
    this.updateProcs(1);
    try {
      const entries = await readdir(path, { withFileTypes: true });
      let currentLevelSize = 0;
      const directoriesToProcess = [];
      for (let i = 0; i < entries.length; i += 100) {
        const chunk = entries.slice(i, i + 100);
        await Promise.all(
          chunk.map(async (entry) => {
            const fullPath = join(path, entry.name);
            try {
              if (entry.isSymbolicLink()) {
                return;
              }
              if (entry.isDirectory()) {
                currentLevelSize += 4096; // General directory size
                directoriesToProcess.push(fullPath);
              } else {
                const stats = await lstat(fullPath);
                const size =
                  typeof stats.blocks === 'number'
                    ? stats.blocks * 512
                    : stats.size;
                currentLevelSize += size;
              }
            } catch {
              // Ignore permissions errors.
            }
          }),
        );
      }
      collector.total += currentLevelSize;
      collector.pending += directoriesToProcess.length;
      for (const dirPath of directoriesToProcess) {
        this.enqueueTask(
          dirPath,
          ETaskOperation.getFolderSizeChild,
          false,
          collector,
        );
      }
    } catch {
      // Ignore permissions errors.
    } finally {
      collector.pending -= 1;
      this.completeTask();
      if (collector.pending === 0) {
        collector.onComplete(collector.total);
      }
    }
  }
  newDirEntry(path, entry, results) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) {
      return;
    }
    const isTarget = this.isTargetFolder(entry.name);
    if (GLOBAL_IGNORE.has(entry.name) && !isTarget) {
      return;
    }
    const subpath = join(path, entry.name);
    if (this.isExcluded(subpath)) {
      return;
    }
    results.push({
      path: subpath,
      isTarget,
    });
  }
  isExcluded(path) {
    if (this.searchConfig.exclude == null) {
      return false;
    }
    return this.searchConfig.exclude.some((ex) => path.includes(ex));
  }
  isTargetFolder(path) {
    return this.searchConfig.targets.includes(path);
  }
  completeTask() {
    this.updateProcs(-1);
    this.processQueue();
    this.completedTasks++;
  }
  updateProcs(value) {
    this.procs += value;
  }
  processQueue() {
    while (
      this.procs < MAX_PROCS &&
      this.taskQueue.length > 0 &&
      !this.shouldStop
    ) {
      const task = this.taskQueue.shift();
      if (!task?.path) {
        continue;
      }
      switch (task.operation) {
        case ETaskOperation.explore:
          this.run(task.path).catch(() => {
            this.completeTask();
          });
          break;
        case ETaskOperation.getFolderSize:
          this.runGetFolderSize(task.path).catch(() => {
            // If runGetFolderSize fails, we need to emit a size of 0
            // Otherwise the stream will hang forever
            this.events.emit('folderSizeResult', { path: task.path, size: 0 });
          });
          break;
        case ETaskOperation.getFolderSizeChild:
          this.runGetFolderSizeChild(task.path, task.sizeCollector).catch(
            () => {
              // Ensure we always decrement the collector even on errors
              if (task.sizeCollector == null) {
                // This shouldn't happen, but if it does, we can't recover properly
                // The best we can do is not crash
                return;
              }
              task.sizeCollector.pending -= 1;
              if (task.sizeCollector.pending === 0) {
                task.sizeCollector.onComplete(task.sizeCollector.total);
              }
              this.completeTask();
            },
          );
          break;
      }
    }
  }
  completeAll() {
    // Any future action.
  }
  /*  get stats(): WorkerStats {
      return {
        pendingSearchTasks: this.taskQueue.length,
        completedSearchTasks: this.completedTasks,
        procs: this.procs,
      };
    } */
  get pendingJobs() {
    return this.taskQueue.length + this.procs;
  }
}
//# sourceMappingURL=files.worker.js.map
