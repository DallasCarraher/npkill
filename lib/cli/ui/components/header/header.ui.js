import { BehaviorSubject } from 'rxjs';
import {
  BANNER,
  UI_POSITIONS,
  MENU_BAR,
  INFO_MSGS,
} from '../../../../constants/index.js';
import { BaseUi } from '../../base.ui.js';
import pc from 'picocolors';
import { MENU_BAR_OPTIONS } from './header-ui.constants.js';
import { getColumnLayout, getResultColumns } from '../result-columns.js';
export class HeaderUi extends BaseUi {
  config;
  programVersion;
  activeMenuIndex = MENU_BAR_OPTIONS.DELETE;
  searchMode = false;
  searchText = '';
  isSearchInputActive = false;
  menuIndex$ = new BehaviorSubject(MENU_BAR_OPTIONS.DELETE);
  constructor(config) {
    super();
    this.config = config;
    this.menuIndex$.subscribe((menuIndex) => {
      this.activeMenuIndex = menuIndex;
      this.render();
    });
  }
  setSearch(text, isInputActive = false) {
    if (text === null) {
      this.searchMode = false;
      this.searchText = '';
      this.isSearchInputActive = false;
    } else {
      this.searchMode = true;
      this.searchText = text;
      this.isSearchInputActive = isInputActive;
    }
    this.render();
  }
  render() {
    // banner and tutorial
    this.printAt(BANNER, UI_POSITIONS.INITIAL);
    this.renderHeader();
    this.renderMenuBar();
    if (this.programVersion !== undefined) {
      this.printAt(pc.gray(this.programVersion), UI_POSITIONS.VERSION);
    }
    if (this.config.dryRun) {
      this.printAt(
        pc.black(pc.bgMagenta(` ${INFO_MSGS.DRY_RUN} `)),
        UI_POSITIONS.DRY_RUN_NOTICE,
      );
    }
    // Columns headers
    if (this.activeMenuIndex === MENU_BAR_OPTIONS.DELETE) {
      const layout = getColumnLayout(
        getResultColumns(this.config),
        this.terminal.columns,
      );
      if (layout.columns.length > 0) {
        this.printAt(pc.bgYellow(pc.black(layout.headerText)), {
          x: layout.firstColumnX,
          y: UI_POSITIONS.FOLDER_SIZE_HEADER.y,
        });
      }
    }
    // npkill stats
    if (!this.config.disableSize) {
      this.printAt(pc.gray(INFO_MSGS.TOTAL_SPACE), UI_POSITIONS.TOTAL_SPACE);
      this.printAt(
        pc.gray(INFO_MSGS.SPACE_RELEASED),
        UI_POSITIONS.SPACE_RELEASED,
      );
    }
  }
  renderHeader() {
    const { columns } = this.terminal;
    const spaceToFill = Math.max(0, columns - 2);
    this.printAt(
      pc.bgYellow(' '.repeat(spaceToFill)),
      UI_POSITIONS.TUTORIAL_TIP,
    );
  }
  renderMenuBar() {
    if (this.searchMode) {
      let searchText = ` Search: ${this.searchText} `;
      if (this.isSearchInputActive) {
        searchText = ` Search: ${this.searchText}_ `;
        this.printAt(pc.bgBlue(pc.white(searchText)), {
          x: 1,
          y: UI_POSITIONS.TUTORIAL_TIP.y,
        });
      } else {
        this.printAt(pc.bgWhite(pc.black(searchText)), {
          x: 1,
          y: UI_POSITIONS.TUTORIAL_TIP.y,
        });
      }
      return;
    }
    const options = Object.values(MENU_BAR);
    let xStart = 2;
    for (const option of options) {
      const isActive = option === options[this.activeMenuIndex];
      const colorFn = isActive
        ? (v) => pc.bgYellow(pc.black(pc.bold(pc.underline(v))))
        : (v) => pc.bgYellow(pc.gray(v));
      this.printAt(colorFn(option), {
        x: xStart,
        y: UI_POSITIONS.TUTORIAL_TIP.y,
      });
      const MARGIN = 1;
      xStart += option.length + MARGIN;
    }
  }
}
//# sourceMappingURL=header.ui.js.map
