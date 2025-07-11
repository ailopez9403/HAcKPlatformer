
import bigfootImg from "./static/images/bigfoot.png"; // adjust path if needed

function Enemy({ left, bottom, width, height }) {
  return (
    <img
      src={bigfootImg}
      alt="Bigfoot Enemy"
      style={{
        position: "absolute",
        left: left,
        bottom: bottom,
        width: width,
        height: height,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 2,
      }}
    />
  );
}

export default Enemy;