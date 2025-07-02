import React from "react";

function Player({ x, y }) {
  return (
    <div
      className="player"
      style={{
        position: "absolute",
        left: `${x}px`,
        bottom: `${y}px`,
        width: "30px",
        height: "30px",
        backgroundColor: "blue"
      }}
    />
  );
}

export default Player;