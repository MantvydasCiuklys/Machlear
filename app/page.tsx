"use client"
import Start from "../components/home/start"
import Directions from "../components/home/directions"
import Questions from "../components/home/questions";
import {useState} from "react"
import { useLoadScript } from "@react-google-maps/api";
import { start } from "repl";

export default function Home() {
  type LatLngLiteral = google.maps.LatLngLiteral;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const [context, setContext] = useState("Start");
  const [startLocation, setStartLocation] = useState<LatLngLiteral|null>(null);
  const [endLocation, setEndLocation] = useState<LatLngLiteral|null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"]
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (loadError) return <div>Error loading maps</div>;

  switch(context){
    case "Start":
      return (<Start setContext={setContext}></Start>)
    break;
    case "Directions":
      return (<Directions setContext={setContext} setStart={setStartLocation} setEnd={setEndLocation}></Directions>)
    case "Questions":
      return <Questions startPoint={startLocation} endPoint={endLocation}></Questions>
  }
}

