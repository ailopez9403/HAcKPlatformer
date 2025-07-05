import React, { useState, useEffect, useCallback } from "react";
import Player from "./Player";
import Platform from "./Platform";
import Enemy from "./Enemy";
import watermelonImg from "./watermelon.png";
import bg from "./background.png";
import "./App.css";

function App() {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(100);
  const [score, setScore] = useState(0);
  const [lastLandedPlatformX, setLastLandedPlatformX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hikeAccomplished, setHikeAccomplished] = useState(false);
  const [canJumpOffPlatform, setCanJumpOffPlatform] = useState(true);

  const viewportWidth = 900;
  const playerWidth = 30;
  const playerHeight = 40;
  const maxGameWidth = 2100;

  const [platforms] = useState([
    { left: 0, bottom: 0, width: 300 },
    { left: 300, bottom: 40, width: 150 },
    { left: 500, bottom: 100, width: 150 },
    { left: 650, bottom: 160, width: 150 },
    { left: 800, bottom: 220, width: 150 },
    { left: 950, bottom: 280, width: 150 },
    { left: 1150, bottom: 280, width: 200 },
    { left: 1370, bottom: 280, width: 180 },
    { left: 1500, bottom: 300, width: 100 },
    { left: 1510, bottom: 360, width: 100 },
    { left: 1520, bottom: 420, width: 100 },
    { left: 1530, bottom: 480, width: 100 },
    { left: 1540, bottom: 540, width: 100 },
    { left: 1650, bottom: 540, width: 200 },
    { left: 1870, bottom: 540, width: 180 },
  ]);

  const [enemies] = useState([
    { left: 400, bottom: 60, width: 50, height: 60 },
    { left: 900, bottom: 300, width: 50, height: 60 },
    { left: 1600, bottom: 560, width: 50, height: 60 },
  ]);

  const prize = { left: 2050, bottom: 540, width: 60, height: 60 };

  useEffect(() => {
    if (gameOver || hikeAccomplished) return;

    const interval = setInterval(() => {
      setPlayerY((prevY) => {
        const playerBottom = prevY;
        const playerLeft = playerX;
        const playerRight = playerX + playerWidth;
        const playerTop = prevY + playerHeight;

        let landed = false;
        let newY = prevY;

        // Check landing on platforms
        platforms.forEach((plat) => {
          const platTop = plat.bottom + 20;
          const platLeft = plat.left;
          const platRight = plat.left + plat.width;

          const isLanding =
            playerBottom <= platTop &&
            playerBottom >= platTop - 5 &&
            playerRight > platLeft &&
            playerLeft < platRight;

          if (isLanding) {
            landed = true;
            newY = platTop;
            setCanJumpOffPlatform(true); // reset jump ability on landing

            if (plat.left > lastLandedPlatformX) {
              setScore((prev) => prev + 1);
              setLastLandedPlatformX(plat.left);
            }
          }
        });

        // Check collision with enemies
        for (let enemy of enemies) {
          const enemyLeft = enemy.left;
          const enemyRight = enemy.left + enemy.width;
          const enemyBottom = enemy.bottom;
          const enemyTop = enemy.bottom + enemy.height;

          const horizontalOverlap =
            playerRight > enemyLeft && playerLeft < enemyRight;
          const verticalOverlap =
            playerTop > enemyBottom && playerBottom < enemyTop;

          if (horizontalOverlap && verticalOverlap) {
            setGameOver(true);
            return prevY;
          }
        }

        // Check collision with prize
        const prizeLeft = prize.left;
        const prizeRight = prize.left + prize.width;
        const prizeBottom = prize.bottom;
        const prizeTop = prize.bottom + prize.height;

        const touchesPrize =
          playerRight > prizeLeft &&
          playerLeft < prizeRight &&
          playerTop > prizeBottom &&
          playerBottom < prizeTop;

        if (touchesPrize) {
          setHikeAccomplished(true);
          return prevY;
        }

        if (!landed) {
          if (playerBottom < -50) {
            setGameOver(true);
            return prevY;
          }
          return playerBottom - 5;
        }

        return newY > 0 ? newY : 0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    playerX,
    platforms,
    lastLandedPlatformX,
    gameOver,
    enemies,
    hikeAccomplished,
    prize.left,
    prize.bottom,
    prize.width,
    prize.height,
  ]);

  // Use useCallback to memoize jump and avoid stale closures + eslint warnings
  const jump = useCallback(() => {
    if (gameOver || hikeAccomplished) return;

    const onPlatform = platforms.some((p) => playerY === p.bottom + 20);
    const onGround = playerY === 0;

    if (onGround || onPlatform) {
      setPlayerY(playerY + 130);
      setCanJumpOffPlatform(true);
    } else if (canJumpOffPlatform) {
      setPlayerY(playerY + 130);
      setCanJumpOffPlatform(false);
    }
  }, [gameOver, hikeAccomplished, platforms, playerY, canJumpOffPlatform]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver || hikeAccomplished) return;

      if (event.code === "ArrowLeft") {
        setPlayerX((prevX) => {
          const newX = Math.max(prevX - 10, 0);
          setScrollX((s) =>
            newX < viewportWidth / 2 ? Math.max(newX - viewportWidth / 2, 0) : s
          );
          return newX;
        });
      } else if (event.code === "ArrowRight") {
        setPlayerX((prevX) => {
          const newX = Math.min(prevX + 10, maxGameWidth);
          setScrollX((s) =>
            newX > viewportWidth / 2
              ? Math.min(newX - viewportWidth / 2, maxGameWidth - viewportWidth)
              : 0
          );
          return newX;
        });
      } else if (event.code === "ArrowUp" || event.code === "Space") {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, gameOver, hikeAccomplished]);

  const restartGame = () => {
    setPlayerX(50);
    setPlayerY(100);
    setScore(0);
    setLastLandedPlatformX(0);
    setScrollX(0);
    setGameOver(false);
    setHikeAccomplished(false);
    setCanJumpOffPlatform(true);
  };

  return (
    <div className="App">
      <div
        className="game-board"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Player x={playerX - scrollX} y={playerY} />
        {platforms.map((plat, index) => (
          <Platform
            key={index}
            left={plat.left - scrollX}
            bottom={plat.bottom}
            width={plat.width}
          />
        ))}

        {enemies.map((enemy, i) => (
          <Enemy
            key={i}
            left={enemy.left - scrollX}
            bottom={enemy.bottom}
            width={enemy.width}
            height={enemy.height}
          />
        ))}

        <img
          src={watermelonImg}
          alt="Watermelon Prize"
          style={{
            position: "absolute",
            left: prize.left - scrollX,
            bottom: prize.bottom,
            width: prize.width,
            height: prize.height,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {gameOver && (
          <div className="game-over">
            <h1>Game Over</h1>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}

        {hikeAccomplished && (
          <div className="game-over">
            <h1>Hike accomplished!</h1>
            <button onClick={restartGame}>Play Again</button>
          </div>
        )}
      </div>

      <div className="score">Score: {score}</div>

      <div className="controls">
        <button
          onClick={() => {
            setPlayerX((x) => {
              const newX = Math.max(x - 10, 0);
              setScrollX((s) =>
                newX < viewportWidth / 2
                  ? Math.max(newX - viewportWidth / 2, 0)
                  : s
              );
              return newX;
            });
          }}
        >
          Left
        </button>
        <button onClick={jump}>Jump</button>
        <button
          onClick={() => {
            setPlayerX((x) => {
              const newX = Math.min(x + 10, maxGameWidth);
              setScrollX((s) =>
                newX > viewportWidth / 2
                  ? Math.min(newX - viewportWidth / 2, maxGameWidth - viewportWidth)
                  : 0
              );
              return newX;
            });
          }}
        >
          Right
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={restartGame}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cc3a3a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4d")}
        >
          Restart Game
        </button>
      </div>
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