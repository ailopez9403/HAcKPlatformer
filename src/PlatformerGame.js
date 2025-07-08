import React, { useRef, useEffect, useState } from "react";
import Player from "./Player";

function updatePlayer(player, canvasHeight, context) {
    player.draw(context);
    player.position.y += player.velocity.y;
    player.velocity.y += player.gravity;
}

const PlatformerGame = ({ width, height }) => {
    // manually throttle game so it won't run faster than targetFPS
    let lastTime = 0;
    const targetFPS = 120;
    const frameDuration = 1000 / targetFPS;

    const canvasRef= useRef();
    const [player, setPlayer] = useState(new Player({ x: 0, y: 0 }));

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
