export declare function convertBytesToKB(bytes: number): number;
export declare function convertBytesToGb(bytes: number): number;
export declare function convertGBToMB(gb: number): number;
export declare function convertGbToKb(gb: number): number;
export declare function convertGbToBytes(gb: number): number;
export interface FormattedSize {
  value: number;
  unit: 'MB' | 'GB';
  text: string;
  bytes: number;
}
export declare function formatSize(
  sizeInGB: number,
  sizeUnit: 'auto' | 'mb' | 'gb',
  decimals?: number,
): FormattedSize;
