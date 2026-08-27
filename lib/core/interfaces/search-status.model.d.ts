import { WorkerStatus } from '../services/files/files.worker.service.js';
/**
 * Tracks the progress and status of directory scanning operations.
 * Maintains counters for various stages of the scan process including
 * search tasks, statistics calculation, and deletion operations.
 */
export declare class ScanStatus {
  /** Number of search tasks currently pending execution. */
  pendingSearchTasks: number;
  /** Number of search tasks that have been completed. */
  completedSearchTasks: number;
  /** Number of pending statistics calculations for found directories. */
  pendingStatsCalculation: number;
  /** Number of completed statistics calculations. */
  completedStatsCalculation: number;
  /** Total number of matching directories found during the scan. */
  resultsFound: number;
  /** Number of deletion operations currently pending. */
  pendingDeletions: number;
  /** Current status of the worker threads handling the scan. */
  workerStatus: WorkerStatus;
  /** Information about active worker jobs. */
  workersJobs: any;
  /**
   * Records the discovery of a new matching directory.
   * Increments result count and pending statistics calculation.
   */
  newResult(): void;
  /**
   * Records the completion of a statistics calculation.
   * Decrements pending count and increments completed count.
   */
  completeStatCalculation(): void;
  reset(): void;
}
