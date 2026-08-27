import { MARGINS } from '../../../../constants/main.constants.js';
import { BaseUi } from '../../base.ui.js';
import { Subject } from 'rxjs';
import pc from 'picocolors';
import { HELP_SECTIONS } from './help.constants.js';
export class HelpUi extends BaseUi {
  resultIndex = 0;
  goToOptions$ = new Subject();
  selectedSection = 0;
  scrollOffset = 0;
  INDEX_WIDTH = 23;
  SCROLL_STEP = 2;
  KEYS = {
    up: () => this.previousSection(),
    down: () => this.nextSection(),
    k: () => this.scrollUp(),
    j: () => this.scrollDown(),
    u: () => this.scrollPageUp(),
    d: () => this.scrollPageDown(),
    pageup: () => this.scrollPageUp(),
    pagedown: () => this.scrollPageDown(),
    home: () => this.scrollToTop(),
    end: () => this.scrollToBottom(),
    right: () => this.goToOptions(),
    l: () => this.goToOptions(),
    q: () => this.goToOptions(),
    escape: () => this.goToOptions(),
    return: () => this.selectSection(),
  };
  constructor() {
    super();
  }
  previousSection() {
    if (this.selectedSection > 0) {
      this.selectedSection--;
      this.scrollOffset = 0;
      this.render();
    }
  }
  nextSection() {
    if (this.selectedSection < HELP_SECTIONS.length - 1) {
      this.selectedSection++;
      this.scrollOffset = 0;
      this.render();
    }
  }
  selectSection() {
    this.scrollOffset = 0;
    this.render();
  }
  scrollUp() {
    if (this.scrollOffset > 0) {
      this.scrollOffset = Math.max(0, this.scrollOffset - this.SCROLL_STEP);
      this.render();
    }
  }
  scrollDown() {
    const currentSection = HELP_SECTIONS[this.selectedSection];
    const contentHeight = this.getContentAreaHeight();
    const maxScroll = Math.max(
      0,
      currentSection.content.length - contentHeight,
    );
    if (this.scrollOffset < maxScroll) {
      this.scrollOffset = Math.min(
        maxScroll,
        this.scrollOffset + this.SCROLL_STEP,
      );
      this.render();
    }
  }
  scrollPageUp() {
    const pageSize = this.getContentAreaHeight() - 2;
    this.scrollOffset = Math.max(0, this.scrollOffset - pageSize);
    this.render();
  }
  scrollPageDown() {
    const currentSection = HELP_SECTIONS[this.selectedSection];
    const contentHeight = this.getContentAreaHeight();
    const pageSize = contentHeight - 2;
    const maxScroll = Math.max(
      0,
      currentSection.content.length - contentHeight,
    );
    this.scrollOffset = Math.min(maxScroll, this.scrollOffset + pageSize);
    this.render();
  }
  scrollToTop() {
    this.scrollOffset = 0;
    this.render();
  }
  scrollToBottom() {
    const currentSection = HELP_SECTIONS[this.selectedSection];
    const contentHeight = this.getContentAreaHeight();
    this.scrollOffset = Math.max(
      0,
      currentSection.content.length - contentHeight,
    );
    this.render();
  }
  goToOptions() {
    this.clear();
    this.goToOptions$.next(null);
  }
  getContentAreaHeight() {
    return this.terminal.rows - MARGINS.ROW_RESULTS_START - 4;
  }
  onKeyInput({ name }) {
    const action = this.KEYS[name];
    if (action === undefined) {
      return;
    }
    action();
  }
  render() {
    this.clear();
    const startRow = MARGINS.ROW_RESULTS_START;
    const contentAreaHeight = this.getContentAreaHeight();
    // Header hint
    this.printAt(
      pc.dim('Use ') +
        pc.green('↑/↓') +
        pc.dim(' to change section, ') +
        pc.green('j/k') +
        pc.dim(' to scroll.'),
      { x: 2, y: startRow },
    );
    this.drawIndex(startRow + 2);
    this.drawContent(startRow + 2, contentAreaHeight);
  }
  drawIndex(startRow) {
    const indexHeight = this.terminal.rows - startRow - 1;
    this.printAt(pc.gray('╭' + '─'.repeat(this.INDEX_WIDTH - 2) + '╮'), {
      x: 2,
      y: startRow - 1,
    });
    for (let i = 0; i < Math.min(HELP_SECTIONS.length, indexHeight); i++) {
      const section = HELP_SECTIONS[i];
      const isSelected = i === this.selectedSection;
      const padding = ' '.repeat(
        Math.max(0, this.INDEX_WIDTH - section.title.length - 6),
      );
      const line = ` ${section.icon} ${section.title}${padding}`;
      if (isSelected) {
        this.printAt(pc.gray('│') + pc.bgCyan(pc.black(line)) + pc.gray('│'), {
          x: 2,
          y: startRow + i,
        });
      } else {
        this.printAt(pc.gray('│') + pc.white(line) + pc.gray('│'), {
          x: 2,
          y: startRow + i,
        });
      }
    }
    const bottomRow = startRow + Math.min(HELP_SECTIONS.length, indexHeight);
    this.printAt(pc.gray('╰' + '─'.repeat(this.INDEX_WIDTH - 2) + '╯'), {
      x: 2,
      y: bottomRow,
    });
  }
  drawContent(startRow, contentHeight) {
    const currentSection = HELP_SECTIONS[this.selectedSection];
    const contentStartX = this.INDEX_WIDTH + 2;
    const contentWidth = Math.max(
      20,
      this.terminal.columns - contentStartX - 4,
    );
    this.printAt(pc.gray('╭' + '─'.repeat(contentWidth) + '╮'), {
      x: contentStartX,
      y: startRow - 1,
    });
    const visibleContent = currentSection.content.slice(
      this.scrollOffset,
      this.scrollOffset + contentHeight,
    );
    for (let i = 0; i < contentHeight; i++) {
      const line = visibleContent[i] || '';
      const padding = ' '.repeat(
        Math.max(0, contentWidth - this.getStringWidth(line) - 1),
      );
      this.printAt(pc.gray('│ ') + line + padding + pc.gray('│'), {
        x: contentStartX,
        y: startRow + i,
      });
    }
    this.printAt(pc.gray('╰' + '─'.repeat(contentWidth) + '╯'), {
      x: contentStartX,
      y: startRow + contentHeight,
    });
  }
  /** Get real width, removing ANSI color codes. */
  getStringWidth(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[[0-9;]*m/g, '').length;
  }
  clear() {
    for (let row = MARGINS.ROW_RESULTS_START; row < this.terminal.rows; row++) {
      this.clearLine(row);
    }
  }
}
//# sourceMappingURL=help.ui.js.map
