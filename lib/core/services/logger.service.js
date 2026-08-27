import { tmpdir } from 'os';
import { existsSync, renameSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
const LATEST_TAG = 'latest';
const OLD_TAG = 'old';
/**
 * Implementation of the logging service for npkill.
 * Manages application logs with different severity levels and provides
 * reactive streams for log observation and file output capabilities.
 */
export class LoggerService {
  log = [];
  logSubject = new BehaviorSubject([]);
  info(message) {
    this.addToLog({
      type: 'info',
      timestamp: this.getTimestamp(),
      message,
    });
  }
  warn(message) {
    this.addToLog({
      type: 'warn',
      timestamp: this.getTimestamp(),
      message,
    });
  }
  error(message) {
    this.addToLog({
      type: 'error',
      timestamp: this.getTimestamp(),
      message,
    });
  }
  get(type = 'all') {
    if (type === 'all') {
      return this.log;
    }
    return this.log.filter((entry) => entry.type === type);
  }
  getLog$() {
    return this.logSubject.asObservable();
  }
  getLogByType$(type = 'all') {
    return this.logSubject
      .asObservable()
      .pipe(
        map((entries) =>
          type === 'all'
            ? entries
            : entries.filter((entry) => entry.type === type),
        ),
      );
  }
  saveToFile(path) {
    const convertTime = (timestamp) => timestamp;
    const content = this.log.reduce((log, actual) => {
      const line = `[${convertTime(actual.timestamp)}](${actual.type}) ${actual.message}\n`;
      return log + line;
    }, '');
    this.rotateLogFile(path);
    writeFileSync(path, content);
  }
  getSuggestLogFilePath() {
    const filename = `npkill-${LATEST_TAG}.log`;
    return join(tmpdir(), filename);
  }
  rotateLogFile(newLogPath) {
    if (!existsSync(newLogPath)) {
      return; // Rotation is not necessary
    }
    const basePath = dirname(newLogPath);
    const logName = basename(newLogPath);
    const oldLogName = logName.replace(LATEST_TAG, OLD_TAG);
    const oldLogPath = join(basePath, oldLogName);
    renameSync(newLogPath, oldLogPath);
  }
  addToLog(entry) {
    this.log = [...this.log, entry];
    this.logSubject.next(this.log);
  }
  getTimestamp() {
    return new Date().getTime();
  }
}
//# sourceMappingURL=logger.service.js.map
