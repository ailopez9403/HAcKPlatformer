import React, { useRef, useEffect } from "react";


const PlatformerGame = ({width, height, tilesize}) => { 
    
    
    const canvasRef= useRef();
    useEffect(() =>{
        console.log('Draw to canvas');
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0,0,width*tilesize,height*tilesize);
       
    });

    return (
    <canvas 
        ref={canvasRef}
        width={width * tilesize}
        height={height * tilesize}
        style={{border: '1px solid black'}}
        
    ></canvas>
    );  
};


export default PlatformerGame