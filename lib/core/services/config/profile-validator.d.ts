import { ValidationResult } from './property-validators.js';
export declare function validateProfile(
  profileName: string,
  profile: unknown,
): ValidationResult;
/**
 * Validates the profiles property (all profiles)
 */
export declare function validateProfiles(value: unknown): ValidationResult;
