export declare const MAX_WORKERS = 8;
export declare const MAX_PROCS = 100;
export declare enum EVENTS {
  startup = 'startup',
  alive = 'alive',
  exploreConfig = 'exploreConfig',
  explore = 'explore',
  scanResult = 'scanResult',
  getFolderSize = 'getFolderSize',
  GetSizeResult = 'GetSizeResult',
  stop = 'stop',
  error = 'error',
}
