import React, { useRef, useImperativeHandle, forwardRef } from 'react';


const SoundEffect = forwardRef(({ bg }, ref) => {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // reset to start
        audioRef.current.play().catch((e) => {
          console.log('Play failed:', e);
        });
      }
    },
  }));

  return (
    <audio ref={audioRef}>
      <source src={bg} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
});

export default SoundEffect;
