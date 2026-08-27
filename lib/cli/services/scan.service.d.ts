import { Npkill } from '@core/npkill';
import { CliScanFoundFolder, IConfig } from '../interfaces';
import { Observable } from 'rxjs';
export interface CalculateFolderStatsOptions {
  getModificationTimeForSensitiveResults?: boolean;
  disableSize?: boolean;
  disableAge?: boolean;
}
export declare class ScanService {
  private readonly npkill;
  constructor(npkill: Npkill);
  scan(config: IConfig): Observable<CliScanFoundFolder>;
  calculateFolderStats(
    nodeFolder: CliScanFoundFolder,
    options?: CalculateFolderStatsOptions,
  ): Observable<CliScanFoundFolder>;
  private isExcludedDangerousDirectory;
}
