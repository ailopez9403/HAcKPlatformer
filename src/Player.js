

class Player
{
  constructor()
  {
    this.position =
    {
      x:0,
      y:0
    }
  }

  draw(context) {
    context.fillStyle = '#f00';
    context.fillRect(20,20,20,20);

  }
}



export default Player;