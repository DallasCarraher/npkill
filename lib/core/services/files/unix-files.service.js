import { execFile } from 'child_process';
import { FileService } from './files.service.js';
export class UnixFilesService extends FileService {
  streamService;
  fileWorkerService;
  constructor(streamService, fileWorkerService) {
    super(fileWorkerService);
    this.streamService = streamService;
    this.fileWorkerService = fileWorkerService;
  }
  async deleteDir(path) {
    return new Promise((resolve, reject) => {
      execFile('rm', ['-rf', path], (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }
}
//# sourceMappingURL=unix-files.service.js.map
