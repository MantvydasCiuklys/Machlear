import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer
} from "@react-google-maps/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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
            url: "https://cdn-icons-png.flaticon.com/512/10124/10124107.png", // URL of the green marker icon
            scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
          }} 
           />
        )}
        {endLocation && (
          <Marker 
          position={endLocation} 
          draggable={false} 
          icon={{
            url:"/location.png",
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
                url: "https://cdn-icons-png.flaticon.com/512/10124/10124107.png", // URL of the green marker icon
                scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
              }} 
            />
          ))}

        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{ suppressMarkers: true }} 
          />
        )}
      </GoogleMap>

      
    </div>
  </div>
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
