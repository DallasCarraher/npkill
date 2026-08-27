import {
  IConfigLoadResult,
  INpkillrcConfig,
} from '../interfaces/npkillrc-config.interface.js';
import { PROFILE } from '../interfaces/profile.interface.js';
/**
 * Service responsible for loading and parsing .npkillrc configuration files.
 */
export declare class ConfigService {
  /**
   * Loads configuration with priority order:
   * 1. Custom path specified via --config parameter
   * 2. Current working directory ./.npkillrc
   * 3. User's home directory ~/.npkillrc
   * @param customPath Optional custom path to a configuration file
   * @returns Configuration load result containing the parsed config or error information
   */
  loadConfig(customPath?: string): IConfigLoadResult;
  /**
   * Resolves the configuration file path based on priority order.
   * Priority: custom path > cwd > home directory
   * @param customPath Optional custom path specified by user
   * @returns Resolved configuration file path
   */
  private resolveConfigPath;
  /**
   * Merges configuration from .npkillrc with a base configuration.
   * Config file values take precedence over base values.
   * @param baseConfig Base configuration object
   * @param fileConfig Configuration loaded from .npkillrc
   * @returns Merged configuration
   */
  mergeConfigs<T extends Record<string, unknown>>(
    baseConfig: T,
    fileConfig: INpkillrcConfig | null,
  ): T;
  /**
   * Gets custom profiles from the configuration file.
   * @param config Configuration loaded from .npkillrc
   * @returns Record of user-defined profiles
   */
  getUserDefinedProfiles(
    config: INpkillrcConfig | null,
  ): Record<string, PROFILE>;
}
