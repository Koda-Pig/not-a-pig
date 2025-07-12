export default class InputHandler {
  pressedKeys: Set<string> = new Set();

  constructor() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.pressedKeys.add("left");
          break;
        case "ArrowRight":
          this.pressedKeys.add("right");
          break;
        case "ArrowUp":
          this.pressedKeys.add("up");
          break;
        case "ArrowDown":
          this.pressedKeys.add("down");
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.pressedKeys.delete("left");
          break;
        case "ArrowRight":
          this.pressedKeys.delete("right");
          break;
        case "ArrowUp":
          this.pressedKeys.delete("up");
          break;
        case "ArrowDown":
          this.pressedKeys.delete("down");
          break;
        default:
          this.pressedKeys.clear();
          break;
      }
    });
  }
}
