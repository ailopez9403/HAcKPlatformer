import React, { useRef, useEffect, useState } from "react";
import Player from "./Player";


const PlatformerGame = ({width, height, tilesize}) => {
    
    
    const canvasRef= useRef();
    const [player, setPlayer] = useState(new Player())
    useEffect(() =>{
        console.log('Draw to canvas');
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0,0,width*tilesize,height*tilesize);
        player.draw(ctx);
    });

    return (
    <div
        style={{
        display: 'flex',
        justifyContent: 'center', //Centered canvas 
        alignItems: 'center', 
        height: '100vh', // full screen height
        backgroundColor: '#f0f0f0',
      }}
    >
        <canvas 
        ref={canvasRef}
        width={width * tilesize}
        height={height * tilesize}
        style={{border: '1px solid black'}}
        
        ></canvas>

    </div>
    );  
};


export default PlatformerGame