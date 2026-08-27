import { Position, BaseUi } from '../ui/index.js';
export declare class UiService {
  stdin: NodeJS.ReadStream;
  uiComponents: BaseUi[];
  setRawMode(set?: boolean): void;
  setCursorVisible(visible: boolean): void;
  add(component: BaseUi): void;
  remove(baseUiId: string): void;
  renderAll(): void;
  setFreezeAll(freeze: boolean): void;
  setVisibleAll(visible: boolean): void;
  clear(): void;
  print(text: string): void;
  printAt(message: string, position: Position): void;
  setCursorAt({ x, y }: Position): void;
  clearLine(row: number): void;
}
