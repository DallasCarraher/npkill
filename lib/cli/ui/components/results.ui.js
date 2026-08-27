import {
  DECIMALS_SIZE,
  DEFAULT_CONFIG,
  MARGINS,
  OVERFLOW_CUT_FROM,
} from '../../../constants/main.constants.js';
import { HeavyUi } from '../heavy.ui.js';
import { INFO_MSGS } from '../../../constants/messages.constants.js';
import { Subject } from 'rxjs';
import pc from 'picocolors';
import { resolve } from 'node:path';
import { formatSize } from '../../../utils/unit-conversions.js';
import { getColumnLayout, getResultColumns } from './result-columns.js';
const CURSOR_ROW_COLOR = 'bgBlue';
/** Cycle order used by the 's' key to change the active sort mode. */
const SORT_CYCLE = ['size', 'path', 'age'];
const SORT_LABELS = {
  size: 'Size',
  path: 'Name',
  age: 'Age',
};
/** Max delay (ms) between two 'g' presses to be treated as 'gg'. */
const DOUBLE_G_PRESS_MS = 400;
export class ResultsUi extends HeavyUi {
  resultsService;
  consoleService;
  resultIndex = 0;
  previousIndex = 0;
  scroll = 0;
  haveResultsAfterCompleted = true;
  selectMode = false;
  selectedFolders = new Map();
  rangeSelectionStart = null;
  isRangeSelectionMode = false;
  delete$ = new Subject();
  deleteMultiple$ = new Subject();
  showErrors$ = new Subject();
  openFolder$ = new Subject();
  showDetails$ = new Subject();
  goOptions$ = new Subject();
  endNpkill$ = new Subject();
  search$ = new Subject();
  isSearchInputMode = false;
  searchText = '';
  filteredResults = [];
  sortIndex = 0;
  lastGPressTime = 0;
  config = DEFAULT_CONFIG;
  KEYS = {
    up: () => this.cursorUp(),
    down: () => this.cursorDown(),
    space: () => this.handleSpacePress(),
    delete: () => this.handleSpacePress(),
    j: () => this.cursorDown(),
    k: () => this.cursorUp(),
    h: () => this.goOptions(),
    l: () => this.showDetails(),
    d: () => this.cursorPageDown(),
    u: () => this.cursorPageUp(),
    pageup: () => this.cursorPageUp(),
    pagedown: () => this.cursorPageDown(),
    home: () => this.cursorFirstResult(),
    end: () => this.cursorLastResult(),
    e: () => this.showErrorsPopup(),
    o: () => this.openFolder(),
    right: () => this.showDetails(),
    left: () => this.goOptions(),
    q: () => this.endNpkill(),
    t: () => this.toggleSelectMode(),
    return: () => this.deleteSelected(),
    enter: () => this.deleteSelected(),
    v: () => this.startRangeSelection(),
    a: () => this.toggleSelectAll(),
    s: () => this.cycleSort(),
  };
  constructor(resultsService, consoleService, config) {
    super();
    this.resultsService = resultsService;
    this.consoleService = consoleService;
    if (config) {
      this.config = config;
    }
    const initialSortIndex = SORT_CYCLE.indexOf(this.config.sortBy);
    this.sortIndex = initialSortIndex === -1 ? 0 : initialSortIndex;
  }
  openFolder() {
    const folder = this.results[this.resultIndex];
    const parentPath = resolve(folder.path, '..');
    this.openFolder$.next(parentPath);
  }
  showDetails() {
    const result = this.results[this.resultIndex];
    if (!result) {
      return;
    }
    this.showDetails$.next(result);
  }
  goOptions() {
    if (this.searchText) {
      return;
    }
    this.goOptions$.next(null);
  }
  endNpkill() {
    this.endNpkill$.next(null);
  }
  toggleSelectMode() {
    this.selectMode = !this.selectMode;
    if (!this.selectMode) {
      this.selectedFolders.clear();
      this.rangeSelectionStart = null;
      this.isRangeSelectionMode = false;
    }
  }
  startRangeSelection() {
    if (!this.selectMode) {
      return;
    }
    if (this.isRangeSelectionMode) {
      // Selection mode was started, so end the range.
      this.isRangeSelectionMode = false;
      this.rangeSelectionStart = null;
      return;
    }
    this.isRangeSelectionMode = true;
    this.rangeSelectionStart = this.resultIndex;
    const folder = this.results[this.resultIndex];
    if (folder) {
      if (this.selectedFolders.has(folder.path)) {
        this.selectedFolders.delete(folder.path);
      } else {
        this.selectedFolders.set(folder.path, folder);
      }
    }
  }
  toggleSelectAll() {
    if (!this.selectMode) {
      return;
    }
    const allFolders = this.results;
    const totalFolders = allFolders.length;
    const selectedCount = this.selectedFolders.size;
    // If all folders are selected, deselect all
    // If some or none are selected, select all
    if (selectedCount === totalFolders) {
      this.selectedFolders.clear();
    } else {
      allFolders.forEach((folder) => {
        this.selectedFolders.set(folder.path, folder);
      });
    }
  }
  handleSpacePress() {
    if (!this.selectMode) {
      this.delete();
      return;
    }
    this.toggleFolderSelection();
  }
  toggleFolderSelection() {
    const folder = this.results[this.resultIndex];
    if (!folder) {
      return;
    }
    if (this.selectedFolders.has(folder.path)) {
      this.selectedFolders.delete(folder.path);
    } else {
      this.selectedFolders.set(folder.path, folder);
    }
  }
  applyRangeSelection() {
    if (
      !this.selectMode ||
      !this.isRangeSelectionMode ||
      this.rangeSelectionStart === null
    ) {
      return;
    }
    const start = Math.min(this.rangeSelectionStart, this.resultIndex);
    const end = Math.max(this.rangeSelectionStart, this.resultIndex);
    const firstFolder = this.results[this.rangeSelectionStart];
    if (!firstFolder) {
      return;
    }
    const shouldSelect = this.selectedFolders.has(firstFolder.path);
    for (let i = start; i <= end; i++) {
      const folder = this.results[i];
      if (!folder) {
        continue;
      }
      if (shouldSelect) {
        this.selectedFolders.set(folder.path, folder);
      } else {
        this.selectedFolders.delete(folder.path);
      }
    }
  }
  deleteSelected() {
    if (!this.selectMode || this.selectedFolders.size === 0) {
      return;
    }
    const selectedFolders = this.selectedFolders.entries();
    for (const [, folder] of selectedFolders) {
      this.delete$.next(folder);
    }
    this.selectedFolders.clear();
  }
  activateSearchInputMode() {
    this.isSearchInputMode = true;
    this.search$.next({ text: this.searchText, isInputActive: true });
    this.render();
  }
  handleSearchInput(key) {
    if (key.name === 'return' || key.name === 'enter') {
      this.isSearchInputMode = false;
      if (this.searchText.trim() === '') {
        this.searchText = '';
        this.search$.next(null);
      } else {
        this.search$.next({ text: this.searchText, isInputActive: false });
      }
      this.render();
      return;
    }
    if (key.name === 'backspace') {
      this.searchText = this.searchText.slice(0, -1);
    } else if (key.name === 'escape') {
      this.isSearchInputMode = false;
      this.searchText = '';
      this.search$.next(null);
      this.render();
      return;
    } else if (
      key.sequence &&
      key.sequence.length === 1 &&
      !key.ctrl &&
      !key.meta
    ) {
      this.searchText += key.sequence;
    } else {
      return;
    }
    this.filterResults();
    this.search$.next({ text: this.searchText, isInputActive: true });
    this.resultIndex = 0;
    this.scroll = 0;
    this.render();
  }
  filterResults() {
    try {
      const regex = new RegExp(this.searchText, 'i');
      this.filteredResults = this.resultsService.results.filter((r) =>
        regex.test(r.path),
      );
    } catch {
      this.filteredResults = [];
    }
  }
  onKeyInput(key) {
    if (this.isSearchInputMode) {
      this.handleSearchInput(key);
      return;
    }
    if (key.sequence === '/') {
      this.activateSearchInputMode();
      return;
    }
    if (key.name === 'g') {
      this.handleGPress(key.shift);
      if (this.visible) {
        this.render();
      }
      return;
    }
    const action = this.KEYS[key.name];
    if (action === undefined) {
      return;
    }
    action();
    if (this.visible) {
      this.render();
    }
  }
  render() {
    if (!this.visible) {
      return;
    }
    this.clear();
    if (!this.haveResultsAfterCompleted) {
      this.noResults();
      return;
    }
    this.printResults();
    const tagStartXPosition = 16;
    // 14 for the selection counter, 56 for the instruction message
    const maxClearLength = 14 + 56;
    const availableWidthForClear = this.terminal.columns - tagStartXPosition;
    const clearLength = Math.min(maxClearLength, availableWidthForClear);
    const clearSelectionCounterText = ' '.repeat(Math.max(0, clearLength));
    this.printAt(clearSelectionCounterText, {
      x: tagStartXPosition,
      y: MARGINS.ROW_RESULTS_START - 2,
    });
    if (this.selectMode) {
      const selectedMessage = ` ${this.selectedFolders.size} selected `;
      this.printAt(pc.bgYellow(pc.black(selectedMessage)), {
        x: tagStartXPosition,
        y: MARGINS.ROW_RESULTS_START - 2,
      });
      const instructionMessage = pc.gray(
        pc.bold('SPACE') +
          ': toggle | ' +
          pc.bold('v') +
          ': range | ' +
          pc.bold('a') +
          ': select all | ' +
          pc.bold('ENTER') +
          ': delete',
      );
      const startX = tagStartXPosition + selectedMessage.length + 1;
      const availableWidth = this.terminal.columns - startX;
      const truncatedInstructionMessage = this.truncateText(
        instructionMessage,
        availableWidth,
      );
      this.printAt(truncatedInstructionMessage, {
        x: startX,
        y: MARGINS.ROW_RESULTS_START - 2,
      });
    } else if (!this.isSearchInputMode) {
      const sortMessage = pc.gray(
        `Sort: ${pc.bold(this.getSortLabel())} (${pc.bold('s')}: cycle)`,
      );
      const availableWidth = this.terminal.columns - tagStartXPosition;
      this.printAt(this.truncateText(sortMessage, availableWidth), {
        x: tagStartXPosition,
        y: MARGINS.ROW_RESULTS_START - 2,
      });
    }
    this.printScrollBar();
    this.flush();
  }
  clear() {
    this.resetBufferState();
    for (let row = MARGINS.ROW_RESULTS_START; row < this.terminal.rows; row++) {
      this.clearLine(row);
    }
  }
  completeSearch() {
    if (this.resultsService.results.length === 0) {
      this.haveResultsAfterCompleted = false;
      this.render();
    }
  }
  printResults() {
    const visibleFolders = this.getVisibleScrollFolders();
    const layout = this.computeColumnLayout();
    visibleFolders.forEach((folder, index) => {
      const row = MARGINS.ROW_RESULTS_START + index;
      this.printFolderRow(folder, row, layout);
    });
  }
  computeColumnLayout() {
    return getColumnLayout(
      getResultColumns(this.config),
      this.terminal.columns,
    );
  }
  noResults() {
    const targetFolderColored = pc.yellowBright(this.config.targets.join(', '));
    const message = `No ${targetFolderColored} found!`;
    this.printAt(message, {
      x: Math.floor(this.terminal.columns / 2 - message.length / 2),
      y: MARGINS.ROW_RESULTS_START + 2,
    });
  }
  printFolderRow(folder, row, layout) {
    this.clearLine(row);
    let path = this.getFolderPathText(folder, layout);
    const isRowSelected =
      row === this.getRealCursorPosY() && !this.isSearchInputMode;
    // Adjust column start based on select mode
    const pathColumnStart = this.selectMode
      ? MARGINS.FOLDER_COLUMN_START + 1
      : MARGINS.FOLDER_COLUMN_START;
    if (isRowSelected) {
      path = pc[CURSOR_ROW_COLOR](path);
      this.paintBgRow(row, layout);
    }
    if (folder.riskAnalysis?.isSensitive) {
      path += '⚠️';
    }
    const isFolderSelected = this.selectedFolders.has(folder.path);
    if (folder.riskAnalysis?.isSensitive) {
      path = pc[isFolderSelected ? 'blue' : 'yellowBright'](path);
    } else if (!isRowSelected && isFolderSelected) {
      path = pc.blue(path);
    }
    if (this.selectMode && this.selectedFolders.has(folder.path)) {
      this.rangeSelectedCursor(row);
    }
    if (this.selectMode && this.isRangeSelectionMode && isRowSelected) {
      this.selectionCursor(row);
    }
    this.printAt(path, {
      x: pathColumnStart,
      y: row,
    });
    for (const { column, x } of layout.positions) {
      let cellText = this.getCellText(column.id, folder, isRowSelected);
      if (isRowSelected) {
        cellText = pc[CURSOR_ROW_COLOR](cellText);
      }
      this.printAt(cellText, { x, y: row });
    }
  }
  getCellText(columnId, folder, isRowSelected) {
    switch (columnId) {
      case 'age':
        return this.getAgeCellText(folder, isRowSelected);
      case 'size':
        return this.getSizeCellText(folder);
    }
  }
  getAgeCellText(folder, isRowSelected) {
    const WIDTH = 4;
    let text;
    if (folder.riskAnalysis?.isSensitive) {
      text = '';
    } else if (
      folder.modificationTime !== null &&
      folder.modificationTime > 0
    ) {
      const days = Math.floor(
        (new Date().getTime() / 1000 - folder.modificationTime) / 86400,
      );
      text = `${Math.min(days, 999)}d`;
    } else {
      text = '...';
    }
    const padded = text.padStart(WIDTH).slice(0, WIDTH);
    return isRowSelected ? pc.white(padded) : pc.gray(padded);
  }
  getSizeCellText(folder) {
    const WIDTH = 9;
    const alignSizeText = (text) =>
      text
        .padStart(WIDTH - 1)
        .padEnd(WIDTH)
        .slice(0, WIDTH);
    const isCalculating = folder.size === 0 && folder.modificationTime === -1;
    if (isCalculating) {
      return pc.gray(alignSizeText('.....'));
    }
    const formattedSize = formatSize(
      folder.size,
      this.config.sizeUnit,
      DECIMALS_SIZE,
    );
    return alignSizeText(formattedSize.text);
  }
  rangeSelectedCursor(row) {
    this.printAt('●', {
      x: MARGINS.FOLDER_COLUMN_START,
      y: row,
    });
  }
  selectionCursor(row) {
    const indicator = this.isRangeSelectionMode ? '●' : ' ';
    this.printAt(pc.yellow(indicator), {
      x: MARGINS.FOLDER_COLUMN_START - 1,
      y: row,
    });
  }
  cursorUp() {
    this.moveCursor(-1);
  }
  cursorDown() {
    this.moveCursor(1);
  }
  cursorPageUp() {
    const resultsInPage = this.getRowsAvailable();
    this.moveCursor(-(resultsInPage - 2));
  }
  cursorPageDown() {
    const resultsInPage = this.getRowsAvailable();
    this.moveCursor(resultsInPage - 2);
  }
  cursorFirstResult() {
    this.moveCursor(-this.resultIndex);
  }
  cursorLastResult() {
    this.moveCursor(this.results.length - 1);
  }
  /**
   * Handles a 'g' keypress: 'G' (shift+g) jumps to the last result, while
   * pressing 'g' twice in quick succession (vim-style 'gg') jumps to the
   * first result.
   */
  handleGPress(shift) {
    if (shift) {
      this.cursorLastResult();
      this.lastGPressTime = 0;
      return;
    }
    const now = Date.now();
    if (now - this.lastGPressTime <= DOUBLE_G_PRESS_MS) {
      this.cursorFirstResult();
      this.lastGPressTime = 0;
    } else {
      this.lastGPressTime = now;
    }
  }
  getSortLabel() {
    return SORT_LABELS[SORT_CYCLE[this.sortIndex]];
  }
  /** Cycles through size -> name (path) -> age sort modes, keeping the cursor on the current folder. */
  cycleSort() {
    const currentFolder = this.results[this.resultIndex];
    this.sortIndex = (this.sortIndex + 1) % SORT_CYCLE.length;
    const sortMode = SORT_CYCLE[this.sortIndex];
    this.resultsService.sortResults(sortMode);
    if (this.searchText) {
      this.filterResults();
    }
    const newIndex = currentFolder
      ? this.results.findIndex((f) => f.path === currentFolder.path)
      : -1;
    this.resultIndex = newIndex === -1 ? 0 : newIndex;
    this.scroll = 0;
    this.fitScroll();
    this.clear();
  }
  fitScroll() {
    const shouldScrollUp =
      this.getRow(this.resultIndex) <
      MARGINS.ROW_RESULTS_START + this.scroll + 1;
    const shouldScrollDown =
      this.getRow(this.resultIndex) > this.terminal.rows + this.scroll - 2;
    const isOnBotton = this.resultIndex === this.results.length - 1;
    let scrollRequired = 0;
    if (shouldScrollUp) {
      scrollRequired =
        this.getRow(this.resultIndex) -
        MARGINS.ROW_RESULTS_START -
        this.scroll -
        1;
    } else if (shouldScrollDown) {
      scrollRequired =
        this.getRow(this.resultIndex) - this.terminal.rows - this.scroll + 2;
      if (isOnBotton) {
        scrollRequired -= 1;
      }
    }
    if (scrollRequired !== 0) {
      this.scrollFolderResults(scrollRequired);
    }
  }
  scrollFolderResults(scrollAmount) {
    const virtualFinalScroll = this.scroll + scrollAmount;
    this.scroll = this.clamp(virtualFinalScroll, 0, this.results.length);
    this.clear();
  }
  moveCursor(index) {
    this.previousIndex = this.resultIndex;
    this.resultIndex += index;
    // Upper limit
    if (this.isCursorInLowerLimit()) {
      this.resultIndex = 0;
    }
    // Lower limit
    if (this.isCursorInUpperLimit()) {
      this.resultIndex = this.results.length - 1;
    }
    this.fitScroll();
    if (this.isRangeSelectionMode) {
      this.applyRangeSelection();
    }
  }
  getFolderPathText(folder, layout) {
    let cutFrom = OVERFLOW_CUT_FROM;
    let text = folder.path;
    const ACTIONS = {
      deleted: () => {
        cutFrom += INFO_MSGS.DELETED_FOLDER.length;
        text = INFO_MSGS.DELETED_FOLDER + text;
      },
      deleting: () => {
        cutFrom += INFO_MSGS.DELETING_FOLDER.length;
        text = INFO_MSGS.DELETING_FOLDER + text;
      },
      'error-deleting': () => {
        cutFrom += INFO_MSGS.ERROR_DELETING_FOLDER.length;
        text = INFO_MSGS.ERROR_DELETING_FOLDER + text;
      },
    };
    if (ACTIONS[folder.status] !== undefined) {
      ACTIONS[folder.status]();
    }
    const columnEnd = this.selectMode
      ? layout.pathReservedWidth + 1
      : layout.pathReservedWidth;
    text = this.consoleService.shortenText(
      text,
      this.terminal.columns - columnEnd,
      cutFrom,
    );
    // This is necessary for the coloring of the text, since
    // the shortener takes into ansi-scape codes invisible
    // characters and can cause an error in the cli.
    text = this.paintStatusFolderPath(text, folder.status);
    return text;
  }
  paintStatusFolderPath(folderString, action) {
    const TRANSFORMATIONS = {
      deleted: (text) =>
        text.replace(
          INFO_MSGS.DELETED_FOLDER,
          pc.green(INFO_MSGS.DELETED_FOLDER),
        ),
      deleting: (text) =>
        text.replace(
          INFO_MSGS.DELETING_FOLDER,
          pc.yellow(INFO_MSGS.DELETING_FOLDER),
        ),
      'error-deleting': (text) =>
        text.replace(
          INFO_MSGS.ERROR_DELETING_FOLDER,
          pc.red(INFO_MSGS.ERROR_DELETING_FOLDER),
        ),
    };
    return TRANSFORMATIONS[action] !== undefined
      ? TRANSFORMATIONS[action](folderString)
      : folderString;
  }
  printScrollBar() {
    const SCROLLBAR_ACTIVE = pc.gray('█');
    const SCROLLBAR_BG = pc.gray('┊');
    const totalResults = this.results.length;
    const visibleRows = this.getRowsAvailable();
    if (totalResults <= visibleRows) {
      return;
    }
    const scrollPercentage = this.scroll / (totalResults - visibleRows);
    const start = MARGINS.ROW_RESULTS_START;
    const end = this.terminal.rows - 1;
    const scrollBarPosition = Math.round(
      scrollPercentage * (end - start) + start,
    );
    for (let i = start; i <= end; i++) {
      this.printAt(SCROLLBAR_BG, {
        x: this.terminal.columns - 1,
        y: i,
      });
    }
    this.printAt(SCROLLBAR_ACTIVE, {
      x: this.terminal.columns - 1,
      y: scrollBarPosition,
    });
  }
  isCursorInLowerLimit() {
    return this.resultIndex < 0;
  }
  isCursorInUpperLimit() {
    return this.resultIndex >= this.results.length;
  }
  getRealCursorPosY() {
    return this.getRow(this.resultIndex) - this.scroll;
  }
  getVisibleScrollFolders() {
    return this.results.slice(
      this.scroll,
      this.getRowsAvailable() + this.scroll,
    );
  }
  paintBgRow(row, layout) {
    const startPaint = MARGINS.FOLDER_COLUMN_START;
    const endPaint =
      layout.positions.length > 0
        ? layout.firstColumnX
        : this.terminal.columns - 1;
    let paintSpaces = '';
    for (let i = startPaint; i < endPaint; ++i) {
      paintSpaces += ' ';
    }
    this.printAt(pc[CURSOR_ROW_COLOR](paintSpaces), {
      x: startPaint,
      y: row,
    });
  }
  delete() {
    const folder = this.results[this.resultIndex];
    this.delete$.next(folder);
  }
  /** Returns the number of results that can be displayed. */
  getRowsAvailable() {
    return this.terminal.rows - MARGINS.ROW_RESULTS_START;
  }
  /** Returns the row to which the index corresponds. */
  getRow(index) {
    return index + MARGINS.ROW_RESULTS_START;
  }
  showErrorsPopup() {
    this.showErrors$.next(null);
  }
  truncateText(text, maxLength) {
    const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');
    const plainText = stripAnsi(text);
    if (plainText.length <= maxLength) {
      return text;
    }
    const targetLength = maxLength - 3;
    if (targetLength <= 0) {
      return '...';
    }
    let visibleLength = 0;
    let output = '';
    let i = 0;
    const ansiRegex = /\x1b\[[0-9;]*m/;
    while (i < text.length && visibleLength < targetLength) {
      const remaining = text.substring(i);
      const match = remaining.match(ansiRegex);
      if (match && match.index === 0) {
        output += match[0];
        i += match[0].length;
      } else {
        output += text[i];
        visibleLength++;
        i++;
      }
    }
    return output + '...' + '\x1b[0m';
  }
  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  get results() {
    return this.searchText ? this.filteredResults : this.resultsService.results;
  }
}
//# sourceMappingURL=results.ui.js.map
