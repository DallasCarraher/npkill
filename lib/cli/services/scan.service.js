import {
  filter,
  firstValueFrom,
  map,
  switchMap,
  tap,
  catchError,
  of,
  timeout,
} from 'rxjs';
import { convertBytesToGb } from '../../utils/unit-conversions.js';
import { join } from 'path';
import os from 'os';
export class ScanService {
  npkill;
  constructor(npkill) {
    this.npkill = npkill;
  }
  scan(config) {
    const { targets, exclude, sortBy } = config;
    const params = {
      targets,
      exclude,
      performRiskAnalysis: true,
      sortBy: sortBy,
    };
    const results$ = this.npkill.startScan$(config.folderRoot, params);
    const nonExcludedResults$ = results$.pipe(
      filter(
        (path) =>
          !this.isExcludedDangerousDirectory(
            path,
            config.excludeSensitiveResults,
          ),
      ),
    );
    return nonExcludedResults$.pipe(
      map(({ path, riskAnalysis }) => ({
        path,
        size: 0,
        modificationTime: -1,
        riskAnalysis,
        status: 'live',
      })),
    );
  }
  calculateFolderStats(
    nodeFolder,
    options = {
      /** Saves resources by not scanning a result that is probably not of interest. */
      getModificationTimeForSensitiveResults: false,
    },
  ) {
    const size$ = options.disableSize
      ? of({ size: 0, unit: 'bytes' })
      : this.npkill.getSize$(nodeFolder.path).pipe(
          timeout(30000), // 30 seconds timeout
          catchError(() => {
            // If size calculation fails or times out, keep size as 0 but mark as calculated
            nodeFolder.size = 0;
            nodeFolder.modificationTime = 1; // 1 = calculated, -1 = not calculated
            return of({ size: 0, unit: 'bytes' });
          }),
          tap(({ size }) => {
            nodeFolder.size = convertBytesToGb(size);
          }),
        );
    return size$.pipe(
      switchMap(async () => {
        if (options.disableAge) {
          nodeFolder.modificationTime = -1;
          return nodeFolder;
        }
        if (
          nodeFolder.riskAnalysis?.isSensitive &&
          !options.getModificationTimeForSensitiveResults
        ) {
          nodeFolder.modificationTime = -1;
          return nodeFolder;
        }
        const parentFolder = join(nodeFolder.path, '../');
        const normalizedParent = parentFolder.replace(/\\/g, '/').toLowerCase();
        const normalizedHome = os.homedir().replace(/\\/g, '/').toLowerCase();
        const isDirectChildOfHome =
          normalizedHome && normalizedParent === normalizedHome;
        // If it's directly under HOME, skip modification time calculation
        if (isDirectChildOfHome) {
          nodeFolder.modificationTime = -1;
          return nodeFolder;
        }
        // For other folders, scan the parent folder for modification time
        try {
          const result = await firstValueFrom(
            this.npkill.getNewestFile$(parentFolder).pipe(
              timeout(10000), // 10 seconds timeout for modification time
              catchError(() => of(null)),
            ),
          );
          nodeFolder.modificationTime = result ? result.timestamp : 1;
          return nodeFolder;
        } catch {
          nodeFolder.modificationTime = 1;
          return nodeFolder;
        }
      }),
      catchError(() => {
        // Final fallback: mark as calculated with default values
        nodeFolder.modificationTime = 1;
        if (nodeFolder.size === undefined || nodeFolder.size === null) {
          nodeFolder.size = 0;
        }
        return of(nodeFolder);
      }),
    );
  }
  isExcludedDangerousDirectory(scanResult, excludeSensitiveResults) {
    return Boolean(
      excludeSensitiveResults && scanResult.riskAnalysis?.isSensitive,
    );
  }
}
//# sourceMappingURL=scan.service.js.map
