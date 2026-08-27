export const MAX_WORKERS = 8;
// More PROCS improve the speed of the search in the worker,
// but it will greatly increase the maximum ram usage.
export const MAX_PROCS = 100;
export var EVENTS;
(function (EVENTS) {
  EVENTS['startup'] = 'startup';
  EVENTS['alive'] = 'alive';
  EVENTS['exploreConfig'] = 'exploreConfig';
  EVENTS['explore'] = 'explore';
  EVENTS['scanResult'] = 'scanResult';
  EVENTS['getFolderSize'] = 'getFolderSize';
  EVENTS['GetSizeResult'] = 'GetSizeResult';
  EVENTS['stop'] = 'stop';
  EVENTS['error'] = 'error';
})(EVENTS || (EVENTS = {}));
//# sourceMappingURL=workers.constants.js.map
