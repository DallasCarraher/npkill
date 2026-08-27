import { INpkillrcConfig } from '../../interfaces/npkillrc-config.interface.js';
/**
 * Merges exclude arrays from base and file config, avoiding duplicates
 */
export declare function mergeExcludeArrays(
  baseExclude: unknown,
  fileExclude: string[],
): string[];
/**
 * Merges a simple property (direct override)
 */
export declare function mergeProperty<T>(
  merged: Record<string, unknown>,
  key: string,
  value: T,
): void;
/**
 * Type guard to check if a property exists and is not undefined
 */
export declare function isDefined<T>(value: T | undefined): value is T;
/**
 * Applies all file config properties to the merged config
 */
export declare function applyFileConfigProperties(
  merged: Record<string, unknown>,
  baseConfig: Record<string, unknown>,
  fileConfig: INpkillrcConfig,
): void;
