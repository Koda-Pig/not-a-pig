export default class Background {
  gameWidth: number;
  gameHeight: number;
  images: HTMLImageElement[];
  width: number;
  height: number;
  x: number;
  y: number;
  fps: number;

  constructor(
    gameWidth: number,
    gameHeight: number,
    images: HTMLImageElement[]
  ) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.images = images;
    this.width = 200;
    this.height = 181.83;
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height;
    this.fps = 30;
  }
  draw(context: CanvasRenderingContext2D, deltaTime: number) {
    context.drawImage(
      this.images[0],
      this.width,
      this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(input: Set<string>) {
    // horizontal movement
  }
}
