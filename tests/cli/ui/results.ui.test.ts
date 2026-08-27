import { ConsoleService } from '../../../src/cli/services/index.js';
import { ResultsService } from '../../../src/cli/services/results.service.js';
import { jest } from '@jest/globals';
import { CliScanFoundFolder } from '../../../src/cli/interfaces/stats.interface.js';

const stdoutWriteMock = jest.fn() as unknown;

const originalProcess = process;
const mockProcess = () => {
  global.process = {
    ...originalProcess,
    stdout: {
      write: stdoutWriteMock,
      rows: 30,
      columns: 80,
    } as NodeJS.WriteStream & {
      fd: 1;
    },
  };
};

const ResultsUiConstructor = (
  await import('../../../src/cli/ui/components/results.ui.js')
).ResultsUi;
class ResultsUi extends ResultsUiConstructor {}

describe('ResultsUi', () => {
  let resultsUi: ResultsUi;
  const ANSI_REGEX = /\u001b\[[0-9;]*m/g;

  const resultsServiceMock: ResultsService = {
    results: [],
  } as unknown as ResultsService;

  const consoleServiceMock: ConsoleService = {
    shortenText: (text) => text,
  } as unknown as ConsoleService;

  beforeEach(() => {
    mockProcess();
    resultsServiceMock.results = [];
    resultsUi = new ResultsUi(resultsServiceMock, consoleServiceMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('render', () => {
    it('should render results', () => {
      resultsServiceMock.results = [
        {
          path: 'path/folder/1',
          size: 1,
          status: 'live',
        },
        {
          path: 'path/folder/2',
          size: 1,
          status: 'live',
        },
      ] as CliScanFoundFolder[];

      resultsUi.render();

      // With stringContaining we can ignore the terminal color codes.
      expect(stdoutWriteMock).toHaveBeenCalledWith(
        expect.stringContaining('path/folder/1'),
      );
      expect(stdoutWriteMock).toHaveBeenCalledWith(
        expect.stringContaining('path/folder/2'),
      );
    });

    it('should render age in days with the day suffix', () => {
      const now = Math.floor(Date.now() / 1000);

      const cellText = resultsUi['getAgeCellText'](
        {
          path: 'path/folder/1',
          size: 1,
          status: 'live',
          modificationTime: now - 12 * 86400,
        } as CliScanFoundFolder,
        false,
      );

      expect(cellText.replace(ANSI_REGEX, '')).toBe(' 12d');
    });

    it('should reduce the visible gap before the size value', () => {
      const cellText = resultsUi['getSizeCellText']({
        path: 'path/folder/1',
        size: 4.48,
        status: 'live',
        modificationTime: 1,
      } as CliScanFoundFolder);

      expect(cellText).toBe(' 4.48 GB ');
    });

    // eslint-disable-next-line quotes
    it("should't render results if it is not visible", () => {
      const populateResults = () => {
        for (let i = 0; i < 100; i++) {
          resultsServiceMock.results.push({
            path: `path/folder/${i}`,
            size: 1,
            status: 'live',
            isDangerous: false,
            modificationTime: -1,
          } as CliScanFoundFolder);
        }
      };

      populateResults();
      resultsUi.render();

      // With stringContaining we can ignore the terminal color codes.
      expect(stdoutWriteMock).toHaveBeenCalledWith(
        expect.stringContaining('path/folder/1'),
      );
      expect(stdoutWriteMock).not.toHaveBeenCalledWith(
        expect.stringContaining('path/folder/64'),
      );
    });
  });

  describe('selection mode', () => {
    let folders: CliScanFoundFolder[];

    beforeEach(() => {
      folders = [
        { path: 'folder/1', size: 1, status: 'live' } as CliScanFoundFolder,
        { path: 'folder/2', size: 1, status: 'live' } as CliScanFoundFolder,
        { path: 'folder/3', size: 1, status: 'live' } as CliScanFoundFolder,
      ];

      resultsServiceMock.results = folders;
      resultsUi = new ResultsUi(resultsServiceMock, consoleServiceMock);
    });

    it('should toggle select mode on and off with "t"', () => {
      expect(resultsUi['selectMode']).toBe(false);

      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      });
      expect(resultsUi['selectMode']).toBe(true);

      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      });
      expect(resultsUi['selectMode']).toBe(false);
      expect(resultsUi['selectedFolders'].size).toBe(0);
    });

    it('should select and unselect folder with space', () => {
      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      }); // enable select mode

      resultsUi.onKeyInput({
        name: 'space',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: ' ',
      });
      expect(resultsUi['selectedFolders'].has('folder/1')).toBe(true);

      resultsUi.onKeyInput({
        name: 'space',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: ' ',
      });
      expect(resultsUi['selectedFolders'].has('folder/1')).toBe(false);
    });

    it('should start and end range selection with "v"', () => {
      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      }); // select mode on

      resultsUi.onKeyInput({
        name: 'v',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 'v',
      }); // start range
      expect(resultsUi['isRangeSelectionMode']).toBe(true);
      expect(resultsUi['rangeSelectionStart']).toBe(0);

      resultsUi.onKeyInput({
        name: 'down',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: '\u001b[B',
      }); // move to folder/2
      expect(resultsUi['selectedFolders'].has('folder/1')).toBe(true);
      expect(resultsUi['selectedFolders'].has('folder/2')).toBe(true);

      resultsUi.onKeyInput({
        name: 'v',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 'v',
      }); // end range
      expect(resultsUi['isRangeSelectionMode']).toBe(false);
      expect(resultsUi['rangeSelectionStart']).toBe(null);
    });

    it('should delete all selected folders on enter', () => {
      const spy = jest.spyOn(resultsUi['delete$'], 'next');

      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      }); // selection mode
      resultsUi.onKeyInput({
        name: 'space',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: ' ',
      }); // select folder/1
      resultsUi.onKeyInput({
        name: 'down',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: '\u001b[B',
      });
      resultsUi.onKeyInput({
        name: 'space',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: ' ',
      }); // select folder/2

      resultsUi.onKeyInput({
        name: 'enter',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: '\r',
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(folders[0]);
      expect(spy).toHaveBeenCalledWith(folders[1]);

      expect(resultsUi['selectedFolders'].size).toBe(0);
    });

    it('should clear range selection when toggling mode off', () => {
      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      }); // selection mode on
      resultsUi.onKeyInput({
        name: 'v',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 'v',
      }); // start range
      resultsUi.onKeyInput({
        name: 'down',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: '\u001b[B',
      }); // move and apply range

      expect(resultsUi['selectedFolders'].size).toBe(2);
      expect(resultsUi['isRangeSelectionMode']).toBe(true);

      resultsUi.onKeyInput({
        name: 't',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 't',
      }); // toggle mode off
      expect(resultsUi['selectMode']).toBe(false);
      expect(resultsUi['selectedFolders'].size).toBe(0);
      expect(resultsUi['rangeSelectionStart']).toBe(null);
    });
  });

  describe('vim-style navigation', () => {
    beforeEach(() => {
      resultsServiceMock.results = [
        { path: 'folder/1', size: 1, status: 'live' },
        { path: 'folder/2', size: 1, status: 'live' },
        { path: 'folder/3', size: 1, status: 'live' },
      ] as CliScanFoundFolder[];
      resultsUi = new ResultsUi(resultsServiceMock, consoleServiceMock);
    });

    const pressG = (shift = false) =>
      resultsUi.onKeyInput({
        name: 'g',
        meta: false,
        ctrl: false,
        shift,
        sequence: shift ? 'G' : 'g',
      });

    it('should jump to the last result with "G" (shift+g)', () => {
      expect(resultsUi['resultIndex']).toBe(0);
      pressG(true);
      expect(resultsUi['resultIndex']).toBe(2);
    });

    it('should jump to the first result with double "g" press ("gg")', () => {
      pressG(true); // move to last result first
      expect(resultsUi['resultIndex']).toBe(2);

      pressG();
      pressG();
      expect(resultsUi['resultIndex']).toBe(0);
    });

    it('should not jump to the first result on a single "g" press', () => {
      pressG(true); // move to last result first

      pressG();
      expect(resultsUi['resultIndex']).toBe(2);
    });

    it('should reset the double-press window after a single stale "g"', () => {
      pressG(true); // move to last result

      resultsUi['lastGPressTime'] = Date.now() - 1000; // simulate an old press
      pressG();
      pressG();
      expect(resultsUi['resultIndex']).toBe(0);
    });
  });

  describe('sort cycling', () => {
    beforeEach(() => {
      resultsServiceMock.results = [
        { path: 'folder/b', size: 5, status: 'live' },
        { path: 'folder/a', size: 20, status: 'live' },
        { path: 'folder/c', size: 1, status: 'live' },
      ] as CliScanFoundFolder[];

      (
        resultsServiceMock as unknown as { sortResults: jest.Mock }
      ).sortResults = jest.fn((method: string) => {
        const sorters: Record<
          string,
          (a: CliScanFoundFolder, b: CliScanFoundFolder) => number
        > = {
          size: (a, b) => b.size - a.size,
          path: (a, b) => (a.path > b.path ? 1 : -1),
        };
        resultsServiceMock.results = [...resultsServiceMock.results].sort(
          sorters[method],
        );
      }) as unknown as jest.Mock;

      resultsUi = new ResultsUi(resultsServiceMock, consoleServiceMock);
    });

    const pressS = () =>
      resultsUi.onKeyInput({
        name: 's',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: 's',
      });

    it('should cycle sort mode from size to name (path) on "s"', () => {
      expect(resultsUi.getSortLabel()).toBe('Size');

      pressS();

      expect(resultsUi.getSortLabel()).toBe('Name');
      expect(resultsServiceMock.results[0].path).toBe('folder/a');
    });

    it('should cycle back to size after name and age', () => {
      pressS(); // name
      pressS(); // age
      pressS(); // back to size

      expect(resultsUi.getSortLabel()).toBe('Size');
    });

    it('should keep the cursor on the same folder after re-sorting', () => {
      resultsUi.onKeyInput({
        name: 'down',
        meta: false,
        ctrl: false,
        shift: false,
        sequence: '\u001b[B',
      }); // move to folder/a (index 1)

      pressS(); // sort by name: folder/a, folder/b, folder/c

      expect(resultsUi['results'][resultsUi['resultIndex']].path).toBe(
        'folder/a',
      );
    });
  });
});
