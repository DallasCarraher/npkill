import { ChildProcessWithoutNullStreams } from 'child_process';
import { Observable } from 'rxjs';
/**
 * Service for converting child process streams into RxJS observables.
 * Handles the conversion of stdout/stderr streams to reactive streams
 * for better integration with the application's reactive architecture.
 */
export declare class StreamService {
  streamToObservable<T>(stream: ChildProcessWithoutNullStreams): Observable<T>;
  getStream<T>(child: ChildProcessWithoutNullStreams): Observable<T>;
  private setEncoding;
}
