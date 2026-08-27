import { FOLDER_SORT } from '../../constants/sort.result.js';
import { formatSize } from '../../utils/unit-conversions.js';
import path from 'path';
export class ResultsService {
  results = [];
  sizeUnit = 'auto';
  addResult(result) {
    this.results = [...this.results, result];
  }
  sortResults(method) {
    this.results = this.results.sort(FOLDER_SORT[method]);
  }
  reset() {
    this.results = [];
  }
  setSizeUnit(sizeUnit) {
    this.sizeUnit = sizeUnit;
  }
  getStats() {
    let spaceReleased = 0;
    const typeCounts = new Map();
    const totalSpace = this.results.reduce((total, folder) => {
      if (folder.status === 'deleted') {
        spaceReleased += folder.size;
      }
      const folderType = path.basename(folder.path);
      typeCounts.set(folderType, (typeCounts.get(folderType) || 0) + 1);
      return total + folder.size;
    }, 0);
    const formattedTotal = formatSize(totalSpace, this.sizeUnit);
    const formattedReleased = formatSize(spaceReleased, this.sizeUnit);
    const resultsTypesCount = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.type.localeCompare(b.type);
      });
    return {
      spaceReleased: formattedReleased,
      totalSpace: formattedTotal,
      resultsTypesCount,
    };
  }
}
//# sourceMappingURL=results.service.js.map
