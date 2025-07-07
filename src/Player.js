class Player
{
    constructor()
    {
        this.position =
        {
            x:0,
            y:0,
        }
    }

    draw(context) 
    {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 100, 100);
    }

    update(context) 
    {
        this.draw(context);
        this.position.y++;
    }

}

export default Player;
