//Import the image used as the texture for all platforms
import platformImg from "../static/images/Platform_Image.png";

//Define the Platform component, whose props are position and width
function Platform({ left, bottom, width }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        height: 20, 
        backgroundImage: `url(${platformImg})`, //Set the background to the imported platform image
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: 2,
      }}
    />
  );
}

export default Platform;

