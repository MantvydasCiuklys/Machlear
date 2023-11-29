'use client';
import { useEffect } from 'react';

export default function Button() {
 
  const startButtonClicked = () => {
    document.location.href = document.location.href + "/startingpoint";

  };

  return (
    <button onClick={startButtonClicked}>Start</button>
  );
}
