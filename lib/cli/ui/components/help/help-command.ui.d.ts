import { ConsoleService } from '../../../services/console.service.js';
import { BaseUi } from '../../base.ui.js';
export declare class HelpCommandUi extends BaseUi {
  private readonly consoleService;
  constructor(consoleService: ConsoleService);
  render(): void;
  show(): void;
  clear(): void;
}
