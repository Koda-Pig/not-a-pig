import type { PlayerState } from "./types";

export default class Background {
  gameWidth: number;
  gameHeight: number;
  images: HTMLImageElement[];
  width: number;
  height: number;
  x: number;
  y: number;
  fps: number;
  sceneOffset: number;

  constructor(
    gameWidth: number,
    gameHeight: number,
    images: HTMLImageElement[]
  ) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.images = images;
    // Set background to cover the entire canvas
    this.width = 1920;
    this.height = 1080;
    // Position at top-left corner to cover full screen
    this.x = 0;
    this.y = 0;
    this.fps = 60;
    this.sceneOffset = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    // Calculate the scale to cover the height of the canvas
    const scale = this.gameHeight / this.height;

    // Calculate the scaled width and height
    const scaledWidth = this.width * scale;
    const scaledHeight = this.gameHeight; // Use the height of the canvas

    // Draw all images in a loop to cover the entire canvas width
    for (let i = 0; i < this.images.length; i++) {
      // Update the x position of the background for parallax effect
      // Each layer has a different speed for parallax effect
      const speed = i * 0.05; // Speed increases for each layer
      this.x = -(this.sceneOffset * 2 * speed) % scaledWidth;

      for (let x = this.x; x < this.gameWidth; x += scaledWidth) {
        context.drawImage(
          this.images[i],
          0, // Source X
          0, // Source Y
          this.width, // Source Width
          this.height, // Source Height
          x, // Destination X
          0, // Destination Y
          scaledWidth, // Destination Width
          scaledHeight // Destination Height
        );
      }
    }
  }

  update(playerState: PlayerState) {
    // horizontal movement - move background instead of player
    const moveSpeed = 5;
    switch (playerState) {
      case "RUNNING_LEFT":
      case "JUMPING_LEFT":
      case "FALLING_LEFT":
        this.sceneOffset -= moveSpeed; // Move background left when player presses left
        break;
      case "RUNNING_RIGHT":
      case "JUMPING_RIGHT":
      case "FALLING_RIGHT":
        this.sceneOffset += moveSpeed; // Move background right when player presses right
        break;
      default:
        break;
    }
  }
}
