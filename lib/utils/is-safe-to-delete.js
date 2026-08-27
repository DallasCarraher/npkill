import * as path from 'path';
export function isSafeToDelete(filePath, targets) {
  const lastPath = path.basename(filePath);
  if (!lastPath) {
    return false;
  }
  return targets.some((target) => target === lastPath);
}
//# sourceMappingURL=is-safe-to-delete.js.map
