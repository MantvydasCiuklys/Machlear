import { ReactNode, useState } from "react";
import Card from "@/components/home/card";
import Button from "@/components/shared/button";
import { start } from "repl";
type LatLngLiteral = google.maps.LatLngLiteral;
export default function Questions({
    startPoint,
    endPoint
  }: {
    startPoint: LatLngLiteral | null;
    endPoint: LatLngLiteral | null;
  }) {

    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");

    if(startPoint && endPoint){
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: startPoint.lat, lng: startPoint.lng } }, (results, status) => {
            if (status === "OK") {
            if (results && results[0]) {
                setStartLocation(results[0].formatted_address);
            } else {
                console.log('No results found');
            }
            } else {
            console.log('Geocoder failed due to: ' + status);
            }
        });
    
        geocoder.geocode({ location: { lat: endPoint.lat, lng: endPoint.lng } }, (results, status) => {
            if (status === "OK") {
            if (results && results[0]) {
                setEndLocation(results[0].formatted_address);
            } else {
                console.log('No results found');
            }
            } else {
            console.log('Geocoder failed due to: ' + status);
            }
        });
    }
    
    return (
        <>
        <div className="z-14 w-full max-w-xl px-0 xl:px-0">
        <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
            {startLocation}
        </h1>
        <br></br>
        <br></br>
        <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
            {endLocation}
        </h1>
        </div>
    </>
    );
}
