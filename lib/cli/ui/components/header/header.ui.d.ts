import { BehaviorSubject } from 'rxjs';
import { BaseUi } from '../../base.ui.js';
import { IConfig } from '../../../../cli/interfaces/config.interface.js';
import { MENU_BAR_OPTIONS } from './header-ui.constants.js';
export declare class HeaderUi extends BaseUi {
  private readonly config;
  programVersion: string;
  private activeMenuIndex;
  private searchMode;
  private searchText;
  private isSearchInputActive;
  readonly menuIndex$: BehaviorSubject<MENU_BAR_OPTIONS>;
  constructor(config: IConfig);
  setSearch(text: string | null, isInputActive?: boolean): void;
  render(): void;
  private renderHeader;
  private renderMenuBar;
}
