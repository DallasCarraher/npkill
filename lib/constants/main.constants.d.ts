import { IConfig } from '../cli/interfaces/index.js';
export declare const MIN_CLI_COLUMNS_SIZE = 60;
export declare const CURSOR_SIMBOL = '~>';
export declare const WIDTH_OVERFLOW = '...';
export declare const DEFAULT_SIZE = '0 MB';
export declare const DECIMALS_SIZE = 2;
export declare const OVERFLOW_CUT_FROM = 11;
export declare const DEFAULT_CONFIG: IConfig;
export declare const MARGINS: {
  FOLDER_COLUMN_START: number;
  ROW_RESULTS_START: number;
};
export declare const UI_HELP: {
  X_COMMAND_OFFSET: number;
  X_DESCRIPTION_OFFSET: number;
  Y_OFFSET: number;
  MAX_WIDTH: number;
};
export declare const UI_POSITIONS: {
  FOLDER_SIZE_HEADER: {
    x: number;
    y: number;
  };
  INITIAL: {
    x: number;
    y: number;
  };
  VERSION: {
    x: number;
    y: number;
  };
  DRY_RUN_NOTICE: {
    x: number;
    y: number;
  };
  NEW_UPDATE_FOUND: {
    x: number;
    y: number;
  };
  SPACE_RELEASED: {
    x: number;
    y: number;
  };
  STATUS: {
    x: number;
    y: number;
  };
  STATUS_BAR: {
    x: number;
    y: number;
  };
  PENDING_TASKS: {
    x: number;
    y: number;
  };
  TOTAL_SPACE: {
    x: number;
    y: number;
  };
  ERRORS_COUNT: {
    x: number;
    y: number;
  };
  TUTORIAL_TIP: {
    x: number;
    y: number;
  };
  WARNINGS: {
    x: number;
    y: number;
  };
  RESULTS_TYPES_COUNT_ROW_1: {
    x: number;
    y: number;
  };
  RESULTS_TYPES_COUNT_ROW_2: {
    x: number;
    y: number;
  };
  RESULTS_TYPES_COUNT_ROW_3: {
    x: number;
    y: number;
  };
  RESULTS_TYPES_COUNT_ROW_4: {
    x: number;
    y: number;
  };
  RESULTS_TYPES_COUNT_ROW_5: {
    x: number;
    y: number;
  };
};
export declare const BANNER =
  '                  __   .__.__  .__\n     ____ ______ |  | _|__|  | |  |\n    /    \\\\____ \\|  |/ /  |  | |  |\n   |   |  \\  |_> >    <|  |  |_|  |__\n   |___|  /   __/|__|_ \\__|____/____/\n        \\/|__|        \\/';
export declare const STREAM_ENCODING = 'utf8';
