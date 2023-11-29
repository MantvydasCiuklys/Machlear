import { ReactNode } from "react";
import Card from "@/components/home/card";
import Map from "@/components/map/map";
export default function Main() {
  return (
    <>        
    <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
      <Card
        demo={<Map></Map>}
      ></Card>
    </div>
  </>
  );
}
