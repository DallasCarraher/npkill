import { UI_POSITIONS, INFO_MSGS } from '../../../../constants/index.js';
import { BaseUi } from '../../base.ui.js';
import pc from 'picocolors';
export class StatsUi extends BaseUi {
  config;
  resultsService;
  logger;
  lastValues = {
    totalSpace: '',
    spaceReleased: '',
  };
  timeouts = {
    totalSpace: setTimeout(() => {}),
    spaceReleased: setTimeout(() => {}),
  };
  lastResultTypesValues = new Map();
  resultTypesTimeouts = new Map();
  constructor(config, resultsService, logger) {
    super();
    this.config = config;
    this.resultsService = resultsService;
    this.logger = logger;
  }
  // Prevent bug where the "Releasable space" and "Saved Space" got o 0.
  reset() {
    this.lastValues = {
      totalSpace: '',
      spaceReleased: '',
    };
    this.lastResultTypesValues.clear();
  }
  render() {
    const { totalSpace, spaceReleased, resultsTypesCount } =
      this.resultsService.getStats();
    if (!this.config.disableSize) {
      this.showStat({
        description: INFO_MSGS.TOTAL_SPACE,
        value: totalSpace.text,
        lastValueKey: 'totalSpace',
        position: UI_POSITIONS.TOTAL_SPACE,
        updateColor: 'yellow',
      });
      this.showStat({
        description: INFO_MSGS.SPACE_RELEASED,
        value: spaceReleased.text,
        lastValueKey: 'spaceReleased',
        position: UI_POSITIONS.SPACE_RELEASED,
        updateColor: 'green',
      });
    }
    if (this.config.showErrors) {
      this.showErrorsCount();
    }
    this.showResultsTypesCount(resultsTypesCount);
    this.showActivePreset();
  }
  /** Print the value of the stat and if it is a different value from the
   * previous run, highlight it for a while.
   */
  showStat({ description, value, lastValueKey, position, updateColor }) {
    const statPosition = { ...position };
    statPosition.x += description.length;
    if (value !== this.lastValues[lastValueKey]) {
      // If is first render, initialize.
      if (!this.lastValues[lastValueKey]) {
        this.printAt(value, statPosition);
        this.lastValues[lastValueKey] = value;
        return;
      }
      this.printAt(pc[updateColor](`${value} ▲`), statPosition);
      if (this.timeouts[lastValueKey]) {
        clearTimeout(this.timeouts[lastValueKey]);
      }
      this.timeouts[lastValueKey] = setTimeout(() => {
        this.printAt(value + '  ', statPosition);
      }, 700);
      this.lastValues[lastValueKey] = value;
    } else {
      this.printAt(value, statPosition);
    }
  }
  showErrorsCount() {
    const errors = this.logger.get('error').length;
    if (errors === 0) {
      return;
    }
    const text = `${errors} error${errors > 1 ? 's' : ''}. 'e' to see`;
    this.printAt(pc.yellow(text), { ...UI_POSITIONS.ERRORS_COUNT });
  }
  showActivePreset() {
    const MIN_TERMINAL_WIDTH = 94;
    if (this.terminal.columns < MIN_TERMINAL_WIDTH) {
      return;
    }
    const RIGHT_MARGIN = 2;
    const CLEAR_LENGTH = 50;
    const xStartClear = this.terminal.columns - CLEAR_LENGTH - RIGHT_MARGIN;
    const clearText = ' '.repeat(CLEAR_LENGTH);
    this.printAt(clearText, { x: xStartClear, y: 0 });
    if (!this.config.profiles || this.config.profiles.length === 0) {
      return;
    }
    const text = `[${this.config.profiles.join(', ')}]`;
    const xPosition = this.terminal.columns - text.length - RIGHT_MARGIN;
    this.printAt(pc.gray(pc.bold(text)), { x: xPosition, y: 0 });
  }
  showResultsTypesCount(resultsTypesCount) {
    const MAX_CONTENT_LENGTH = 20;
    const RIGHT_MARGIN = 2;
    const MIN_TERMINAL_WIDTH = 94;
    const START_Y = 1;
    const NUM_ROWS = 5;
    if (this.terminal.columns < MIN_TERMINAL_WIDTH) {
      return;
    }
    const clearText = ' '.repeat(MAX_CONTENT_LENGTH);
    const xStart = this.terminal.columns - MAX_CONTENT_LENGTH - RIGHT_MARGIN;
    for (let i = 0; i < NUM_ROWS; i++) {
      const yPos = START_Y + i;
      this.printAt(clearText, { x: xStart, y: yPos });
    }
    const positions = [
      { key: 'row1', yPosition: 1 },
      { key: 'row2', yPosition: 2 },
      { key: 'row3', yPosition: 3 },
      { key: 'row4', yPosition: 4 },
      { key: 'row5', yPosition: 5 },
    ];
    const maxRows = 5;
    if (resultsTypesCount.length <= maxRows) {
      resultsTypesCount.forEach((item, index) => {
        const { key, yPosition } = positions[index];
        const text = this.formatResultTypeText(
          item.count,
          item.type,
          MAX_CONTENT_LENGTH,
        );
        const xPosition = this.terminal.columns - text.length - RIGHT_MARGIN;
        this.showResultTypeRow(key, text, { x: xPosition, y: yPosition });
      });
    } else {
      const topTypes = resultsTypesCount.slice(0, 4);
      const remainingTypes = resultsTypesCount.slice(4);
      topTypes.forEach((item, index) => {
        const { key, yPosition } = positions[index];
        const text = this.formatResultTypeText(
          item.count,
          item.type,
          MAX_CONTENT_LENGTH,
        );
        const xPosition = this.terminal.columns - text.length - RIGHT_MARGIN;
        this.showResultTypeRow(key, text, { x: xPosition, y: yPosition });
      });
      // Show summary in 5th row
      const totalRemaining = remainingTypes.reduce(
        (sum, item) => sum + item.count,
        0,
      );
      const { key, yPosition } = positions[4];
      const summaryText = `[+${remainingTypes.length}·total ${totalRemaining}]`;
      const trimmedSummary =
        summaryText.length > MAX_CONTENT_LENGTH
          ? summaryText.substring(0, MAX_CONTENT_LENGTH - 3) + '...'
          : summaryText;
      const xPosition =
        this.terminal.columns - trimmedSummary.length - RIGHT_MARGIN;
      this.showResultTypeRow(key, trimmedSummary, {
        x: xPosition,
        y: yPosition,
      });
    }
  }
  formatResultTypeText(count, type, maxLength) {
    const countStr = count.toString();
    const baseLength = countStr.length + 3; // ' (' and ')'
    const fullText = `${type} (${countStr})`;
    if (fullText.length <= maxLength) {
      return fullText;
    }
    const maxTypeLength = maxLength - baseLength;
    const trimmedType =
      type.length > maxTypeLength
        ? type.substring(0, maxTypeLength - 3) + '...'
        : type;
    return `${trimmedType} (${countStr})`;
  }
  showResultTypeRow(rowKey, text, position) {
    const lastValue = this.lastResultTypesValues.get(rowKey);
    const valueChanged = text !== lastValue;
    const hasActiveHighlight = this.resultTypesTimeouts.has(rowKey);
    const shouldHighlight = valueChanged && lastValue !== undefined;
    if (shouldHighlight) {
      this.printAt(pc.white(text), { ...position });
      const previousTimeout = this.resultTypesTimeouts.get(rowKey);
      if (previousTimeout) {
        clearTimeout(previousTimeout);
      }
      const timeout = setTimeout(() => {
        this.printAt(pc.gray(text), { ...position });
        this.resultTypesTimeouts.delete(rowKey);
      }, 300);
      this.resultTypesTimeouts.set(rowKey, timeout);
    } else if (hasActiveHighlight) {
      this.printAt(pc.white(text), { ...position });
    } else {
      this.printAt(pc.gray(text), { ...position });
    }
    this.lastResultTypesValues.set(rowKey, text);
  }
}
//# sourceMappingURL=stats.ui.js.map
