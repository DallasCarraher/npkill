import { FileService } from './files.service.js';
import { rm } from 'fs/promises';
export class WindowsFilesService extends FileService {
  streamService;
  fileWorkerService;
  constructor(streamService, fileWorkerService) {
    super(fileWorkerService);
    this.streamService = streamService;
    this.fileWorkerService = fileWorkerService;
  }
  async deleteDir(path) {
    await rm(path, { recursive: true, force: true });
    return true;
  }
}
//# sourceMappingURL=windows-files.service.js.map
