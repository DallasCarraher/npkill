import { INpkillrcConfig } from '../../interfaces/npkillrc-config.interface.js';
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
/**
 * Validates the rootDir property
 */
export declare function validateRootDir(value: unknown): ValidationResult;
/**
 * Validates the exclude property
 */
export declare function validateExclude(value: unknown): ValidationResult;
/**
 * Validates the sortBy property
 */
export declare function validateSortBy(value: unknown): ValidationResult;
/**
 * Validates the sizeUnit property
 */
export declare function validateSizeUnit(value: unknown): ValidationResult;
/**
 * Validates a boolean property
 */
export declare function validateBoolean(
  value: unknown,
  propertyName: string,
): ValidationResult;
/**
 * Validates the defaultProfiles property
 */
export declare function validateDefaultProfiles(
  value: unknown,
): ValidationResult;
/**
 * Validates unknown properties
 */
export declare function validateUnknownProperties(
  config: INpkillrcConfig,
  validProperties: readonly string[],
): ValidationResult;
