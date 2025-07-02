import React from "react";

function Platform({ left, bottom, width }) {
  return (
    <div
      className="platform"
      style={{
        position: "absolute",
        left: `${left}px`,
        bottom: `${bottom}px`,
        width: `${width}px`,
        height: "20px",
        backgroundColor: "green"
      }}
    />
  );
}

export default Platform;