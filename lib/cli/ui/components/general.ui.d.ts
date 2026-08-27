import { IStats } from '../../interfaces/stats.interface.js';
import { BaseUi } from '../base.ui.js';
export declare class GeneralUi extends BaseUi {
  render(): void;
  printExitMessage({ stats }: { stats: IStats }): Promise<void>;
  private getPhrase;
  private getUnicorn;
  private rainbow;
}
