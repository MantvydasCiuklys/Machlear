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


export default function Map({
  setContext,
  setMainStart,
  setMainEnd
}:{
  setContext: Function;
  setMainStart: Function;
  setMainEnd: Function;
}) { 
  const [zoom, setZoom] = useState(14); // Default zoom level
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const [selectedStartLocation, setSelectedStartLocation] = useState<LatLngLiteral|null>(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState<LatLngLiteral|null>(null);

  const [resetAutocomplete, setResetAutocomplete] = useState(false);

  type LatLngLiteral = google.maps.LatLngLiteral;
  type DirectionsResult = google.maps.DirectionsResult;
  type MapOptions = google.maps.MapOptions;
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const center = useMemo<LatLngLiteral>(()=>({lat:54.89,lng:23.9}),[]);
  const mapRef = useRef<GoogleMap>();
  const options = useMemo<MapOptions>(
    ()=> ({
      mapId: "",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map:any) => (mapRef.current = map), []);
  useEffect(() => {
    const setupAutocomplete = (inputRef:any, setLocation:any, setLocationName: any) => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "lt" }, // Replace 'us' with your desired country code
        fields: ["address_components", "geometry", "formatted_address"],
      });


      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }

        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          setZoom(14); // Adjust zoom level as needed
        }

        // Update the location state only when a place is selected
        setLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
        setLocationName(place.formatted_address);
      });
    };

    setupAutocomplete(startRef, setSelectedStartLocation, setStartLocation);
    setupAutocomplete(endRef, setSelectedEndLocation, setEndLocation);
  }, [resetAutocomplete]);

  useEffect(() => {
    if (!startLocation || !endLocation) return;
    setDirections(null);
    const directionsService = new google.maps.DirectionsService();
    if(!selectedStartLocation && !selectedEndLocation) return;
    
    directionsService.route(
      {
        origin: selectedEndLocation == null ? "" : selectedEndLocation,
        destination: selectedStartLocation == null ? "" : selectedStartLocation,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          if(status !== google.maps.DirectionsStatus.NOT_FOUND){
            console.error(`${status} - Error fetching directions ${result}`);
          }
        }
      }
    );
  }, [selectedStartLocation, selectedEndLocation]);

  const handleStartMarkerDragEnd = (event:any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setSelectedStartLocation({ lat: newLat, lng: newLng });
  
    // Reverse geocoding to get the address from lat and lng
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
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
  };
  const handleEndMarkerDragEnd = (event:any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setSelectedEndLocation({ lat: newLat, lng: newLng });
  
    // Reverse geocoding to get the address from lat and lng
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
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
  };
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
        {selectedStartLocation && (
           <Marker 
           position={selectedStartLocation} 
           draggable={true} 
           onDragEnd={handleStartMarkerDragEnd} 
           icon={{
            url: "https://cdn-icons-png.flaticon.com/512/10124/10124107.png", // URL of the green marker icon
            scaledSize: new window.google.maps.Size(44, 44) // Adjusts the size of the icon
          }} 
           />
        )}
        {selectedEndLocation && (
          <Marker 
          position={selectedEndLocation} 
          draggable={true} 
          onDragEnd={handleEndMarkerDragEnd} 
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/11269/11269561.png", // URL of the red marker icon
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

      <div className="map-inputs">
      {directions ? 
        <div style={{width:"100%", height:"100%"}}>
          <div className="directionsConfirmButtonDiv">
            <input
                className="startLocationInput"
                ref={startRef}
                type="text"
                placeholder="Start Location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
            />
            <input
                className="endLocationInput"
                ref={endRef}
                type="text"
                placeholder="End Location"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
            /> 
          </div>
          <div className="directionsConfirmButtonDiv">
            <button className="directionsConfirmButton" onClick={() => {
              setContext("Questions");
              setMainStart(selectedStartLocation);
              setMainEnd(selectedEndLocation)
              }}>
              <FontAwesomeIcon icon={faCheckCircle} className="icons" style={{ color: 'green'}} />
            </button>
            <button className="directionsConfirmButton" onClick={() => {
              setSelectedEndLocation(null);
              setSelectedStartLocation(null);
              setStartLocation('');
              setEndLocation('');
              setDirections(null);
              setResetAutocomplete(prev => !prev); // Toggle the flag
            }}>
              <FontAwesomeIcon icon={faTimesCircle} className="icons" style={{ color: 'red' }} />
            </button>
          </div>
        </div>
      :
      <div className="directionsConfirmButtonDiv">
        <input
            className="startLocationInput"
            ref={startRef}
            type="text"
            placeholder="Start Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
        />
        <input
            className="endLocationInput"
            ref={endRef}
            type="text"
            placeholder="End Location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
        /> 
      </div>
      }
      </div>
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
  const closeOptions = {
    ...defaultOptions,
    zIndex: 3,
    fillOpacity: 0.05,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
  };
  const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.05,
    strokeColor: "#FBC02D",
    fillColor: "#FBC02D",
  };
  const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.05,
    strokeColor: "#FF5252",
    fillColor: "#FF5252",
  };