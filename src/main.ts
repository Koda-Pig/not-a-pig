import Player from "./player";
import { drawStatusText, renderControllerSettings } from "./utils";
import InputHandler from "./input";
import Background from "./background";
import { FRAME_DURATION } from "./constants";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const controllerSettings = document.getElementById(
  "controllerSettings"
) as HTMLFieldSetElement;
const fakeRange = controllerSettings.querySelector(
  "#fakeRange"
) as HTMLSpanElement;
const deadzoneInput = controllerSettings.querySelector(
  "#deadzone"
) as HTMLInputElement;
const deadzoneOutput = controllerSettings.querySelector(
  "#deadzoneOutput"
) as HTMLOutputElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const loading = document.getElementById("loading") as HTMLHeadingElement;
const backgroundImages = document.querySelectorAll(
  ".bg-img"
) as NodeListOf<HTMLImageElement>;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
loading.style.display = "none";

const player = new Player(canvas.width, canvas.height);
const input = new InputHandler();
const background = new Background(
  canvas.width,
  canvas.height,
  Array.from(backgroundImages)
);

let lastTime = 0;
let accumulator = 0;
let hasGamepad = false;
let timeout: number | undefined;

function animate(timeStamp: number) {
  if (lastTime === 0) {
    lastTime = timeStamp;
    requestAnimationFrame(animate);
    return;
  }
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  accumulator += deltaTime;

  if (accumulator >= FRAME_DURATION) {
    // cap the delta time for performance. See https://stephendoddtech.com/blog/game-design/spiral-of-death-game-loop-javascript
    const cappedDeltaTime = Math.min(accumulator, FRAME_DURATION * 3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hasGamepad) {
      input.pollGamepadInput(parseFloat(deadzoneInput.value));
    }
    background.update(player.currentState.state);
    background.draw(ctx);
    player.update(input.activeInputs);
    player.draw(ctx, deltaTime);
    drawStatusText(ctx, input, player);
    accumulator -= cappedDeltaTime;
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
renderControllerSettings(deadzoneInput, deadzoneOutput, fakeRange);

deadzoneInput.addEventListener("input", () => {
  renderControllerSettings(deadzoneInput, deadzoneOutput, fakeRange);
});

window.addEventListener("resize", () => {
  // add debounce to prevent multiple calls
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Update background dimensions when window resizes
    background.gameWidth = canvas.width;
    background.gameHeight = canvas.height;
    background.width = canvas.width;
    background.height = canvas.height;
  }, 100);
});

window.addEventListener("gamepadconnected", () => (hasGamepad = true));
window.addEventListener("gamepaddisconnected", () => (hasGamepad = false));
