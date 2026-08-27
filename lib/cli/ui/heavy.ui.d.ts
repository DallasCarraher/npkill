import { BaseUi } from './base.ui.js';
/**
 * A UI that buffers the output and prints it all at once when calling the
 * flush() function.
 */
export declare abstract class HeavyUi extends BaseUi {
  private buffer;
  private previousBuffer;
  resetBufferState(): void;
  /**
   * Stores the text in a buffer. No will print it to stdout until flush()
   * is called.
   */
  protected print(text: string): void;
  /** Prints the buffer (if have any change) to stdout and clears it. */
  protected flush(): void;
  private clearBuffer;
}
