//Import the bigfoot image from the static assets folder
import bigfootImg from "../static/images/bigfoot.png"; 

//Define the Enemy component and it's props (position and size)
function Enemy({ left, bottom, width, height }) {
  return (
    <img
      src={bigfootImg} //Set the image source to the imported Bigfoot image
      alt="Bigfoot Enemy"
      style={{
        position: "absolute",
        left: left,
        bottom: bottom,
        width: width,
        height: height,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 2, //Controls stacking order (appears above background/platforms)             
      }}
    />
  );
}

export default Enemy;
