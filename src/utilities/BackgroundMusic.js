import React, { useEffect, useRef } from 'react';

function BackgroundMusic({bg}) {
    const audioRef = useRef(null);
    

  useEffect(() => {
    // Auto-play when the component mounts
    if (audioRef.current) {
        audioRef.current.volume = 0.30; // Set volume
        audioRef.current.muted = false;

        audioRef.current.play().catch((e) => {
        console.log('Autoplay failed:', e);
      });
    }
  }, [bg]);

  return (
    <audio ref={audioRef} loop autoPlay>
      <source src={bg} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}

export default BackgroundMusic;