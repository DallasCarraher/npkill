import { FileService } from './files.service.js';
import { FileWorkerService } from './files.worker.service.js';
import { StreamService } from '../stream.service.js';
export declare class WindowsFilesService extends FileService {
  private readonly streamService;
  fileWorkerService: FileWorkerService;
  constructor(
    streamService: StreamService,
    fileWorkerService: FileWorkerService,
  );
  deleteDir(path: string): Promise<boolean>;
}
