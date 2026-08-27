import { CliScanFoundFolder, IStats } from '../interfaces/index.js';
export declare class ResultsService {
  results: CliScanFoundFolder[];
  private sizeUnit;
  addResult(result: CliScanFoundFolder): void;
  sortResults(method: string): void;
  reset(): void;
  setSizeUnit(sizeUnit: 'auto' | 'mb' | 'gb'): void;
  getStats(): IStats;
}
