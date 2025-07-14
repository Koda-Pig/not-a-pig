export default class InputHandler {
  pressedKeys: Set<string> = new Set();
  activeControllerButtons: string[] = [];
  previousButtonStates: boolean[] = [];
  gamepadKeyMap: { [key: number]: string } = {
    12: "up", // D-pad up
    13: "down", // D-pad down
    14: "left", // D-pad left
    15: "right", // D-pad right
    0: "up" // A button (jump) - Xbox/Switch/PlayStation Cross
  };

  constructor() {
    window.addEventListener("keydown", (e) => {
      console.log(e.key === " ");
      switch (e.key) {
        case "ArrowLeft":
          this.pressedKeys.add("left");
          break;
        case "ArrowRight":
          this.pressedKeys.add("right");
          break;
        case "ArrowUp":
        case " ":
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
        case " ":
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

  pollGamepadInput(deadzone: number) {
    const gamepads = navigator.getGamepads();
    if (!gamepads?.[0]) return;

    const gamepad = gamepads[0];

    for (const [index, button] of gamepad.buttons.entries()) {
      const action = this.gamepadKeyMap[index];
      const isPressed = button.pressed;
      const wasPressed = this.previousButtonStates[index] || false;

      if (isPressed && !wasPressed) {
        if (this.activeControllerButtons.includes(action)) return;
        this.activeControllerButtons.unshift(action);
      } else if (!isPressed && wasPressed) {
        this.activeControllerButtons = this.activeControllerButtons.filter(
          (button) => button !== action
        );
      }

      this.previousButtonStates[index] = isPressed;
    }

    // Handle analog stick input (axes 0 and 1)
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];

    if (Math.abs(leftStickX) > deadzone) {
      if (leftStickX < 0 && !this.activeControllerButtons.includes("left")) {
        this.activeControllerButtons.push("left");
      } else if (
        leftStickX > 0 &&
        !this.activeControllerButtons.includes("right")
      ) {
        this.activeControllerButtons.push("right");
      }
    } else {
      this.activeControllerButtons = this.activeControllerButtons.filter(
        (button) => button !== "left" && button !== "right"
      );
    }

    if (Math.abs(leftStickY) > deadzone) {
      if (leftStickY > 0 && !this.activeControllerButtons.includes("down")) {
        this.activeControllerButtons.push("down");
      }
    } else {
      this.activeControllerButtons = this.activeControllerButtons.filter(
        (button) => button !== "down"
      );
    }
  }

  get activeInputs(): Set<string> {
    // Combine keyboard and gamepad inputs
    const combinedInputs = new Set(this.pressedKeys);
    this.activeControllerButtons.forEach((button) => {
      combinedInputs.add(button);
    });
    return combinedInputs;
  }
}
