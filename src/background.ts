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
    // Set background to cover the entire canvas
    this.width = gameWidth;
    this.height = gameHeight;
    // Position at top-left corner to cover full screen
    this.x = 0;
    this.y = 0;
    this.fps = 30;
  }

  draw(context: CanvasRenderingContext2D, deltaTime: number) {
    // Fix drawImage parameters: (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    context.drawImage(
      this.images[0],
      0,
      0,
      this.images[0].width,
      this.images[0].height, // source rectangle
      this.x,
      this.y,
      this.width,
      this.height // destination rectangle
    );
  }

  update(input: Set<string>) {
    // horizontal movement
  }
}
