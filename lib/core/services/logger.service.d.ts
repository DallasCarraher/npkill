import { Observable } from 'rxjs';
import {
  ILoggerService,
  LogEntry,
} from '@core/interfaces/logger-service.interface.js';
/**
 * Implementation of the logging service for npkill.
 * Manages application logs with different severity levels and provides
 * reactive streams for log observation and file output capabilities.
 */
export declare class LoggerService implements ILoggerService {
  private log;
  private logSubject;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  get(type?: 'all' | 'info' | 'warn' | 'error'): LogEntry[];
  getLog$(): Observable<LogEntry[]>;
  getLogByType$(
    type?: 'all' | 'info' | 'warn' | 'error',
  ): Observable<LogEntry[]>;
  saveToFile(path: string): void;
  getSuggestLogFilePath(): string;
  private rotateLogFile;
  private addToLog;
  private getTimestamp;
}
