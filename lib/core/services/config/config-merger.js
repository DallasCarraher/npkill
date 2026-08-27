/**
 * Merges exclude arrays from base and file config, avoiding duplicates
 */
export function mergeExcludeArrays(baseExclude, fileExclude) {
  const base = Array.isArray(baseExclude) ? baseExclude : [];
  return [...new Set([...base, ...fileExclude])];
}
/**
 * Merges a simple property (direct override)
 */
export function mergeProperty(merged, key, value) {
  merged[key] = value;
}
/**
 * Type guard to check if a property exists and is not undefined
 */
export function isDefined(value) {
  return value !== undefined;
}
/**
 * Applies all file config properties to the merged config
 */
export function applyFileConfigProperties(merged, baseConfig, fileConfig) {
  // rootDir
  if (isDefined(fileConfig.rootDir)) {
    mergeProperty(merged, 'rootDir', fileConfig.rootDir);
  }
  // exclude (special merge logic)
  if (isDefined(fileConfig.exclude)) {
    merged.exclude = mergeExcludeArrays(baseConfig.exclude, fileConfig.exclude);
  }
  // sortBy
  if (isDefined(fileConfig.sortBy)) {
    mergeProperty(merged, 'sortBy', fileConfig.sortBy);
  }
  // sizeUnit
  if (isDefined(fileConfig.sizeUnit)) {
    mergeProperty(merged, 'sizeUnit', fileConfig.sizeUnit);
  }
  // excludeSensitiveResults
  if (isDefined(fileConfig.excludeSensitiveResults)) {
    mergeProperty(
      merged,
      'excludeSensitiveResults',
      fileConfig.excludeSensitiveResults,
    );
  }
  // dryRun
  if (isDefined(fileConfig.dryRun)) {
    mergeProperty(merged, 'dryRun', fileConfig.dryRun);
  }
  // checkUpdates
  if (isDefined(fileConfig.checkUpdates)) {
    mergeProperty(merged, 'checkUpdates', fileConfig.checkUpdates);
  }
  // defaultProfiles
  if (isDefined(fileConfig.defaultProfiles)) {
    mergeProperty(merged, 'defaultProfiles', fileConfig.defaultProfiles);
  }
}
//# sourceMappingURL=config-merger.js.map
