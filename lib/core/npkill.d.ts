import { Observable } from 'rxjs';
import { LoggerService } from './services/logger.service.js';
import { Services } from './interfaces/services.interface.js';
import {
  ScanFoundFolder,
  GetNewestFileResult,
  GetSizeResult,
  ScanOptions,
  DeleteOptions,
  DeleteResult,
} from './interfaces/folder.interface.js';
import {
  IsValidRootFolderResult,
  NpkillInterface,
} from './interfaces/npkill.interface.js';
import { LogEntry } from './interfaces/logger-service.interface.js';
/**
 * Main npkill class that implements the core directory scanning and cleanup functionality.
 * Provides methods for recursive directory scanning, size calculation, file analysis,
 * and safe deletion operations.
 */
export declare class Npkill implements NpkillInterface {
  private readonly services;
  constructor(customServices?: Partial<Services>);
  private searchDuration;
  startScan$(
    rootPath: string,
    options: ScanOptions,
  ): Observable<ScanFoundFolder>;
  getSize$(path: string): Observable<GetSizeResult>;
  getNewestFile$(path: string): Observable<GetNewestFileResult | null>;
  delete$(path: string, options?: DeleteOptions): Observable<DeleteResult>;
  getLogs$(): Observable<LogEntry[]>;
  stopScan(): void;
  isValidRootFolder(path: string): IsValidRootFolderResult;
  getVersion(): string;
  get logger(): LoggerService;
}
