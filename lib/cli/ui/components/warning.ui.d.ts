import { InteractiveUi, BaseUi } from '../base.ui.js';
import { Subject } from 'rxjs';
import { IKeyPress } from '../../interfaces/key-press.interface.js';
export declare class WarningUi extends BaseUi implements InteractiveUi {
  private showDeleteAllWarning;
  readonly confirm$: Subject<null>;
  private readonly KEYS;
  onKeyInput({ name }: IKeyPress): void;
  setDeleteAllWarningVisibility(visible: boolean): void;
  render(): void;
  private printDeleteAllWarning;
}
