class Player
{
    constructor(position) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.gravity = 0.25;
        this.height = 100;
    }

    draw(context) {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 100, this.height);
    }
}

export default Player;
