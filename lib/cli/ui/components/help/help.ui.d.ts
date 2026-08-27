import { BaseUi, InteractiveUi } from '../../base.ui.js';
import { IKeyPress } from '../../../interfaces/key-press.interface.js';
import { Subject } from 'rxjs';
export declare class HelpUi extends BaseUi implements InteractiveUi {
  resultIndex: number;
  readonly goToOptions$: Subject<null>;
  private selectedSection;
  private scrollOffset;
  private readonly INDEX_WIDTH;
  private readonly SCROLL_STEP;
  private readonly KEYS;
  constructor();
  private previousSection;
  private nextSection;
  private selectSection;
  private scrollUp;
  private scrollDown;
  private scrollPageUp;
  private scrollPageDown;
  private scrollToTop;
  private scrollToBottom;
  private goToOptions;
  private getContentAreaHeight;
  onKeyInput({ name }: IKeyPress): void;
  render(): void;
  private drawIndex;
  private drawContent;
  /** Get real width, removing ANSI color codes. */
  private getStringWidth;
  clear(): void;
}
