import React from "react";
import "./App.css";
import PlatformerGame from "./PlatformerGame.js";

const App = () => (
  <div className="App">
    <PlatformerGame width={50} height={40} tilesize={16} />
  </div>
);

export default App;

