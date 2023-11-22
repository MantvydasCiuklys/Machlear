import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [startLocation, setStartLocation] = useState("");
  const [zoom, setZoom] = useState(12); // Default zoom level
  const [endLocation, setEndLocation] = useState("");
  const [tempMarker, setTempMarker] = useState<LatLngLiteral|null>(null);
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
    const setupAutocomplete = (inputRef:any, setLocation:any) => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
      autocomplete.setFields(["address_components", "geometry", "formatted_address"]);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }
        // Update the temporary marker and zoom in on the selected place
        setTempMarker({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });

        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          setZoom(15); // Adjust zoom level as needed
        }

        // Update the location state only when a place is selected
        setLocation(place.formatted_address);
      });
    };

    setupAutocomplete(startRef, setStartLocation);
    setupAutocomplete(endRef, setEndLocation);
  }, []);

  useEffect(() => {
    if (!startLocation || !endLocation) return;
    setDirections(null);
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          // Clear the input fields after setting the directions
          setStartLocation('');
          setEndLocation('');
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  }, [startLocation, endLocation]);


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
        {tempMarker && (
          <Marker position={tempMarker} />
        )}
        {directions && (
          <DirectionsRenderer directions={directions} />
        )}
      </GoogleMap>
      <div className="map-inputs">
          <input
            ref={startRef}
            type="text"
            placeholder="Start Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
          <input
            ref={endRef}
            type="text"
            placeholder="End Location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
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