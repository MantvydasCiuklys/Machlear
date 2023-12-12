import { ReactNode, useState, useEffect } from "react";
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Card from "@/components/home/card";
import Button from "@/components/shared/button";
import { start } from "repl";
import StreetView from "../map/streetview";
import path from "path";
type LatLngLiteral = google.maps.LatLngLiteral;
interface LocationData {
    lat: number;
    lng: number;
    percentage: number;
  }

  function getPathPoints(startPoint:any, endPoint:any) {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startPoint,
          destination: endPoint,
          travelMode: google.maps.TravelMode.DRIVING // or WALKING, BICYCLING, TRANSIT
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const pathPoints = result.routes[0].overview_path;
            resolve(pathPoints);
          } else {
            reject('Directions request failed due to ' + status);
          }
        }
      );
    });
  }

  function getRandomPointNearPath(pathPoints:any, minRadius:any, maxRadius:any, usedIndices:any) {
    let randomIndex;
    let attempts = 0;
    do {
      randomIndex = Math.floor(Math.random() * pathPoints.length);
      attempts++;
      // If all points have been tried, break to avoid infinite loop
      if (attempts > pathPoints.length) {
        console.error("No more unique points available");
        return null;
      }
    } while (usedIndices.includes(randomIndex));
  
    usedIndices.push(randomIndex); // Add the index to the list of used indices
  
    const center = pathPoints[randomIndex];
    return getRandomLocation(center, minRadius, maxRadius);
  }
  
  function getRandomLocation(center:any, minRadius:any, maxRadius:any) {
    const y0 = center.lat();
    const x0 = center.lng();

    // Convert radii from meters to degrees
    const minRd = minRadius / 111300; // about 111300 meters in one degree
    const maxRd = maxRadius / 111300;

    let w;
    let u, v;
    do {
        u = Math.random();
        v = Math.random();

        w = minRd + (maxRd - minRd) * Math.sqrt(u);
    } while (w > maxRd); 

    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    const xp = x / Math.cos(y0);

    const newlat = y + y0;
    const newlon = xp + x0;

    return { lat: newlat, lng: newlon };
}

export default function Questions({
    startPoint,
    endPoint,
    setMainLocationData,
    setContext
  }: {
    startPoint: LatLngLiteral | null;
    endPoint: LatLngLiteral | null;
    setMainLocationData: Function;
    setContext: Function;
  }) {

    const [usedIndices, setUsedIndices] = useState<any>([]);
    const [pathPoints, setPathPoints] = useState([]);
    const [locationData, setLocationData] = useState<LocationData[]>([]);
    const [currentLocation, setCurrentLocation] = useState<LatLngLiteral|null>(null);
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [sliderValue, setSliderValue] = useState(0); // Slider state
    const minRadius = 20; 
    const maxRadius = 200; 
    const totalLocations = 4; // total random locations to generate
    const progress = (locationData.length / totalLocations) * 100;

    const handleSliderChange = (event:any) => {
        setSliderValue(event.target.value);
      };
    
      useEffect(() => {
        if (startPoint && endPoint) {
          getPathPoints(startPoint, endPoint).then((pathPoints:any) => {
            setPathPoints(pathPoints);
          }).catch(error => console.error(error));
        }
      }, [startPoint, endPoint]);

    const handleConfirm = () => {
        if (locationData.length < totalLocations - 1) {
          // Save current data and generate next location
          if(currentLocation)
          setLocationData([...locationData, { ...currentLocation, percentage: sliderValue }]);
          const nextLocation = getRandomPointNearPath(pathPoints, minRadius,maxRadius, usedIndices);
          setCurrentLocation(nextLocation);
        } else {
          // Last location - show completion alert and save data
          if(currentLocation)
            setLocationData([...locationData, { ...currentLocation, percentage: sliderValue }]);
            console.log(locationData);
            setMainLocationData([...locationData, { ...currentLocation, percentage: sliderValue }]);
            setContext("Gathered");
        }
        setSliderValue(0)
      };


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
    {
        currentLocation ?
        <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            <div className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md`}>
            <div className="flex items-center justify-center" style={{ height: "5vh" }}>
                <div onClick={handleConfirm} className="flex items-center justify-center bg-green-500 rounded text-white" style={{marginLeft:"1%", width: "18%",marginTop:"2.5%", height:"140%", cursor: "pointer" }}>
                    Confirm
                </div>
                <div style={{width: "100%", height: "5vh"}} className="flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="slider"
                        style={{width: "calc(100% - 2rem)",height:"200%", margin: "0 1rem"}} // Adjusts width and margin
                    />
                </div>
                <div className="progress-circle-container" style={{ width: '18%', marginLeft: '1%', marginTop: '2.5%', height: '140%' }}>
                    <svg className="progress-circle" viewBox="0 0 36 36">
                        <path className="circle-bg"
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                            strokeDasharray={`${progress} 100`}
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">{progress.toFixed(0)}%</text>
                    </svg>
                </div>
            </div>
                <div style={{textAlign: "center", marginLeft:"12%",marginTop: "10px"}}> {/* Centers the text */}
                    <p>Slider Value: {sliderValue}%</p>
                </div>
            </div>
            <div className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mainButtonExpress`}>    
                    <StreetView latitude={currentLocation.lat} longitude={currentLocation.lng} />                  
            </div>
        </div>
        :
        <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            <div className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mainButtonExpress`}>   
                <div onClick={handleConfirm} className="flex items-center justify-center bg-green-500 rounded text-white" style={{width: "100%", height:"100%", cursor: "pointer" }}>
                    We will ask you to rate some pictures, click here to continue
                </div>
            </div>
        </div>
    }
    </>
    );
}
