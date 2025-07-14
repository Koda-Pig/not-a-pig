import type { PlayerState, PlayerStateIndex } from "./types";
import type Player from "./player";

export abstract class State {
  state: PlayerState;
  player!: Player;

  constructor(state: PlayerState) {
    this.state = state;
  }

  abstract enter(): void;
  abstract handleInput(input: Set<string>): void;
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
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_LEFT);
    } else if (input.has("down")) {
      this.player.setState(states.SITTING_LEFT);
    } else if (input.has("left")) {
      this.player.setState(states.RUNNING_LEFT);
    } else if (input.has("right")) {
      this.player.setState(states.RUNNING_RIGHT);
    }
    // If no input, stay in STANDING_LEFT
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
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_RIGHT);
    } else if (input.has("down")) {
      this.player.setState(states.SITTING_RIGHT);
    } else if (input.has("left")) {
      this.player.setState(states.RUNNING_LEFT);
    } else if (input.has("right")) {
      this.player.setState(states.RUNNING_RIGHT);
    }
    // If no input, stay in STANDING_RIGHT
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
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_LEFT);
    } else if (input.has("right") && !input.has("down")) {
      // Only turn right if not holding down
      this.player.setState(states.SITTING_RIGHT);
    } else if (!input.has("down")) {
      // Stand up when down is released
      this.player.setState(states.STANDING_LEFT);
    }
    // If down is held, stay sitting
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
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_RIGHT);
    } else if (input.has("left") && !input.has("down")) {
      // Only turn left if not holding down
      this.player.setState(states.SITTING_LEFT);
    } else if (!input.has("down")) {
      // Stand up when down is released
      this.player.setState(states.STANDING_RIGHT);
    }
    // If down is held, stay sitting
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
    this.player.speed = 0; // No horizontal movement (move background instead)
  }
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_LEFT);
    } else if (input.has("down")) {
      this.player.setState(states.SITTING_LEFT);
    } else if (input.has("right") && !input.has("left")) {
      // Change direction
      this.player.setState(states.RUNNING_RIGHT);
    } else if (!input.has("left")) {
      // Stop running when left is released
      this.player.setState(states.STANDING_LEFT);
    }
    // If left is held, keep running left
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
    this.player.speed = 0; // No horizontal movement
  }
  handleInput(input: Set<string>) {
    if (input.has("up")) {
      this.player.setState(states.JUMPING_RIGHT);
    } else if (input.has("down")) {
      this.player.setState(states.SITTING_RIGHT);
    } else if (input.has("left") && !input.has("right")) {
      // Change direction
      this.player.setState(states.RUNNING_LEFT);
    } else if (!input.has("right")) {
      // Stop running when right is released
      this.player.setState(states.STANDING_RIGHT);
    }
    // If right is held, keep running right
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
    if (this.player.onGround) {
      this.player.vy -= 20;
    }
    this.player.speed = 0; // No horizontal movement
  }
  handleInput(input: Set<string>) {
    // No horizontal movement in air - background moves instead
    this.player.speed = 0;

    // Allow direction change while jumping
    if (input.has("right") && !input.has("left")) {
      this.player.setState(states.JUMPING_RIGHT);
    }

    // Check for landing or falling
    if (this.player.onGround) {
      if (input.has("left")) {
        this.player.setState(states.RUNNING_LEFT);
      } else if (input.has("right")) {
        this.player.setState(states.RUNNING_RIGHT);
      } else {
        this.player.setState(states.STANDING_LEFT);
      }
    } else if (this.player.vy > 0) {
      this.player.setState(states.FALLING_LEFT);
    }
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
    if (this.player.onGround) {
      this.player.vy -= 20;
    }
    this.player.speed = 0; // No horizontal movement
  }
  handleInput(input: Set<string>) {
    // No horizontal movement in air - background moves instead
    this.player.speed = 0;

    // Allow direction change while jumping
    if (input.has("left") && !input.has("right")) {
      this.player.setState(states.JUMPING_LEFT);
    }

    // Check for landing or falling
    if (this.player.onGround) {
      if (input.has("right")) {
        this.player.setState(states.RUNNING_RIGHT);
      } else if (input.has("left")) {
        this.player.setState(states.RUNNING_LEFT);
      } else {
        this.player.setState(states.STANDING_RIGHT);
      }
    } else if (this.player.vy > 0) {
      this.player.setState(states.FALLING_RIGHT);
    }
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
    this.player.speed = 0; // No horizontal movement
  }
  handleInput(input: Set<string>) {
    // No horizontal movement while falling - background moves instead
    this.player.speed = 0;

    // Allow direction change while falling
    if (input.has("right") && !input.has("left")) {
      this.player.setState(states.FALLING_RIGHT);
    }

    // Check for landing
    if (this.player.onGround) {
      if (input.has("left")) {
        this.player.setState(states.RUNNING_LEFT);
      } else if (input.has("right")) {
        this.player.setState(states.RUNNING_RIGHT);
      } else {
        this.player.setState(states.STANDING_LEFT);
      }
    }
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
    this.player.speed = 0; // No horizontal movement
  }
  handleInput(input: Set<string>) {
    // No horizontal movement while falling - background moves instead
    this.player.speed = 0;

    // Allow direction change while falling
    if (input.has("left") && !input.has("right")) {
      this.player.setState(states.FALLING_LEFT);
    }

    // Check for landing
    if (this.player.onGround) {
      if (input.has("right")) {
        this.player.setState(states.RUNNING_RIGHT);
      } else if (input.has("left")) {
        this.player.setState(states.RUNNING_LEFT);
      } else {
        this.player.setState(states.STANDING_RIGHT);
      }
    }
  }
}
