"use client"
import Start from "../components/home/start"
import Directions from "../components/home/directions"
import Questions from "../components/home/questions";
import MapRoute from "../components/map/mapRoute";
import {useState} from "react"
import { useLoadScript } from "@react-google-maps/api";
import CongratulationsModal from "../components/shared/CongratulationsModal"
import { start } from "repl";
interface LocationData {
  lat: number;
  lng: number;
  percentage: number;
}
export default function Home() {
  type LatLngLiteral = google.maps.LatLngLiteral;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const [context, setContext] = useState("Start");
  const [startLocation, setStartLocation] = useState<LatLngLiteral|null>(null);
  const [endLocation, setEndLocation] = useState<LatLngLiteral|null>(null);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"]
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (loadError) return <div>Error loading maps</div>;
  //return <Questions startPoint={{lat:40.748817, lng:-73.985428 }} endPoint={{lat:40.748817, lng:73.985428 }} setMainLocationData={setLocationData} setContext={setContext}></Questions>
  switch(context){
    case "Start":
      return (<Start setContext={setContext}></Start>)
    break;
    case "Directions":
      return (<Directions setContext={setContext} setStart={setStartLocation} setEnd={setEndLocation}></Directions>)
    case "Questions":
      return (<Questions startPoint={startLocation} endPoint={endLocation} setMainLocationData={setLocationData} setContext={setContext}></Questions>)
    case "Gathered":
      return (<MapRoute setContext={setContext} startLocation={startLocation} endLocation={endLocation} locationData={locationData}></MapRoute>)
    case "Congrats":
      return (<CongratulationsModal setContext={setContext}/>)
    case "Profile":
      return (<CongratulationsModal setContext={setContext}/>)
  } 
}

