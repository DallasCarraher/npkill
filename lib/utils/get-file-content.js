import { readFileSync } from 'fs';
export function getFileContent(path) {
  const encoding = 'utf8';
  return readFileSync(path, encoding);
}
//# sourceMappingURL=get-file-content.js.map
