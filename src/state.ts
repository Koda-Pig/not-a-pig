import type { PlayerState, PlayerStateIndex } from "./types";
import type Player from "./player";

export abstract class State {
  state: PlayerState;
  player!: Player;

  constructor(state: PlayerState) {
    this.state = state;
  }

  abstract enter(): void;
  abstract handleInput(input: string): void;
}

export const states: Record<PlayerState, PlayerStateIndex> = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
  RUNNING_LEFT: 4,
  RUNNING_RIGHT: 5,
  JUMPING_LEFT: 6,
  JUMPING_RIGHT: 7,
  FALLING_LEFT: 8,
  FALLING_RIGHT: 9
};

export class StandingLeft extends State {
  constructor(player: Player) {
    super("STANDING_LEFT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 1;
    this.player.speed = 0;
  }
  handleInput(input: string) {
    if (input == "PRESS right") this.player.setState(states.RUNNING_RIGHT);
    else if (input === "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_LEFT);
    else if (input === "PRESS up") this.player.setState(states.JUMPING_LEFT);
  }
}

export class StandingRight extends State {
  constructor(player: Player) {
    super("STANDING_RIGHT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 0;
    this.player.speed = 0;
  }
  handleInput(input: string) {
    if (input == "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input === "PRESS right")
      this.player.setState(states.RUNNING_RIGHT);
    else if (input === "PRESS down") this.player.setState(states.SITTING_RIGHT);
    else if (input === "PRESS up") this.player.setState(states.JUMPING_RIGHT);
  }
}

export class SittingLeft extends State {
  constructor(player: Player) {
    super("SITTING_LEFT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 4;
    this.player.frameY = 9;
    this.player.speed = 0;
  }
  handleInput(input: string) {
    if (input == "PRESS down") this.player.setState(states.SITTING_LEFT);
    else if (input == "RELEASE down")
      this.player.setState(states.STANDING_LEFT);
  }
}

export class SittingRight extends State {
  constructor(player: Player) {
    super("SITTING_RIGHT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 4;
    this.player.frameY = 8;
    this.player.speed = 0;
  }
  handleInput(input: string) {
    if (input == "PRESS left") this.player.setState(states.SITTING_LEFT);
    else if (input == "RELEASE down")
      this.player.setState(states.STANDING_RIGHT);
  }
}

export class RunningLeft extends State {
  constructor(player: Player) {
    super("RUNNING_LEFT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 8;
    this.player.frameY = 7;
    this.player.speed = -this.player.maxSpeed;
  }
  handleInput(input: string) {
    if (input == "PRESS right") this.player.setState(states.RUNNING_RIGHT);
    else if (input == "RELEASE left")
      this.player.setState(states.STANDING_LEFT);
    else if (input == "PRESS down") this.player.setState(states.SITTING_LEFT);
  }
}

export class RunningRight extends State {
  constructor(player: Player) {
    super("RUNNING_RIGHT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 8;
    this.player.frameY = 6;
    this.player.speed = this.player.maxSpeed;
  }
  handleInput(input: string) {
    if (input == "PRESS left") this.player.setState(states.RUNNING_LEFT);
    else if (input == "RELEASE right")
      this.player.setState(states.STANDING_RIGHT);
    else if (input == "PRESS down") this.player.setState(states.SITTING_RIGHT);
  }
}

export class JumpingLeft extends State {
  constructor(player: Player) {
    super("JUMPING_LEFT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 3;
    if (this.player.onGround()) this.player.vy -= 20;
    this.player.speed = -this.player.maxSpeed / 2;
  }
  handleInput(input: string) {
    if (input === "PRESS right") this.player.setState(states.JUMPING_RIGHT);
    else if (this.player.onGround()) this.player.setState(states.STANDING_LEFT);
    else if (this.player.vy > 0) this.player.setState(states.FALLING_LEFT);
  }
}

export class JumpingRight extends State {
  constructor(player: Player) {
    super("JUMPING_RIGHT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 2;
    if (this.player.onGround()) this.player.vy -= 20;
    this.player.speed = this.player.maxSpeed / 2;
  }
  handleInput(input: string) {
    if (input === "PRESS left") this.player.setState(states.JUMPING_LEFT);
    else if (this.player.onGround())
      this.player.setState(states.STANDING_RIGHT);
    else if (this.player.vy > 0) this.player.setState(states.FALLING_RIGHT);
  }
}

export class FallingLeft extends State {
  constructor(player: Player) {
    super("FALLING_LEFT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 5;
  }
  handleInput(input: string) {
    if (input === "PRESS right") this.player.setState(states.FALLING_RIGHT);
    else if (this.player.onGround()) this.player.setState(states.STANDING_LEFT);
  }
}

export class FallingRight extends State {
  constructor(player: Player) {
    super("FALLING_RIGHT" as const);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 4;
  }
  handleInput(input: string) {
    if (input === "PRESS left") this.player.setState(states.FALLING_LEFT);
    else if (this.player.onGround())
      this.player.setState(states.STANDING_RIGHT);
  }
}
