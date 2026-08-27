import { BaseUi } from '../../base.ui.js';
import { ResultsService } from '../../../services/results.service.js';
import { LoggerService } from '@core/services/logger.service.js';
import { IConfig } from '../../../interfaces/config.interface.js';
export declare class StatsUi extends BaseUi {
  private readonly config;
  private readonly resultsService;
  private readonly logger;
  private lastValues;
  private timeouts;
  private lastResultTypesValues;
  private resultTypesTimeouts;
  constructor(
    config: IConfig,
    resultsService: ResultsService,
    logger: LoggerService,
  );
  reset(): void;
  render(): void;
  /** Print the value of the stat and if it is a different value from the
   * previous run, highlight it for a while.
   */
  private showStat;
  private showErrorsCount;
  private showActivePreset;
  private showResultsTypesCount;
  private formatResultTypeText;
  private showResultTypeRow;
}
