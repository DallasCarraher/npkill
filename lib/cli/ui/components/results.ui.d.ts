import { InteractiveUi } from '../base.ui.js';
import { HeavyUi } from '../heavy.ui.js';
import { ConsoleService } from '../../services/console.service.js';
import { IConfig } from '../../interfaces/config.interface.js';
import { IKeyPress } from '../../interfaces/key-press.interface.js';
import { ResultsService } from '../../services/results.service.js';
import { Subject } from 'rxjs';
import { CliScanFoundFolder } from '../../../cli/interfaces/stats.interface.js';
export declare class ResultsUi extends HeavyUi implements InteractiveUi {
  private readonly resultsService;
  private readonly consoleService;
  resultIndex: number;
  previousIndex: number;
  scroll: number;
  private haveResultsAfterCompleted;
  private selectMode;
  private selectedFolders;
  private rangeSelectionStart;
  private isRangeSelectionMode;
  readonly delete$: Subject<CliScanFoundFolder>;
  readonly deleteMultiple$: Subject<CliScanFoundFolder[]>;
  readonly showErrors$: Subject<null>;
  readonly openFolder$: Subject<string>;
  readonly showDetails$: Subject<CliScanFoundFolder>;
  readonly goOptions$: Subject<null>;
  readonly endNpkill$: Subject<null>;
  readonly search$: Subject<{
    text: string;
    isInputActive: boolean;
  } | null>;
  private isSearchInputMode;
  private searchText;
  private filteredResults;
  private sortIndex;
  private lastGPressTime;
  private config;
  private readonly KEYS;
  constructor(
    resultsService: ResultsService,
    consoleService: ConsoleService,
    config?: IConfig,
  );
  private openFolder;
  private showDetails;
  private goOptions;
  private endNpkill;
  private toggleSelectMode;
  private startRangeSelection;
  private toggleSelectAll;
  private handleSpacePress;
  private toggleFolderSelection;
  private applyRangeSelection;
  private deleteSelected;
  private activateSearchInputMode;
  private handleSearchInput;
  private filterResults;
  onKeyInput(key: IKeyPress): void;
  render(): void;
  clear(): void;
  completeSearch(): void;
  private printResults;
  private computeColumnLayout;
  private noResults;
  private printFolderRow;
  private getCellText;
  private getAgeCellText;
  private getSizeCellText;
  private rangeSelectedCursor;
  private selectionCursor;
  cursorUp(): void;
  cursorDown(): void;
  cursorPageUp(): void;
  cursorPageDown(): void;
  cursorFirstResult(): void;
  cursorLastResult(): void;
  /**
   * Handles a 'g' keypress: 'G' (shift+g) jumps to the last result, while
   * pressing 'g' twice in quick succession (vim-style 'gg') jumps to the
   * first result.
   */
  private handleGPress;
  getSortLabel(): string;
  /** Cycles through size -> name (path) -> age sort modes, keeping the cursor on the current folder. */
  private cycleSort;
  fitScroll(): void;
  scrollFolderResults(scrollAmount: number): void;
  private moveCursor;
  private getFolderPathText;
  private paintStatusFolderPath;
  private printScrollBar;
  private isCursorInLowerLimit;
  private isCursorInUpperLimit;
  private getRealCursorPosY;
  private getVisibleScrollFolders;
  private paintBgRow;
  private delete;
  /** Returns the number of results that can be displayed. */
  private getRowsAvailable;
  /** Returns the row to which the index corresponds. */
  private getRow;
  private showErrorsPopup;
  private truncateText;
  private clamp;
  private get results();
}
