import { MessagePort } from 'worker_threads';
import { Subject } from 'rxjs';
import { LoggerService } from '../logger.service.js';
import { ScanStatus } from '../../interfaces/search-status.model.js';
import { EVENTS } from '../../../constants/workers.constants.js';
import { ScanOptions } from '../../index.js';
export type WorkerStatus = 'stopped' | 'scanning' | 'dead' | 'finished';
export interface WorkerScanOptions extends ScanOptions {
  rootPath: string;
}
export type WorkerMessage =
  | {
      type: EVENTS.scanResult;
      value: {
        results: Array<{
          path: string;
          isTarget: boolean;
        }>;
        workerId: number;
        pending: number;
      };
    }
  | {
      type: EVENTS.GetSizeResult;
      value: {
        results: {
          path: string;
          size: number;
        };
        workerId: number;
        pending: number;
      };
    }
  | {
      type: EVENTS.explore | EVENTS.getFolderSize;
      value: {
        path: string;
      };
    }
  | {
      type: EVENTS.exploreConfig;
      value: WorkerScanOptions;
    }
  | {
      type: EVENTS.startup;
      value: {
        channel: MessagePort;
        id: number;
      };
    }
  | {
      type: EVENTS.alive;
      value?: undefined;
    }
  | {
      type: EVENTS.stop;
      value?: undefined;
    }
  | {
      type: EVENTS.error;
      value: {
        error: Error;
      };
    };
export interface WorkerStats {
  pendingSearchTasks: number;
  completedSearchTasks: number;
  procs: number;
}
export declare class FileWorkerService {
  private readonly logger;
  private readonly searchStatus;
  private index;
  private workers;
  private workersPendingJobs;
  private getSizePendings;
  private pendingJobs;
  private totalJobs;
  private tunnels;
  private shouldStop;
  private readonly SIZE_TIMEOUT_MS;
  constructor(logger: LoggerService, searchStatus: ScanStatus);
  startScan(stream$: Subject<string>, params: WorkerScanOptions): Promise<void>;
  getFolderSize(stream$: Subject<number>, path: string): void;
  stopScan(): void;
  private listenEvents;
  private newWorkerMessage;
  /** Jobs are distributed following the round-robin algorithm. */
  private addJob;
  private checkJobComplete;
  private instantiateWorkers;
  private setWorkerConfig;
  private killWorkers;
  private getPendingJobs;
  private updateStats;
  private getWorkerPath;
  private getOptimalNumberOfWorkers;
}
