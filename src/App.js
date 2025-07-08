import React, { useState, useEffect, useCallback, useMemo } from "react";
import Player from "./Player";
import Platform from "./Platform";
import Enemy from "./Enemy";
import watermelonImg from "./watermelon.png";
import duckImg from "./Duck_Character.png";  // updated import
import bigfootImg from "./bigfoot.png";
import bg from "./daytime.jpg";
import "./App.css";

function App() {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(100);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hikeAccomplished, setHikeAccomplished] = useState(false);

  const GRAVITY = -0.3;
  const JUMP_VELOCITY = 12;
  const MOVE_ACCELERATION = 2;
  const MAX_SPEED = 8;
  const FRICTION = 0.2;

  const viewportWidth = 900;
  const playerWidth = 50;
  const playerHeight = 50;
  const maxGameWidth = 2100;

  const [platforms] = useState([
    { left: 0, bottom: 0, width: 300 },
    { left: 300, bottom: 40, width: 150 },
    { left: 500, bottom: 100, width: 150 },
    { left: 650, bottom: 160, width: 150 },
    { left: 800, bottom: 220, width: 150 },
    { left: 950, bottom: 280, width: 200 },
    { left: 950, bottom: 280, width: 200 },
    { left: 1500, bottom: 300, width: 100 },
    { left: 1510, bottom: 360, width: 100 },
    { left: 1520, bottom: 420, width: 100 },
    { left: 1530, bottom: 480, width: 100 },
    { left: 1540, bottom: 540, width: 100 },
    { left: 1870, bottom: 540, width: 180 },
  ]);

  const [enemies] = useState([
    { left: 400, bottom: 60, width: 50, height: 60 },
    { left: 900, bottom: 300, width: 50, height: 60 },
    { left: 1600, bottom: 560, width: 50, height: 60 },
  ]);

  const prize = useMemo(() => ({
    left: 2050,
    bottom: 540,
    width: 60,
    height: 60,
  }), []);

  function checkCollision(rect1, rect2) {
    return !(
      rect1.left > rect2.left + rect2.width ||
      rect1.left + rect1.width < rect2.left ||
      rect1.bottom > rect2.bottom + rect2.height ||
      rect1.bottom + rect1.height < rect2.bottom
    );
  }

  useEffect(() => {
    if (gameOver || hikeAccomplished) return;

    const interval = setInterval(() => {
      setVelocityY((vy) => vy + GRAVITY);

      setPlayerY((prevY) => {
        const newY = prevY + velocityY;
        const playerBottom = newY;
        const playerLeft = playerX;
        const playerRight = playerX + playerWidth;

        let landed = false;

        platforms.forEach((plat) => {
          const platTop = plat.bottom + 20;
          const platLeft = plat.left;
          const platRight = plat.left + plat.width;

          const isLanding =
            velocityY <= 0 &&
            playerBottom <= platTop &&
            playerBottom >= platTop - 10 &&
            playerRight > platLeft &&
            playerLeft < platRight;

          if (isLanding) {
            landed = true;
            setVelocityY(0);
            setIsJumping(false);
          }
        });

        if (!landed && newY < 0) {
          setGameOver(true);
          return prevY;
        }

        return newY;
      });

      setPlayerX((prevX) => {
        let newVX = velocityX;

        if (!isJumping) {
          if (velocityX > 0) newVX = Math.max(velocityX - FRICTION, 0);
          else if (velocityX < 0) newVX = Math.min(velocityX + FRICTION, 0);
        }

        setVelocityX(newVX);

        const newX = Math.min(Math.max(0, prevX + newVX), maxGameWidth);
        setScrollX(
          newX > viewportWidth / 2
            ? Math.min(newX - viewportWidth / 2, maxGameWidth - viewportWidth)
            : 0
        );
        return newX;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [velocityX, velocityY, playerX, playerY, gameOver, hikeAccomplished, platforms, isJumping, GRAVITY]); // added GRAVITY here

  const handleKeyDown = useCallback((event) => {
    if (gameOver || hikeAccomplished) return;

    if (event.code === "ArrowLeft") {
      setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED));
    } else if (event.code === "ArrowRight") {
      setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED));
    } else if ((event.code === "Space" || event.code === "ArrowUp") && !isJumping) {
      setVelocityY(JUMP_VELOCITY);
      setIsJumping(true);
    }
  }, [gameOver, hikeAccomplished, isJumping]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || hikeAccomplished) return;

    const playerRect = {
      left: playerX,
      bottom: playerY,
      width: playerWidth,
      height: playerHeight,
    };

    const hitboxPadding = 10;

    for (const enemy of enemies) {
      const enemyRect = {
        left: enemy.left + hitboxPadding,
        bottom: enemy.bottom + hitboxPadding,
        width: enemy.width - 2 * hitboxPadding,
        height: enemy.height - 2 * hitboxPadding,
      };
      if (checkCollision(playerRect, enemyRect)) {
        setGameOver(true);
        return;
      }
    }

    if (checkCollision(playerRect, prize)) {
      setHikeAccomplished(true);
    }
  }, [playerX, playerY, enemies, prize, gameOver, hikeAccomplished]);

  const restartGame = () => {
    setPlayerX(50);
    setPlayerY(100);
    setVelocityX(0);
    setVelocityY(0);
    setIsJumping(false);
    setScrollX(0);
    setGameOver(false);
    setHikeAccomplished(false);
  };

  return (
    <div className="App">
      <div className="game-layout">
        {/* Instructions - Left Panel */}
        <div className="instructions">
          <h3>Controls</h3>
          <p>← Left Arrow: Move Left</p>
          <p>→ Right Arrow: Move Right</p>
          <p>↑ Up Arrow or Space: Jump</p>
        </div>

        {/* Game Area - Center */}
        <div
          className="game-board"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
            overflow: "hidden",
            width: viewportWidth,
            height: 600,
          }}
        >
          <Player x={playerX - scrollX} y={playerY} img={duckImg} />
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
              img={bigfootImg}
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
          {(gameOver || hikeAccomplished) && (
            <div className="game-over">
              <h1>{gameOver ? "Game Over" : "Hike Accomplished!"}</h1>
              <button onClick={restartGame}>Restart Game</button>
            </div>
          )}
        </div>

        {/* Controls - Right Panel */}
        <div className="side-panel">
          <div className="controls">
            <button onClick={() => setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED))}>Left</button>
            <button onClick={() => {
              if (!isJumping) {
                setVelocityY(JUMP_VELOCITY);
                setIsJumping(true);
              }
            }}>Jump</button>
            <button onClick={() => setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED))}>Right</button>
          </div>
          <div className="restart-button">
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
      </div>
    </div>
  );
}

export default App;
