
import duckImage from "../static/images/Duck_Character.png"; // adjust the path if needed

function Player({ x, y }) {
  return (
    <img
      src={duckImage}
      alt="Duck Character"
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        width: 50, // or whatever size fits
        height: 50,
      }}
    />
  );
}

export default Player;