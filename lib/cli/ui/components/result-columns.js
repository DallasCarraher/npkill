const RIGHT_MARGIN = 1;
const SCROLLBAR_MARGIN = 1;
const COLUMN_GAP = 0;
const PATH_TO_COLUMN_GAP = 2;
const ALL_COLUMNS = [
  { id: 'age', width: 4, label: 'Age' },
  { id: 'size', width: 9, label: 'Size' },
];
export function getResultColumns(config) {
  return ALL_COLUMNS.filter((column) => isColumnEnabled(column.id, config));
}
function isColumnEnabled(id, config) {
  switch (id) {
    case 'size':
      return !config.disableSize;
    case 'age':
      return !config.disableAge;
  }
}
function getHeaderCellText(column) {
  if (column.id === 'size') {
    return column.label.padStart(column.width - 1).padEnd(column.width);
  }
  return column.label.padStart(column.width);
}
export function getColumnLayout(columns, terminalColumns) {
  const positions = [];
  let cursorX = terminalColumns - RIGHT_MARGIN;
  for (let i = columns.length - 1; i >= 0; i--) {
    const column = columns[i];
    cursorX -= column.width;
    positions.unshift({ column, x: cursorX });
    cursorX -= COLUMN_GAP;
  }
  const firstColumnX =
    positions.length > 0 ? positions[0].x : terminalColumns - RIGHT_MARGIN;
  const headerText = columns
    .map(getHeaderCellText)
    .join(' '.repeat(COLUMN_GAP));
  const pathReservedWidth =
    columns.length === 0
      ? RIGHT_MARGIN + SCROLLBAR_MARGIN
      : columns.reduce((acc, c) => acc + c.width, 0) +
        Math.max(0, columns.length - 1) * COLUMN_GAP +
        PATH_TO_COLUMN_GAP +
        RIGHT_MARGIN;
  return {
    columns,
    positions,
    firstColumnX,
    headerText,
    pathReservedWidth,
  };
}
//# sourceMappingURL=result-columns.js.map
