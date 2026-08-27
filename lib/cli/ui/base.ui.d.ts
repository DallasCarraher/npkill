import { IKeyPress } from '../interfaces/index.js';
export interface Position {
  x: number;
  y: number;
}
export interface InteractiveUi {
  onKeyInput: (key: IKeyPress) => void;
}
export declare abstract class BaseUi {
  readonly id: string;
  freezed: boolean;
  protected _position: Position;
  protected _visible: boolean;
  private readonly stdout;
  protected printAt(message: string, position: Position): void;
  protected setCursorAt({ x, y }: Position): void;
  protected print(text: string): void;
  protected clearLine(row: number): void;
  setPosition(position: Position, renderOnSet?: boolean): void;
  setVisible(visible: boolean, renderOnSet?: boolean): void;
  get position(): Position;
  get visible(): boolean;
  get terminal(): {
    columns: number;
    rows: number;
  };
  abstract render(): void;
}
