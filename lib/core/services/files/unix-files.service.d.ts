import { FileService } from './files.service.js';
import { StreamService } from '../stream.service.js';
import { FileWorkerService } from './files.worker.service.js';
export declare class UnixFilesService extends FileService {
  protected streamService: StreamService;
  fileWorkerService: FileWorkerService;
  constructor(
    streamService: StreamService,
    fileWorkerService: FileWorkerService,
  );
  deleteDir(path: string): Promise<boolean>;
}
