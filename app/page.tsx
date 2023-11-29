"use client"
import Start from "../components/home/start"
import Questions from "../components/home/questions"
import {useState} from "react"
import { useLoadScript } from "@react-google-maps/api";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const [context, setContext] = useState("Start");
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
    case "Questions":
      return (<Questions></Questions>)
  }
}

