import { DEFAULT_PROFILES } from '../constants/profiles.constants.js';
/**
 * Service responsible for managing profiles.
 * Handles profile registration, retrieval, and target resolution.
 */
export class ProfilesService {
  userDefinedProfiles = {};
  /**
   * Sets user-defined profiles loaded from .npkillrc configuration.
   * @param profiles Record of user-defined profile configurations
   */
  setUserDefinedProfiles(profiles) {
    this.userDefinedProfiles = profiles;
  }
  /**
   * Gets profiles based on the specified filter type.
   * @param filterType Type of profiles to retrieve:
   *   - 'base': Only built-in profiles
   *   - 'user': Only user-defined profiles from .npkillrc
   *   - 'all': Both base and user-defined (user profiles override base)
   * @returns Record of profiles matching the filter
   */
  getProfiles(filterType = 'all') {
    switch (filterType) {
      case 'base':
        return DEFAULT_PROFILES;
      case 'user':
        return this.userDefinedProfiles;
      case 'all':
        return { ...DEFAULT_PROFILES, ...this.userDefinedProfiles };
      default:
        return DEFAULT_PROFILES;
    }
  }
  /**
   * Gets a specific profile by name.
   * Searches user-defined profiles first, then base profiles.
   * @param name Name of the profile to retrieve
   * @returns The profile if found, undefined otherwise
   */
  getProfileByName(name) {
    return this.userDefinedProfiles[name] || DEFAULT_PROFILES[name];
  }
  /**
   * Checks if a profile with the given name exists.
   * @param name Name of the profile to check
   * @returns true if the profile exists, false otherwise
   */
  hasProfile(name) {
    return this.getProfileByName(name) !== undefined;
  }
  /**
   * Gets the targets from multiple profiles by their names.
   * Combines targets from all specified profiles, removing duplicates.
   * @param profileNames Array of profile names to get targets from
   * @returns Array of unique target directory names
   */
  getTargetsFromProfiles(profileNames) {
    const targets = new Set();
    for (const name of profileNames) {
      const profile = this.getProfileByName(name);
      if (profile) {
        for (const target of profile.targets) {
          targets.add(target);
        }
      }
    }
    return Array.from(targets);
  }
  /**
   * Validates an array of profile names.
   * @param profileNames Array of profile names to validate
   * @returns Array of invalid profile names (profiles that don't exist)
   */
  getInvalidProfileNames(profileNames) {
    return profileNames.filter((name) => !this.hasProfile(name));
  }
  /**
   * Gets the default profile name.
   * @returns Name of the default profile
   */
  getDefaultProfileName() {
    return 'node';
  }
}
//# sourceMappingURL=profiles.service.js.map
