export declare class SpinnerService {
  private spinner;
  private count;
  setSpinner(spinner: string[]): void;
  nextFrame(): string;
  reset(): void;
  private updateCount;
  private isLastFrame;
}
