import { ReactNode } from "react";
import Card from "@/components/home/card";
import Map from "@/components/map/map";
export default function Main() {
  return (
    <>
    <div className="z-14 w-full max-w-xl px-0 xl:px-0">
        <h3
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-1xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-2xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
        Choose a starting location
        </h3>
    </div>
    <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
      <Card
        demo={<Map></Map>}
      ></Card>
    </div>
  </>
  );
}
