import Player from "./player";
import { drawStatusText } from "./utils";
import InputHandler from "./input";

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
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
      player.update(input.pressedKeys);
      player.draw(ctx, deltaTime);
      drawStatusText(ctx, input, player);
      accumulator -= cappedDeltaTime;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
