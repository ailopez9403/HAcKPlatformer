import React, { useState, useEffect } from "react";
import Player from "./Player";
import Platform from "./Platform";
import "./App.css";

function App() {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerY(prevY => {
        const playerHeight = 30;
        const platformTop = 20; // platform height
        const platformBottom = 0;
        const platformLeft = 0;
        const platformRight = 300;

        const isAbovePlatform =
          prevY > platformBottom + platformTop &&
          playerX + 30 > platformLeft &&
          playerX < platformRight;

        const isLandingOnPlatform =
          prevY <= platformBottom + platformTop &&
          prevY > platformBottom &&
          playerX + 30 > platformLeft &&
          playerX < platformRight;

        if (isLandingOnPlatform) {
          return platformBottom + platformTop; // Set to platform top
        }

        if (isAbovePlatform) {
          return prevY - 5; // Continue falling
        }

        // If on ground and not on platform
        if (prevY > 0 && !isLandingOnPlatform) {
          return prevY - 5;
        }

        return 0; // Hit the ground
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playerX]);

  const jump = () => {
    const platformTop = 20;
    const onPlatform = playerY === platformTop || playerY === 0;
    if (onPlatform) {
      setPlayerY(playerY + 60);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "ArrowLeft") {
        setPlayerX(prev => prev - 10);
      } else if (event.code === "ArrowRight") {
        setPlayerX(prev => prev + 10);
      } else if (event.code === "ArrowUp") {
        event.preventDefault(); // prevent page scrolling
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerY]);
  
 return (
    <div className="App">
      <div className="game-board">
        <Player x={playerX} y={playerY} />
        <Platform left={0} bottom={0} width={300} />
      </div>

      {/* Controls handled via keyboard: ← → ␣ */}
    </div>
  );
}

export default App;

/* import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/