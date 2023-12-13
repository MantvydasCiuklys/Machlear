import React, { useEffect, useRef } from 'react'; 
import confetti from 'canvas-confetti';

export default function CongratulationsModal({
  setContext,
}: {
  setContext: Function;
}) {

    const refCanvas = useRef<HTMLCanvasElement>(null);

    const ExpressStartClicked = ()=>{
        setContext('Directions');
    }
    useEffect(() => {
      const canvas = refCanvas.current;
      if(canvas){
        const myConfetti = confetti.create(canvas, {
          resize: true,
        });
        myConfetti({
          particleCount: 2000,
          spread: 220,
          shapes: ['circle', 'circle', 'square']
          // Any other options
        });
        return () => myConfetti.reset();
      }

    }, []);
    return (

        <>
        
        <div className="congratulations-modal">
        <canvas ref={refCanvas} className="fireworks-canvas"></canvas>
        </div>
        <div className="z-14 w-full max-w-xl px-0 xl:px-0">
        <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
            CIDM Challenge Task
        </h1>
        </div>
        <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <div
        className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mainButtonExpress`}
        >
            <div style={{width:"100%", height:"5vh"}} className="flex items-center justify-center" onClick={()=>{ExpressStartClicked()}}>Express Start</div>
        </div>    
        <div
        className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mainButtonProfile`}
        >
            <div style={{width:"100%", height:"5vh"}} className="flex items-center justify-center" onClick={()=>{ExpressStartClicked()}}>Create Profile</div>
        </div>
        </div>
      </>
    );
};
