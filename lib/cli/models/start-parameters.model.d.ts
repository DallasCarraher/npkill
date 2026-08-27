export declare class StartParameters {
  private values;
  add(key: string, value: string | boolean): void;
  isTrue(key: string): boolean;
  getString(key: string): string;
  getStrings(key: string): string[];
}
