import { ReactNode } from "react";
import Card from "@/components/home/card";
import Map from "@/components/map/map";
export default function Main({
  setContext,
  setStart,
  setEnd
}:{
  setContext: Function;
  setStart: Function;
  setEnd: Function;
})
{
  return (
      
    <div className="my-1 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-1 xl:px-0">
      <Map setContext={setContext} setMainStart={setStart} setMainEnd={setEnd}></Map>
    </div>
  );
}
