import React, { useRef, useEffect, useState } from "react";
import Player from "./Player";
import InputManager from "./InputManager";

function updatePlayer(player, canvasHeight, context) {
    player.draw(context);

    player.position.y += player.velocity.y;
    player.position.x += player.velocity.x;

    if (player.position.y + player.height + player.velocity.y < canvasHeight) {
        player.velocity.y += player.gravity;
    } else {
        player.velocity.y = 0;
    }
}

const PlatformerGame = ({ width, height }) => {
    // manually throttle game so it won't run faster than targetFPS
    let lastTime = 0;
    const targetFPS = 120;
    const frameDuration = 1000 / targetFPS;

    const canvasRef= useRef();
    const [player, setPlayer] = useState(new Player({ x: 0, y: 0 }));

    let inputManager = new InputManager();
    const movePlayer = (action) => {
        switch (action) {
            case 'moveLeft':
                player.moveLeft();
                break;
            case 'moveRight':
                player.moveRight();
                break;
            case 'jump':
                player.jump();
                break;
            case 'stopLeft':
                player.stopLeft();
                break;
            case 'stopRight':
                player.stopRight();
                break;
            default:
                break;
        }
    };

    useEffect(() =>{
        console.log('Bind input');
        inputManager.bindKeys();
        inputManager.subscribe(movePlayer); 

        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(movePlayer);
        }
    });

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        console.log('Draw to canvas');
        ctx.clearRect(0, 0, width, height);
 
        function loop(currentTime) {
            requestAnimationFrame(loop);

            if (currentTime - lastTime < frameDuration) return;
            lastTime = currentTime;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            updatePlayer(player, height, ctx);
        }

        loop();
    });

    return (
        <div
            style = {{
                display: 'flex',
                justifyContent: 'center', // centered canvas 
                alignItems: 'center', 
                height: '100vh', // full screen height
                backgroundColor: '#f0f0f0',
        }}
        >

            <canvas 
                ref={ canvasRef }
                width={ width }
                height={ height }
                style={{ border: '1px solid black' }}
            ></canvas>

        </div>
    );  
};

export default PlatformerGame
