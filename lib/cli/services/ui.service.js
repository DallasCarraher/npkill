import ansiEscapes from 'ansi-escapes';
export class UiService {
  stdin = process.stdin;
  // public stdout: NodeJS.WriteStream = process.stdout;
  uiComponents = [];
  setRawMode(set = true) {
    if (this.stdin.isTTY) {
      this.stdin.setRawMode(set);
    }
    process.stdin.resume();
  }
  setCursorVisible(visible) {
    const instruction = visible
      ? ansiEscapes.cursorShow
      : ansiEscapes.cursorHide;
    this.print(instruction);
  }
  add(component) {
    this.uiComponents.push(component);
  }
  remove(baseUiId) {
    this.uiComponents = this.uiComponents.filter((c) => c.id !== baseUiId);
  }
  renderAll() {
    this.clear();
    this.uiComponents.forEach((component) => {
      if (component.visible) {
        component.render();
      }
    });
  }
  setFreezeAll(freeze) {
    this.uiComponents.forEach((component) => {
      component.freezed = freeze;
    });
  }
  setVisibleAll(visible) {
    this.uiComponents.forEach((component) => {
      component.setVisible(visible);
    });
  }
  clear() {
    this.print(ansiEscapes.clearTerminal);
  }
  print(text) {
    process.stdout.write.bind(process.stdout)(text);
  }
  printAt(message, position) {
    this.setCursorAt(position);
    this.print(message);
  }
  setCursorAt({ x, y }) {
    this.print(ansiEscapes.cursorTo(x, y));
  }
  clearLine(row) {
    this.printAt(ansiEscapes.eraseLine, { x: 0, y: row });
  }
}
//# sourceMappingURL=ui.service.js.map
