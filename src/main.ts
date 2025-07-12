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

  let lastTime = 0;
  function animate(timeStamp: number) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update(input.pressedKeys);
    player.draw(ctx, deltaTime);
    drawStatusText(ctx, input, player);
    requestAnimationFrame(animate);
  }
  animate(0);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
