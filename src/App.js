import React, { useState, useEffect, useCallback, useMemo } from "react";
import Player from "./Player";
import Platform from "./Platform";
import Enemy from "./Enemy";
import watermelonImg from "./prize.png";
import duckImg from "./Duck_Character.png";
import bigfootImg from "./bigfoot.png";
import bgDay from "./daytime.jpg";
import bgNight from "./night-time.jpg";
import bgDusk from "./dawn.jpg";
import "./App.css";

function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [prize, setPrize] = useState(null);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(100);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hikeAccomplished, setHikeAccomplished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLevelToLoad, setNextLevelToLoad] = useState(null);

  const GRAVITY = -0.3;
  const JUMP_VELOCITY = 12;
  const MOVE_ACCELERATION = 2;
  const MAX_SPEED = 8;
  const FRICTION = 0.2;
  const viewportWidth = 900;
  const playerWidth = 50;
  const playerHeight = 50;
  const maxGameWidth = 2100;

  const levels = useMemo(() => [
    {
      name: "Daytime",
      background: bgDay,
      platforms: [
        { left: 0, bottom: 0, width: 300 },
        { left: 300, bottom: 40, width: 150 },
        { left: 500, bottom: 100, width: 150 },
        { left: 650, bottom: 160, width: 150 },
        { left: 800, bottom: 220, width: 150 },
        { left: 950, bottom: 280, width: 200 },
        { left: 1500, bottom: 300, width: 100 },
        { left: 1510, bottom: 360, width: 100 },
        { left: 1520, bottom: 420, width: 100 },
        { left: 1530, bottom: 480, width: 100 },
        { left: 1540, bottom: 540, width: 100 },
        { left: 1870, bottom: 540, width: 180 },
      ],
      enemies: [
        { left: 400, bottom: 60, width: 50, height: 60 },
        { left: 900, bottom: 300, width: 50, height: 60 },
        { left: 1600, bottom: 560, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 540, width: 60, height: 60 },
    },
    {
      name: "Night",
      background: bgNight,
      platforms: [
        { left: 0, bottom: 0, width: 400 },
        { left: 450, bottom: 70, width: 100 },
        { left: 600, bottom: 150, width: 120 },
        { left: 800, bottom: 200, width: 120 },
        { left: 950, bottom: 300, width: 150 },
        { left: 1200, bottom: 370, width: 150 },
        { left: 1450, bottom: 400, width: 180 },
        { left: 1800, bottom: 500, width: 160 },
      ],
      enemies: [
        { left: 700, bottom: 170, width: 50, height: 60 },
        { left: 1300, bottom: 380, width: 50, height: 60 },
        { left: 1900, bottom: 510, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 500, width: 60, height: 60 },
    },
    {
      name: "Dusk",
      background: bgDusk,
      platforms: [
        { left: 0, bottom: 0, width: 300 },
        { left: 400, bottom: 100, width: 100 },
        { left: 600, bottom: 200, width: 120 },
        { left: 800, bottom: 300, width: 100 },
        { left: 1000, bottom: 400, width: 80 },
        { left: 1200, bottom: 500, width: 80 },
        { left: 1400, bottom: 450, width: 80 },
        { left: 1600, bottom: 350, width: 80 },
        { left: 1950, bottom: 320, width: 100 },
      ],
      enemies: [
        { left: 500, bottom: 120, width: 50, height: 60 },
        { left: 850, bottom: 320, width: 50, height: 60 },
        { left: 1100, bottom: 420, width: 50, height: 60 },
        { left: 1300, bottom: 520, width: 50, height: 60 },
        { left: 1700, bottom: 360, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 320, width: 60, height: 60 },
    },
  ], []);

  const loadLevel = useCallback((index) => {
    const level = levels[index];
    setCurrentLevelIndex(index);
    setPlatforms(level.platforms);
    setEnemies(level.enemies);
    setPrize(level.prize);
    setPlayerX(50);
    setPlayerY(100);
    setVelocityX(0);
    setVelocityY(0);
    setIsJumping(false);
    setScrollX(0);
    setGameOver(false);
    setHikeAccomplished(false);
    setCurrentScreen("game");
  }, [levels]);

  const startTransitionToLevel = (index) => {
    setIsTransitioning(true);
    setNextLevelToLoad(index);
  };

  const handleOverlayAnimationEnd = (e) => {
    if (e.animationName === "wipeExpand") {
      if (nextLevelToLoad !== null) {
        loadLevel(nextLevelToLoad);
        setNextLevelToLoad(null);
        e.target.classList.remove("expand");
        e.target.classList.add("contract");
      }
    } else if (e.animationName === "wipeContract") {
      setIsTransitioning(false);
      e.target.classList.remove("contract");
    }
  };

  useEffect(() => {
    if (currentScreen !== "game" || gameOver || hikeAccomplished) return;

    const interval = setInterval(() => {
      setVelocityY((vy) => vy + GRAVITY);

      setPlayerY((prevY) => {
        const nextY = prevY + velocityY;
        const playerBottomNext = nextY;
        const playerBottomPrev = prevY;
        const playerLeft = playerX;
        const playerRight = playerX + playerWidth;

        let landed = false;
        let correctedY = nextY;

        platforms.forEach((plat) => {
          const platTop = plat.bottom + 20;
          const platLeft = plat.left;
          const platRight = plat.left + plat.width;

          const wasAbovePlatform = playerBottomPrev >= platTop;
          const isBelowPlatform = playerBottomNext <= platTop;

          const horizontalOverlap =
            playerRight > platLeft && playerLeft < platRight;

          const isFallingThrough =
            velocityY <= 0 &&
            wasAbovePlatform &&
            isBelowPlatform &&
            horizontalOverlap;

          if (isFallingThrough) {
            landed = true;
            correctedY = platTop;
            setVelocityY(0);
            setIsJumping(false);
          }
        });

        if (!landed && nextY < 0) {
          setGameOver(true);
          return prevY;
        }

        return correctedY;
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
  }, [
    velocityX,
    velocityY,
    playerX,
    playerY,
    gameOver,
    hikeAccomplished,
    platforms,
    isJumping,
    GRAVITY,
    currentScreen,
  ]);

  const handleKeyDown = useCallback((event) => {
    if (currentScreen !== "game" || gameOver || hikeAccomplished) return;

    if (event.code === "ArrowLeft") {
      setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED));
    } else if (event.code === "ArrowRight") {
      setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED));
    } else if ((event.code === "Space" || event.code === "ArrowUp") && !isJumping) {
      setVelocityY(JUMP_VELOCITY);
      setIsJumping(true);
    }
  }, [currentScreen, gameOver, hikeAccomplished, isJumping]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (currentScreen !== "game" || gameOver || hikeAccomplished) return;

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

      if (
        !(
          playerRect.left > enemyRect.left + enemyRect.width ||
          playerRect.left + playerRect.width < enemyRect.left ||
          playerRect.bottom > enemyRect.bottom + enemyRect.height ||
          playerRect.bottom + playerRect.height < enemyRect.bottom
        )
      ) {
        setGameOver(true);
        return;
      }
    }

    if (
      prize &&
      !(
        playerRect.left > prize.left + prize.width ||
        playerRect.left + playerRect.width < prize.left ||
        playerRect.bottom > prize.bottom + prize.height ||
        playerRect.bottom + playerRect.height < prize.bottom
      )
    ) {
      setHikeAccomplished(true);
    }
  }, [playerX, playerY, enemies, prize, gameOver, hikeAccomplished, currentScreen]);

  const restartGame = () => {
    loadLevel(currentLevelIndex);
  };

  return (
    <div className="App">
      {currentScreen === "menu" ? (
        <div className="menu-screen">
          <h1>Platformer Game</h1>
          <h2>Select a Level</h2>
          {levels.map((lvl, i) => (
            <button key={i} onClick={() => loadLevel(i)}>
              {lvl.name}
            </button>
          ))}
          <div className="instructions">
            <h3>Controls</h3>
            <p>← Left Arrow: Move Left</p>
            <p>→ Right Arrow: Move Right</p>
            <p>↑ Up Arrow or Space: Jump</p>
          </div>
        </div>
      ) : (
        <div className="game-layout">
          <div
            className="game-board"
            style={{ backgroundImage: `url(${levels[currentLevelIndex].background})` }}
          >
            <Player x={playerX - scrollX} y={playerY} img={duckImg} />
            {platforms.map((plat, i) => (
              <Platform
                key={i}
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
            {prize && (
              <img
                src={watermelonImg}
                alt="Watermelon Prize"
                style={{
                  position: "absolute",
                  left: prize.left - scrollX,
                  bottom: prize.bottom,
                  width: prize.width,
                  height: prize.height,
                  zIndex: 3,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            )}

            {(gameOver || hikeAccomplished) && (
              <div className="game-over">
                <h1>{gameOver ? "Game Over" : "Hike Accomplished!"}</h1>
                {gameOver ? (
                  <button onClick={restartGame}>Restart</button>
                ) : (
                  <>
                    <button onClick={restartGame}>Replay Level</button>
                    <button
                      onClick={() => {
                        if (currentLevelIndex < levels.length - 1) {
                          startTransitionToLevel(currentLevelIndex + 1);
                        }
                      }}
                      disabled={currentLevelIndex >= levels.length - 1}
                    >
                      Next Level
                    </button>
                  </>
                )}
              </div>
            )}

            {isTransitioning && (
              <div
                className="screen-wipe expand"
                onAnimationEnd={handleOverlayAnimationEnd}
              />
            )}
          </div>

          <div className="side-panel">
            <div className="instructions">
              <h3>Keyboard Controls</h3>
              <p>← Left Arrow: Move Left</p>
              <p>→ Right Arrow: Move Right</p>
              <p>↑ Up Arrow or Space: Jump</p>
            </div>
            <div className="instructions">
              <h3>Mouse Controls</h3>
            </div>
            <div className="controls">
              <div className="horizontal-buttons">
                <button onClick={() => setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED))}>
                  Left
                </button>
                <button onClick={() => setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED))}>
                  Right
                </button>
              </div>
              <button
                onClick={() => {
                  if (!isJumping) {
                    setVelocityY(JUMP_VELOCITY);
                    setIsJumping(true);
                  }
                }}
              >
                Jump
              </button>
            </div>

            {/* Restart level button */}
            <button onClick={restartGame}>Restart Level</button>

            <button onClick={() => setCurrentScreen("menu")}>Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;