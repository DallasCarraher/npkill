import {
  UnixFilesService,
  WindowsFilesService,
} from '../core/services/files/index.js';
/**
 * A mapping of operating system names to their corresponding file service classes.
 * This map is used to dynamically instantiate the appropriate file service based on the OS.
 */
export declare const OSServiceMap: {
  linux: typeof UnixFilesService;
  darwin: typeof UnixFilesService;
  win32: typeof WindowsFilesService;
};
