import {
  ScanOptions,
  IFileService,
  IFileStat,
  GetNewestFileResult,
  RiskAnalysis,
} from '@core/index.js';
import { Observable } from 'rxjs';
import { FileWorkerService } from './files.worker.service.js';
import { IsValidRootFolderResult } from '@core/interfaces/npkill.interface.js';
export declare abstract class FileService implements IFileService {
  fileWorkerService: FileWorkerService;
  constructor(fileWorkerService: FileWorkerService);
  abstract deleteDir(path: string): Promise<boolean>;
  listDir(path: string, params: ScanOptions): Observable<string>;
  getFolderSize(path: string): Observable<number>;
  stopScan(): void;
  /** Used for dry-run or testing. */
  fakeDeleteDir(): Promise<boolean>;
  isValidRootFolder(path: string): IsValidRootFolderResult;
  /**
   * > Why dangerous?
   * It is probable that if the node_module is included in some hidden directory, it is
   * required by some application like "spotify", "vscode" or "Discord" and deleting it
   * would imply breaking the application (until the dependencies are reinstalled).
   *
   * In the case of macOS applications and Windows AppData directory, these locations often contain
   * application-specific data or configurations that should not be tampered with. Deleting directories
   * from these locations could potentially disrupt the normal operation of these applications.
   */
  isDangerous(originalPath: string): RiskAnalysis;
  getRecentModificationInDir(path: string): Promise<GetNewestFileResult | null>;
  getFileStatsInDir(dirname: string): Promise<IFileStat[]>;
}
