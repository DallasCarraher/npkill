import { CliScanFoundFolder } from '../interfaces/stats.interface.js';
export declare class JsonOutputService {
  private readonly stdout;
  private readonly stderr;
  private readonly OUTPUT_VERSION;
  private results;
  private scanStartTime;
  private isStreamMode;
  constructor(stdout?: NodeJS.WriteStream, stderr?: NodeJS.WriteStream);
  initializeSession(streamMode?: boolean): void;
  processResult(folder: CliScanFoundFolder): void;
  completeScan(): void;
  private writeStreamResult;
  private addResult;
  private writeSimpleResults;
  writeError(error: Error | string): void;
  getResultsCount(): number;
  handleShutdown(): void;
  private sanitizeFolderForOutput;
}
