import { IConfig } from '../../interfaces/config.interface.js';
export type ResultColumnId = 'age' | 'size';
export interface ResultColumn {
  id: ResultColumnId;
  width: number;
  label: string;
}
export interface ResultColumnPosition {
  column: ResultColumn;
  x: number;
}
export interface ResultColumnLayout {
  columns: ResultColumn[];
  positions: ResultColumnPosition[];
  firstColumnX: number;
  headerText: string;
  pathReservedWidth: number;
}
export declare function getResultColumns(config: IConfig): ResultColumn[];
export declare function getColumnLayout(
  columns: ResultColumn[],
  terminalColumns: number,
): ResultColumnLayout;
