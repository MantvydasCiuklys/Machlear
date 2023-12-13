import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "@react-google-maps/api";

interface LocationData {
    lat: number;
    lng: number;
    percentage: number;
}
    type LatLngLiteral = google.maps.LatLngLiteral;
    type DirectionsResult = google.maps.DirectionsResult;
    type MapOptions = google.maps.MapOptions;

export default function MapRoute({
  setContext,
  locationData,
  startLocation,
  endLocation
}:{
  setContext: Function;
  locationData:LocationData[];
  startLocation:LatLngLiteral|null;
  endLocation:LatLngLiteral|null;
}) { 
 
  const [zoom, setZoom] = useState(14); // Default zoom level
  const center = useMemo<LatLngLiteral>(()=>({lat:54.89,lng:23.9}),[]);
  const [directions, setDirections] = useState<DirectionsResult|null>(null);
  const [currentStep, setCurrentStep] = useState(0); // Current step in the directions
  const [currentPosition, setCurrentPosition] = useState<LatLngLiteral|null>(null); // Current position of the trip
  const stepsRef = useRef<google.maps.DirectionsStep[]>([]); // To store the route steps
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // To store the interval ID
  const frames:number = 20; // Number of frames in the animation
  const options = useMemo<MapOptions>(
    ()=> ({
      mapId: "",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );  
  const mapRef = useRef<GoogleMap>();
  const onLoad = useCallback((map:any) => (mapRef.current = map), []);

  const calculateDistance = (start:any, end:any) => {
    // Haversine formula or similar to calculate the distance
    // This is a simplified version and may not be perfectly accurate
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = 
      0.5 - Math.cos(dLat)/2 + 
      Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) * 
      (1 - Math.cos(dLon))/2;
  
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const animateMarker = (startPos:any, endPos:any, distance:any, onComplete:any) => {
    const frames = 60; // Number of frames in the animation
    const durationPerKm = 1000; // Duration per km in milliseconds
    const duration = distance * durationPerKm; // Duration based on distance
    const interval = duration / frames;
    let frame = 0;
  
    const deltaLat = (endPos.lat - startPos.lat) / frames;
    const deltaLng = (endPos.lng - startPos.lng) / frames;
  
    const animateStep = () => {
      if (frame < frames) {
        setCurrentPosition({
          lat: startPos.lat + deltaLat * frame,
          lng: startPos.lng + deltaLng * frame,
        });
        frame++;
        setTimeout(animateStep, interval);
      } else {
        // When animation of the step is complete
        onComplete();
      }
    };
  
    animateStep();
  };
  
  const startAnimation = (legs:any, legIndex = 0, stepIndex = 0) => {
    if (legIndex < legs.length) {
      const steps = legs[legIndex].steps;
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        const distance = calculateDistance(
            step.start_location.toJSON(),
            step.end_location.toJSON()
          );
        animateMarker(
          step.start_location.toJSON(),
          step.end_location.toJSON(),
          distance, // Duration for each step's animation
          () => {
            // Proceed to the next step or leg
            if (stepIndex < steps.length - 1) {
              startAnimation(legs, legIndex, stepIndex + 1);
            } else if (legIndex < legs.length - 1) {
              startAnimation(legs, legIndex + 1, 0);
            } else {
              onTripFinish();
            }
          }
        );
      }
    }
  };

  const onTripFinish = () => {
    updateUserWallet();
    setContext("Congrats"); // Show the modal when the trip finishes
  };

  const updateUserWallet = async () => {
    const response = await fetch('/api/wallet/get');
          if (response.ok) {
            const data = await response.json();
            if(data.id){
              const userId = data.id
              const increaseAmount = 1;
            
              try {
                if(data.UserWallet){
                  const currentWalletData = data.UserWallet
                  
                  if(directions){

                    let aggregatedKM = 0;
                    directions.routes[0].legs.forEach(leg => {
                      if(leg.distance){
                        aggregatedKM += leg.distance.value
                      }
                    });

                    const updatedCo2Saved = currentWalletData.co2Saved + (aggregatedKM/1000 * 192);
                    const updatedBalance = currentWalletData.balance + (aggregatedKM/1000);
              
                    await fetch('/api/wallet/update', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ walletId:currentWalletData.id, co2Saved: updatedCo2Saved, balance: updatedBalance }),
                    });
                    
                    document.dispatchEvent(new CustomEvent('walletUpdated'));
                  }

                  
                }
              } catch (error) {
                // Handle errors for updating wallet
              }
            }
            
          } else {
            // Handle errors
          }
  };

  const simulateTrip = useCallback(() => {
    if (directions) {
      const legs = directions.routes[0].legs;
      startAnimation(legs);
    }
  }, [directions]);

  const fetchDirections = useCallback(() => {
    const DirectionsService = new google.maps.DirectionsService();

    // Create waypoints from locationData
    const waypoints = locationData.map(location => ({
      location: new google.maps.LatLng(location.lat, location.lng),
      stopover: true
    }));

    if(startLocation && endLocation) {
      DirectionsService.route({
        origin: startLocation,
        destination: endLocation,
        optimizeWaypoints:true,
        waypoints: waypoints, // Include waypoints in the route
        travelMode: google.maps.TravelMode.WALKING, // or any other mode
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result); // Assuming you have a state to store this
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }, [startLocation, endLocation, locationData]);


  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);


  return (
  <>
   <div className="my-4 grid w-full h-full max-h-screen-xl max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            <div className={`relative col-span-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md mainButtonExpress`}>   
                <div onClick={simulateTrip} className="flex items-center justify-center bg-green-500 rounded text-white" style={{width: "100%", height:"100%", cursor: "pointer" }}>
                    Simulate Trip
                </div>
            </div>
        </div>
    <div className="container">
        <div className="map">
        <GoogleMap
            zoom={zoom}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
        >
            {startLocation && (
            <Marker 
            position={startLocation} 
            draggable={false} 
            icon={{
                url: "/a.png", // URL of the green marker icon
                scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
            }} 
            />
            )}
            {endLocation && (
            <Marker 
            position={endLocation} 
            draggable={false} 
            icon={{
                url:"/b.png",
            // url: "https://cdn-icons-png.flaticon.com/512/11269/11269561.png", // URL of the red marker icon
                scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
            }} 
            />
            )}
            {locationData.map((location, index) => (
                <Marker
                key={index} // Unique key for each marker
                position={{ lat: location.lat, lng: location.lng }}
                draggable={false}  
                icon={{ 
                    url: "/info.png", // URL of the green marker icon
                    scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
                }} 
                />
            ))}
            {currentPosition && (
                <Marker
                position={currentPosition}
                draggable={false}  
                icon={{
                    url:"/riding.png",
                    scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
                }} 
                />
            )}
            {directions && (
            <DirectionsRenderer 
                directions={directions} 
                options={{ suppressMarkers: true }} 
            />
            )}
        </GoogleMap>

        
        </div>
    </div>
  </>
  )
}


const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
  };
