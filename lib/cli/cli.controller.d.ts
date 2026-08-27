import {
  ConsoleService,
  ResultsService,
  SpinnerService,
  UpdateService,
} from './services/index.js';
import { UiService } from './services/ui.service.js';
import { Npkill, ConfigService, ProfilesService } from '../core/index.js';
import { LoggerService } from '../core/services/logger.service.js';
import { ScanStatus } from '../core/interfaces/search-status.model.js';
import { ScanService } from './services/scan.service.js';
import { JsonOutputService } from './services/json-output.service.js';
export declare class CliController {
  private readonly stdout;
  private readonly npkill;
  private readonly logger;
  private readonly searchStatus;
  private readonly resultsService;
  private readonly spinnerService;
  private readonly consoleService;
  private readonly updateService;
  private readonly uiService;
  private readonly scanService;
  private readonly jsonOutputService;
  private readonly profilesService;
  private readonly configService;
  private readonly config;
  private searchStart;
  private searchDuration;
  private uiHeader;
  private uiGeneral;
  private uiStats;
  private uiStatus;
  private uiResults;
  private uiLogs;
  private uiWarning;
  private activeComponent;
  constructor(
    stdout: NodeJS.WriteStream,
    npkill: Npkill,
    logger: LoggerService,
    searchStatus: ScanStatus,
    resultsService: ResultsService,
    spinnerService: SpinnerService,
    consoleService: ConsoleService,
    updateService: UpdateService,
    uiService: UiService,
    scanService: ScanService,
    jsonOutputService: JsonOutputService,
    profilesService: ProfilesService,
    configService: ConfigService,
  );
  init(): void;
  private showDeleteAllWarning;
  private initUi;
  private openOptions;
  private openResultsDetails;
  private loadConfigFile;
  private parseArguments;
  private showErrorPopup;
  private invalidSortParam;
  private showHelp;
  private showProgramVersion;
  private isValidColor;
  private isValidSortParam;
  private isValidSizeUnit;
  private invalidSizeUnitParam;
  private getVersion;
  private prepareScreen;
  private checkRequirements;
  private checkScreenRequirements;
  private checkFileRequirements;
  private checkVersion;
  private showUpdateMessage;
  private isTerminalTooSmall;
  private printFoldersSection;
  private setupEventsListener;
  private keyPress;
  private scan;
  private initializeScan;
  private scanInJson;
  private scanSubscription;
  private scanInUiMode;
  private setupJsonModeSignalHandlers;
  private processNodeFolderForUi;
  private processFolderStatsForUi;
  private finishFolderStats;
  private completeSearch;
  private setSearchDuration;
  private isQuitKey;
  private exitWithError;
  private exitGracefully;
  private quit;
  private resetConsoleState;
  private printExitMessage;
  private deleteFolder;
  private newError;
}
