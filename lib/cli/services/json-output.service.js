import { convertGbToBytes } from '../../utils/unit-conversions.js';
export class JsonOutputService {
  stdout;
  stderr;
  OUTPUT_VERSION = 1;
  results = [];
  scanStartTime = 0;
  isStreamMode = false;
  constructor(stdout = process.stdout, stderr = process.stderr) {
    this.stdout = stdout;
    this.stderr = stderr;
  }
  initializeSession(streamMode = false) {
    this.results = [];
    this.scanStartTime = Date.now();
    this.isStreamMode = streamMode;
  }
  processResult(folder) {
    if (this.isStreamMode) {
      this.writeStreamResult(folder);
    } else {
      this.addResult(folder);
    }
  }
  completeScan() {
    if (!this.isStreamMode && this.results.length > 0) {
      this.writeSimpleResults();
    }
  }
  writeStreamResult(folder) {
    const output = {
      version: this.OUTPUT_VERSION,
      result: this.sanitizeFolderForOutput(folder),
    };
    try {
      this.stdout.write(JSON.stringify(output) + '\n');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown JSON serialization error';
      this.writeError(`Failed to serialize result to JSON: ${errorMessage}`);
    }
  }
  addResult(folder) {
    this.results.push(this.sanitizeFolderForOutput(folder));
  }
  writeSimpleResults() {
    const runDuration = Date.now() - this.scanStartTime;
    const output = {
      version: this.OUTPUT_VERSION,
      results: this.results,
      meta: {
        resultsCount: this.results.length,
        runDuration,
      },
    };
    try {
      this.stdout.write(JSON.stringify(output, null, 2) + '\n');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown JSON serialization error';
      this.writeError(`Failed to serialize results to JSON: ${errorMessage}`);
    }
  }
  writeError(error) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorOutput = {
      version: this.OUTPUT_VERSION,
      error: true,
      message: errorMessage,
      timestamp: new Date().getDate(),
    };
    this.stderr.write(JSON.stringify(errorOutput) + '\n');
  }
  getResultsCount() {
    return this.results.length;
  }
  handleShutdown() {
    if (!this.isStreamMode && this.results.length > 0) {
      this.writeSimpleResults();
    }
  }
  sanitizeFolderForOutput(folder) {
    return {
      path: folder.path,
      size: convertGbToBytes(folder.size),
      modificationTime: folder.modificationTime,
      riskAnalysis: folder.riskAnalysis
        ? {
            isSensitive: folder.riskAnalysis.isSensitive,
            reason: folder.riskAnalysis.reason,
          }
        : undefined,
    };
  }
}
//# sourceMappingURL=json-output.service.js.map
