/**
 * Tracks the progress and status of directory scanning operations.
 * Maintains counters for various stages of the scan process including
 * search tasks, statistics calculation, and deletion operations.
 */
export class ScanStatus {
  /** Number of search tasks currently pending execution. */
  pendingSearchTasks = 0;
  /** Number of search tasks that have been completed. */
  completedSearchTasks = 0;
  /** Number of pending statistics calculations for found directories. */
  pendingStatsCalculation = 0;
  /** Number of completed statistics calculations. */
  completedStatsCalculation = 0;
  /** Total number of matching directories found during the scan. */
  resultsFound = 0;
  /** Number of deletion operations currently pending. */
  pendingDeletions = 0;
  /** Current status of the worker threads handling the scan. */
  workerStatus = 'stopped';
  /** Information about active worker jobs. */
  workersJobs;
  /**
   * Records the discovery of a new matching directory.
   * Increments result count and pending statistics calculation.
   */
  newResult() {
    this.resultsFound++;
    this.pendingStatsCalculation++;
  }
  /**
   * Records the completion of a statistics calculation.
   * Decrements pending count and increments completed count.
   */
  completeStatCalculation() {
    this.pendingStatsCalculation--;
    this.completedStatsCalculation++;
  }
  reset() {
    this.pendingSearchTasks = 0;
    this.completedSearchTasks = 0;
    this.pendingStatsCalculation = 0;
    this.completedStatsCalculation = 0;
    this.resultsFound = 0;
    this.pendingDeletions = 0;
  }
}
//# sourceMappingURL=search-status.model.js.map
