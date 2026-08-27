import { Observable } from 'rxjs';
import { STREAM_ENCODING } from '../../constants/index.js';
/**
 * Service for converting child process streams into RxJS observables.
 * Handles the conversion of stdout/stderr streams to reactive streams
 * for better integration with the application's reactive architecture.
 */
export class StreamService {
  streamToObservable(stream) {
    const { stdout, stderr } = stream;
    return new Observable((observer) => {
      const dataHandler = (data) => observer.next(data);
      const bashErrorHandler = (error) =>
        observer.error({ ...error, bash: true });
      const errorHandler = (error) => observer.error(error);
      const endHandler = () => observer.complete();
      stdout.addListener('data', dataHandler);
      stdout.addListener('error', errorHandler);
      stdout.addListener('end', endHandler);
      stderr.addListener('data', bashErrorHandler);
      stderr.addListener('error', errorHandler);
      return () => {
        stdout.removeListener('data', dataHandler);
        stdout.removeListener('error', errorHandler);
        stdout.removeListener('end', endHandler);
        stderr.removeListener('data', bashErrorHandler);
        stderr.removeListener('error', errorHandler);
      };
    });
  }
  getStream(child) {
    this.setEncoding(child, STREAM_ENCODING);
    return this.streamToObservable(child);
  }
  setEncoding(child, encoding) {
    child.stdout.setEncoding(encoding);
    child.stderr.setEncoding(encoding);
  }
}
//# sourceMappingURL=stream.service.js.map
