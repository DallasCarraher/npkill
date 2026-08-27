import { BaseUi, InteractiveUi } from '../base.ui.js';
import { IKeyPress } from '../../interfaces/key-press.interface.js';
import { Subject } from 'rxjs';
import { CliScanFoundFolder } from '../../../cli/interfaces/stats.interface.js';
import { IConfig } from '../../interfaces/config.interface.js';
export declare class ResultDetailsUi extends BaseUi implements InteractiveUi {
  private readonly result;
  private readonly config;
  resultIndex: number;
  readonly goBack$: Subject<null>;
  readonly openFolder$: Subject<string>;
  private readonly KEYS;
  constructor(result: CliScanFoundFolder, config: IConfig);
  private openFolder;
  private goBack;
  onKeyInput({ name }: IKeyPress): void;
  render(): void;
  clear(): void;
  /** Returns the number of results that can be displayed. */
  private getRowsAvailable;
  /** Returns the row to which the index corresponds. */
  private getRow;
}
