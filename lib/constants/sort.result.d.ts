import { CliScanFoundFolder } from '../cli/interfaces/index.js';
export declare const FOLDER_SORT: {
  path: (a: CliScanFoundFolder, b: CliScanFoundFolder) => 1 | -1;
  size: (a: CliScanFoundFolder, b: CliScanFoundFolder) => 1 | -1;
  age: (a: CliScanFoundFolder, b: CliScanFoundFolder) => number;
};
