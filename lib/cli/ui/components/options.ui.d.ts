import { BaseUi, InteractiveUi } from '../base.ui.js';
import { IKeyPress } from '../../interfaces/key-press.interface.js';
import { Subject } from 'rxjs';
import { IConfig } from '../../../cli/interfaces/config.interface.js';
export declare class OptionsUi extends BaseUi implements InteractiveUi {
  private readonly changeConfig$;
  resultIndex: number;
  readonly goBack$: Subject<null>;
  readonly goToHelp$: Subject<null>;
  private readonly config;
  private selectedIndex;
  private isEditing;
  private editBuffer;
  private options;
  private readonly KEYS;
  constructor(changeConfig$: Subject<Partial<IConfig>>, config: IConfig);
  private initializeOptions;
  private move;
  private activateSelected;
  private handleEditKey;
  private emitConfigChange;
  private cancelEdit;
  onKeyInput(key: IKeyPress): void;
  private goBack;
  private goToHelp;
  render(): void;
  private printHintMessage;
  clear(): void;
}
