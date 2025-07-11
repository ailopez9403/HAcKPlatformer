import React, { useState, useEffect, useCallback, useMemo } from "react";
import Player from "./Player";
import Platform from "./Platform";
import Enemy from "./Enemy";
import watermelonImg from "./static/images/prize.png";
import duckImg from "./static/images/Duck_Character.png";
import bigfootImg from "./static/images/bigfoot.png";
import levels from "./utilities/levels.js";
import "./static/styles/App.css";


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
  const [levelComplete, setLevelComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLevelToLoad, setNextLevelToLoad] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState({});

  const GRAVITY = -0.3;
  const JUMP_VELOCITY = 12;
  const MOVE_ACCELERATION = 2;
  const MAX_SPEED = 8;
  const FRICTION = 0.2;
  const viewportWidth = 900;
  const playerWidth = 50;
  const playerHeight = 50;
  const maxGameWidth = 2100;

 
  // New helper function to reset game state without affecting the timer
  const resetGameState = useCallback(() => {
    const level = levels[currentLevelIndex]; // Load current level's data
    setPlatforms(level.platforms);
    setEnemies(level.enemies.map(enemy => ({ ...enemy, direction: 1 })));
    setPrize(level.prize);
    setPlayerX(50);
    setPlayerY(100);
    setVelocityX(0);
    setVelocityY(0);
    setIsJumping(false);
    setScrollX(0);
    setGameOver(false);
    setLevelComplete(false);
    // Do NOT touch timer state here
  }, [currentLevelIndex, levels]); // Added currentLevelIndex to dependency array

  const loadLevel = useCallback((index) => {
    const level = levels[index];
    setCurrentLevelIndex(index);
    setPlatforms(level.platforms);
    setEnemies(level.enemies.map(enemy => ({ ...enemy, direction: 1 })));
    setPrize(level.prize);
    setPlayerX(50);
    setPlayerY(100);
    setVelocityX(0);
    setVelocityY(0);
    setIsJumping(false);
    setScrollX(0);
    setGameOver(false);
    setLevelComplete(false);
    setCurrentScreen("game");
    // Reset timer when a new level is explicitly loaded (from menu or next level)
    setElapsedTime(0);
    setTimerRunning(false); // Also stop the timer until player explicitly starts it
    setIsTransitioning(false); // <--- Make sure transition state is false when a level is loaded
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
      } else {
        // If the wipe expanded but there's no next level to load (e.g., going back to menu)
        // Ensure the transition state is cleared so the screen can become interactive again.
        setIsTransitioning(false);
      }
    } else if (e.animationName === "wipeContract") {
      setIsTransitioning(false);
      e.target.classList.remove("contract");
    }
  };

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setElapsedTime((time) => time + 10);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [timerRunning]);

  useEffect(() => {
    if (currentScreen !== "game" || gameOver || levelComplete) return;

    const interval = setInterval(() => {
      setVelocityY((vy) => vy + GRAVITY);

      setPlayerY((prevY) => {
        const nextY = prevY + velocityY;
        const playerBottomPrev = prevY;
        const playerBottomNext = nextY;
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
          setTimerRunning(false); // This stops timer on game over
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

        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            const platform = platforms.find(
              (plat) =>
                enemy.bottom === plat.bottom + 20 &&
                enemy.left >= plat.left &&
                enemy.left + enemy.width <= plat.left + plat.width
            );
            if (!platform) return enemy;

            let newLeft = enemy.left + (enemy.direction || 1) * 0.2;

            if (newLeft <= platform.left) {
              newLeft = platform.left;
              enemy.direction = 1;
            } else if (newLeft + enemy.width >= platform.left + platform.width) {
              newLeft = platform.left + platform.width - enemy.width;
              enemy.direction = -1;
            }

            return {
              ...enemy,
              left: newLeft,
              direction: enemy.direction,
            };
          })
        );

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
    levelComplete,
    platforms,
    isJumping,
    GRAVITY,
    currentScreen,
  ]);

  const handleKeyDown = useCallback(
    (event) => {
      if (currentScreen !== "game" || gameOver || levelComplete) return;

      if (event.code === "ArrowLeft") {
        setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED));
      } else if (event.code === "ArrowRight") {
        setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED));
      } else if (
        (event.code === "Space" || event.code === "ArrowUp") &&
        !isJumping
      ) {
        setVelocityY(JUMP_VELOCITY);
        setIsJumping(true);
      }
    },
    [currentScreen, gameOver, levelComplete, isJumping]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (currentScreen !== "game" || gameOver || levelComplete) return;

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
        setTimerRunning(false); // This stops timer on game over
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
      setLevelComplete(true);
      setTimerRunning(false); // Stop timer on level completion
      setLeaderboard((prev) => {
        const levelName = levels[currentLevelIndex].name;
        const currentBest = prev[levelName] ?? Infinity;
        if (elapsedTime < currentBest) {
          const updated = { ...prev, [levelName]: elapsedTime };
          localStorage.setItem("leaderboard", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [playerX, playerY, enemies, prize, gameOver, levelComplete, currentScreen, elapsedTime, currentLevelIndex, levels]);

  useEffect(() => {
    const saved = localStorage.getItem("leaderboard");
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  const restartGame = () => {
    // Call the new helper function to reset game state without affecting timer
    resetGameState();
    setTimerRunning(true); // Ensure timer starts running again after restart
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
  };

  const resetLeaderboard = () => {
    localStorage.removeItem("leaderboard");
    setLeaderboard({});
  };

  // Dedicated function for going back to menu
  const handleBackToMenu = () => {
    setCurrentScreen("menu");
    // Crucially, reset transition state here when going back to menu directly
    setIsTransitioning(false);
    setNextLevelToLoad(null); // Also clear any pending next level
  };

  return (
    <div className="App">
      {currentScreen === "menu" ? (
        <div className="menu-screen">
          <h1>Duck, Duck, Squatch</h1>
          <h2>Select a Level</h2>
          {levels.map((lvl, i) => (
            <button key={i} onClick={() => loadLevel(i)}>
              {lvl.name}
            </button>
          ))}

          <div className="leaderboard">
            <h3>Leaderboard (Fastest Level Times)</h3>
            {(() => {
              const entries = Object.entries(leaderboard).map(([levelName, time]) => ({ levelName, time }));
              entries.sort((a, b) => a.time - b.time);
              const top3 = entries.slice(0, 3);
              if (top3.length === 0) {
                return <p>No records yet</p>;
              }
              return top3.map(({ levelName, time }, index) => (
                <p key={levelName}>
                  {levelName}: {formatTime(time)}
                </p>
              ));
            })()}
            <button onClick={resetLeaderboard}>Reset Leaderboard</button>
          </div>

          <div className="instructions">
            <h3>Instructions</h3>
            <p>Avoid all the sasquatches for a prize at the end!</p>
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

            {(gameOver || levelComplete) && (
              <div className="game-over">
                <h1>{gameOver ? "Game Over" : "Level Complete!"}</h1>
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

            {/* Render screen wipe only if isTransitioning is true AND currentScreen is 'game' or 'transition' if you had one */}
            {/* The problem might be if isTransitioning is true and currentScreen is 'menu' */}
            {isTransitioning && currentScreen !== 'menu' && (
              <div
                className="screen-wipe expand"
                onAnimationEnd={handleOverlayAnimationEnd}
              />
            )}

            <div className="timer-display">
              <h3>Timer: {formatTime(elapsedTime)}</h3>
              {!timerRunning ? (
                <button onClick={() => setTimerRunning(true)}>Start Timer</button>
              ) : (
                <button onClick={() => setTimerRunning(false)}>Stop Timer</button>
              )}
            </div>
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
                <button
                  onClick={() =>
                    setVelocityX((vx) => Math.max(vx - MOVE_ACCELERATION, -MAX_SPEED))
                  }
                >
                  Left
                </button>
                <button
                  onClick={() =>
                    setVelocityX((vx) => Math.min(vx + MOVE_ACCELERATION, MAX_SPEED))
                  }
                >
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

            <button onClick={restartGame}>Restart Level</button>

            <button onClick={handleBackToMenu}>Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;