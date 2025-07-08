class Player
{
    constructor(position) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }
    }

    draw(context) {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 100, 100);
    }

    update(context) {
        this.draw(context);
        this.position.y += this.velocity.y;
        this.velocity.y += 0.5;
    }

}

export default Player;
