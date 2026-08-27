import { BaseUi } from '../../base.ui.js';
import { SpinnerService } from '../../../services/spinner.service.js';
import { ScanStatus } from '@core/interfaces/search-status.model.js';
export declare class StatusUi extends BaseUi {
  private readonly spinnerService;
  private readonly searchStatus;
  private text;
  private barNormalizedWidth;
  private barClosing;
  private showProgressBar;
  private pendingTasksPosition;
  private searchEnd$;
  private readonly SEARCH_STATES;
  constructor(spinnerService: SpinnerService, searchStatus: ScanStatus);
  start(): void;
  reset(): void;
  completeSearch(duration: number): void;
  render(): void;
  private renderPendingTasks;
  private clearPendingTasks;
  private renderProgressBar;
  private activeAnimation;
  private animateProgressBar;
  private animateClose;
  /** When the progress bar disappears, "pending tasks" will move up one
        position. */
  private movePendingTaskToTop;
  private printProgressBar;
  private startingSearch;
  private continueSearching;
  private fatalError;
  private continueFinishing;
}
