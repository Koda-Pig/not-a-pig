import type InputHandler from "./input";
import type Player from "./player";

export function drawStatusText(
  context: CanvasRenderingContext2D,
  input: InputHandler,
  player: Player
) {
  context.font = "28px Helvetica";
  context.fillText("Keyboard input: " + Array.from(input.pressedKeys), 20, 50);
  context.fillText("Gamepad input: " + input.activeControllerButtons, 20, 80);
  context.fillText(
    "Combined input: " + Array.from(input.activeInputs),
    20,
    110
  );
  context.fillText("Active state: " + player.currentState.state, 20, 140);
}

export function renderControllerSettings(
  input: HTMLInputElement,
  output: HTMLOutputElement,
  fakeRange: HTMLSpanElement
) {
  const val = parseFloat(input.value);
  output.innerText = `${(val * 100).toFixed(0)}`;
  fakeRange.style.setProperty("--deadzone", input.value);
}
