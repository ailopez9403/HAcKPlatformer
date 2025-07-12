//Import the duck character image from the static assets folder
import duckImage from "../static/images/Duck_Character.png"; // adjust the path if needed

//Define the Player component which takes in x and y position as props
function Player({ x, y }) {
  return (
    <img
      src={duckImage} //Set the image source to the duck character
      alt="Duck Character" 
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        width: 50,
        height: 50,
      }}
    />
  );
}

export default Player;