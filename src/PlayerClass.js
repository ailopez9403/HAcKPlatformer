class PlayerClass {
  constructor({ x = 0, y = 0 }) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = 50;
    this.height = 50;
    this.gravity = 1.5;
    this.moveSpeed = 7;
    this.jumpStrength = 20;

    this.isOnGround = false;  // track if on ground/platform
  }

  applyPhysics() {
    // horizontal movement
    this.position.x += this.velocity.x;

    // apply gravity if in air
    if (!this.isOnGround || this.velocity.y < 0) {
      this.velocity.y += this.gravity;
      this.isOnGround = false;
    }

    this.position.y += this.velocity.y;

    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isOnGround = true;
    }
    if (this.position.y === 0) {
      this.isOnGround = true;
    }
    if (this.position.y > 0) {
      this.isOnGround = false;
    }

    if (this.position.x < 0) this.position.x = 0;
  }

  moveLeft() {
    this.velocity.x = -this.moveSpeed;
  }

  moveRight() {
    this.velocity.x = this.moveSpeed;
  }

  stopMoving() {
    this.velocity.x = 0;
  }

  jump() {
    if (this.isOnGround) {
      this.velocity.y = -this.jumpStrength;
      this.isOnGround = false;
    }
  }

  landOn(platformTop) {
    this.position.y = platformTop;
    this.velocity.y = 0;
    this.isOnGround = true;
  }
}

export default PlayerClass;
