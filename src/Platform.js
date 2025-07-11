
import platformImg from "./static/images/Platform_Image.png"; // adjust the path if needed

function Platform({ left, bottom, width }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        height: 20,
        backgroundImage: `url(${platformImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: 2,
      }}
    />
  );
}

export default Platform;
