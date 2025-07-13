import Player from "./player";
import { drawStatusText, renderControllerSettings } from "./utils";
import InputHandler from "./input";

window.addEventListener("load", () => {
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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  loading.style.display = "none";

  const player = new Player(canvas.width, canvas.height);
  const input = new InputHandler();

  const TARGET_FPS = 60;
  const FRAME_DURATION = 1000 / TARGET_FPS;

  let lastTime = 0;
  let accumulator = 0;

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
      input.pollGamepadInput();
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
