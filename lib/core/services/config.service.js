import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { validateConfig, applyFileConfigProperties } from './config/index.js';
const DEFAULT_CONFIG_FILENAME = '.npkillrc';
/**
 * Service responsible for loading and parsing .npkillrc configuration files.
 */
export class ConfigService {
  /**
   * Loads configuration with priority order:
   * 1. Custom path specified via --config parameter
   * 2. Current working directory ./.npkillrc
   * 3. User's home directory ~/.npkillrc
   * @param customPath Optional custom path to a configuration file
   * @returns Configuration load result containing the parsed config or error information
   */
  loadConfig(customPath) {
    const configPath = this.resolveConfigPath(customPath);
    if (!existsSync(configPath)) {
      return {
        config: null,
        configPath,
        error: customPath
          ? `Custom config file not found: ${configPath}`
          : undefined,
      };
    }
    try {
      const fileContent = readFileSync(configPath, 'utf-8');
      const parsedConfig = JSON.parse(fileContent);
      const validationResult = validateConfig(parsedConfig);
      if (!validationResult.isValid) {
        return {
          configPath,
          config: null,
          error: validationResult.error,
        };
      }
      return {
        config: parsedConfig,
        configPath,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        config: null,
        configPath,
        error: `Failed to parse config file: ${errorMessage}.`,
      };
    }
  }
  /**
   * Resolves the configuration file path based on priority order.
   * Priority: custom path > cwd > home directory
   * @param customPath Optional custom path specified by user
   * @returns Resolved configuration file path
   */
  resolveConfigPath(customPath) {
    // Priority 1: Custom path from --config flag
    if (customPath) {
      return customPath;
    }
    // Priority 2: Current working directory
    const cwdPath = join(process.cwd(), DEFAULT_CONFIG_FILENAME);
    if (existsSync(cwdPath)) {
      return cwdPath;
    }
    // Priority 3: User's home directory
    return join(homedir(), DEFAULT_CONFIG_FILENAME);
  }
  /**
   * Merges configuration from .npkillrc with a base configuration.
   * Config file values take precedence over base values.
   * @param baseConfig Base configuration object
   * @param fileConfig Configuration loaded from .npkillrc
   * @returns Merged configuration
   */
  mergeConfigs(baseConfig, fileConfig) {
    if (!fileConfig) {
      return baseConfig;
    }
    const merged = { ...baseConfig };
    applyFileConfigProperties(merged, baseConfig, fileConfig);
    return merged;
  }
  /**
   * Gets custom profiles from the configuration file.
   * @param config Configuration loaded from .npkillrc
   * @returns Record of user-defined profiles
   */
  getUserDefinedProfiles(config) {
    if (!config || !config.profiles) {
      return {};
    }
    return config.profiles;
  }
}
//# sourceMappingURL=config.service.js.map
