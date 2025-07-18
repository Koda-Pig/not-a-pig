import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
  FallingLeft,
  FallingRight
} from "./state";
import type { PlayerStateIndex } from "./types";
import type { State } from "./state";

export default class Player {
  gameWidth: number;
  gameHeight: number;
  states: State[];
  currentState: State;
  image: HTMLImageElement;
  width: number;
  height: number;
  x: number;
  y: number;
  vy: number;
  weight: number;
  frameX: number;
  frameY: number;
  maxFrame: number;
  speed: number;
  maxSpeed: number;
  fps: number;
  frameTimer: number;
  frameInterval: number;

  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
      new FallingLeft(this),
      new FallingRight(this)
    ];
    this.currentState = this.states[1];
    if (!document.getElementById("dogImg")) {
      throw new Error("Dog image not found");
    }
    this.image = document.getElementById("dogImg") as HTMLImageElement;
    this.width = 200;
    this.height = 181.83;
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height;
    this.vy = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 6;
    this.speed = 0;
    this.maxSpeed = 20;
    this.fps = 60;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
  }
  draw(context: CanvasRenderingContext2D, deltaTime: number) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    context.drawImage(
      this.image,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(input: Set<string>) {
    this.currentState.handleInput(input);
    // Keep player in center of screen - no horizontal movement
    this.x = this.gameWidth / 2 - this.width / 2;
    // vertical movement
    this.y += this.vy;
    if (!this.onGround) this.vy += this.weight;
    else this.vy = 0;
    // prevent player from falling through floor
    if (this.y > this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
    }
  }
  setState(state: PlayerStateIndex) {
    this.currentState = this.states[state];
    this.frameX = 0; // Reset frame to 0 when state changes
    this.currentState.enter();
  }
  get onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}
