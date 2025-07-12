import type InputHandler from "./input";
import type Player from "./player";

export function drawStatusText(
  context: CanvasRenderingContext2D,
  input: InputHandler,
  player: Player
) {
  context.font = "28px Helvetica";
  context.fillText("Last input: " + Array.from(input.pressedKeys), 20, 50);
  context.fillText("Active state: " + player.currentState.state, 20, 90);
}
