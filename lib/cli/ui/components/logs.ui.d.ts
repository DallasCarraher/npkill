import { LoggerService } from '@core/services/logger.service.js';
import { InteractiveUi, BaseUi } from '../base.ui.js';
import { Subject } from 'rxjs';
import { IKeyPress } from '../../interfaces/key-press.interface.js';
export declare class LogsUi extends BaseUi implements InteractiveUi {
  private readonly logger;
  readonly close$: Subject<null>;
  private size;
  private errors;
  private pages;
  private actualPage;
  private readonly KEYS;
  constructor(logger: LoggerService);
  onKeyInput({ name }: IKeyPress): void;
  render(): void;
  private cyclePages;
  private close;
  private renderPopup;
  private printHeader;
  private stylizeText;
  private chunkString;
  private chunkArray;
  private calculatePosition;
}
