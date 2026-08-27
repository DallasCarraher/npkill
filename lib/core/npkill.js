import { FileWorkerService } from './services/files/index.js';
import { from } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { ScanStatus } from './interfaces/search-status.model.js';
import _dirname from '../dirname.js';
import { LoggerService } from './services/logger.service.js';
import { StreamService } from './services/stream.service.js';
import { ProfilesService } from './services/profiles.service.js';
import { OSServiceMap } from '../constants/os-service-map.constants.js';
import { getFileContent } from '../utils/get-file-content.js';
import { ResultsService } from '../cli/services/results.service.js';
/**
 * Main npkill class that implements the core directory scanning and cleanup functionality.
 * Provides methods for recursive directory scanning, size calculation, file analysis,
 * and safe deletion operations.
 */
export class Npkill {
  services;
  constructor(customServices) {
    const defaultServices = createDefaultServices(
      customServices?.searchStatus,
      customServices?.logger,
    );
    this.services = { ...defaultServices, ...customServices };
    this.logger.info(process.argv.join(' '));
    this.logger.info(`Npkill started! v${this.getVersion()}`);
  }
  searchDuration = 0;
  startScan$(rootPath, options) {
    const { fileService } = this.services;
    this.logger.info(`Scan started in ${rootPath}`);
    const startTime = Date.now();
    return fileService.listDir(rootPath, options).pipe(
      catchError(() => {
        throw new Error('Error while listing directories');
      }),
      mergeMap((dataFolder) => from(splitData(dataFolder))),
      filter((path) => path !== ''),
      map((path) => {
        if (
          options.performRiskAnalysis !== undefined &&
          !options.performRiskAnalysis
        ) {
          return { path };
        }
        const riskAnalysis = fileService.isDangerous(path);
        return {
          path,
          riskAnalysis,
        };
      }),
      tap((nodeFolder) =>
        this.logger.info(`Folder found: ${String(nodeFolder.path)}`),
      ),
      tap({
        complete: () => {
          this.searchDuration = (Date.now() - startTime) / 1000;
          this.logger.info(`Search completed after ${this.searchDuration}s`);
        },
      }),
    );
  }
  getSize$(path) {
    const { fileService } = this.services;
    this.logger.info(`Calculating folder size for ${String(path)}`);
    return fileService.getFolderSize(path).pipe(
      take(1),
      map((size) => ({ size, unit: 'bytes' })),
      tap(({ size }) => this.logger.info(`Size of ${path}: ${size} bytes`)),
    );
  }
  getNewestFile$(path) {
    const { fileService } = this.services;
    this.logger.info(`Calculating last mod. of ${path}`);
    return from(fileService.getRecentModificationInDir(path)).pipe(
      tap((result) => {
        if (!result) {
          return;
        }
        this.logger.info(`Last mod. of ${path}: ${result.timestamp}`);
      }),
    );
  }
  delete$(path, options) {
    const { fileService } = this.services;
    this.logger.info(
      `Deleting ${String(path)} ${options?.dryRun ? '(dry run)' : ''}...`,
    );
    const deleteOperation = options?.dryRun
      ? from(fileService.fakeDeleteDir())
      : from(fileService.deleteDir(path));
    return deleteOperation.pipe(
      map((result) => {
        if (!result) {
          this.logger.error(`Failed to delete ${String(path)}`);
          return { path, success: false };
        }
        this.logger.info(`Deleted ${String(path)}: ${result}`);
        return {
          path,
          success: result,
        };
      }),
    );
  }
  getLogs$() {
    return this.services.logger.getLog$();
  }
  stopScan() {
    this.logger.info('Stopping scan...');
    this.services.fileService.stopScan();
  }
  isValidRootFolder(path) {
    return this.services.fileService.isValidRootFolder(path);
  }
  getVersion() {
    const packageJson = _dirname + '/../package.json';
    const packageData = JSON.parse(getFileContent(packageJson));
    return packageData.version;
  }
  get logger() {
    return this.services.logger;
  }
}
function createDefaultServices(searchStatus, logger) {
  const actualLogger = logger || new LoggerService();
  const actualSearchStatus = searchStatus || new ScanStatus();
  const fileWorkerService = new FileWorkerService(
    actualLogger,
    actualSearchStatus,
  );
  const streamService = new StreamService();
  const resultsService = new ResultsService();
  const profilesService = new ProfilesService();
  const OSService = OSServiceMap[process.platform];
  if (typeof OSService === 'undefined') {
    throw new Error(
      `Unsupported platform: ${process.platform}. Cannot load OS service.`,
    );
  }
  const fileService = new OSService(streamService, fileWorkerService);
  return {
    logger: actualLogger,
    searchStatus: actualSearchStatus,
    fileService,
    fileWorkerService,
    streamService,
    resultsService,
    profilesService,
  };
}
function splitData(data, separator = '\n') {
  if (data === '') {
    return [];
  }
  return data.split(separator);
}
//# sourceMappingURL=npkill.js.map
