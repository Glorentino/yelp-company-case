import { useState, useMemo, useCallback, useRef } from "react";
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    MarkerClusterer, 
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import CurrentLocation from "./currentLocation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type LatLngLiteral = google.maps.LatLngAltitude;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
export type MarkerType = {
    id: string;
    location: google.maps.LatLngLiteral;
    name: string;
    phone_number: string;
    website: string;
  };

export default function Map(){
    const [office, setOffice] = useState<LatLngLiteral>();
    const [directions, setDirections] = useState <DirectionsResult>()
    const mapRef = useRef <GoogleMap>();
    const center = useMemo<LatLngLiteral>(() => ({lat: 40.84, lng: -73.938}), []);
    const options = useMemo<MapOptions>(
        () => ({
            mapId: "61229bfc4c9c8089",
            disableDefaultUI: true,
            clickableIcon: false,
    }), 
    []
    );
    const onLoad = useCallback(map => (mapRef.current = map), []);
    const houses = useMemo(() => generateHouses(center), [center]);

    const [clickedPos, setClickedPos] = useState<google.maps.LatLngLiteral>({} as google.maps.LatLngLiteral);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType>({} as MarkerType);
    

    const notify = () => {

                toast('This business is local to your area!');

    };


    const onMapClick = (e: google.maps.MapMouseEvent) => {
        const x = 40.83;
        const x2 = 40.85;
        const y = -73.95;
        const y2 = -73.92;
        setClickedPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        
       
        setSelectedMarker({} as MarkerType);
        if ( clickedPos.lat > x &&  clickedPos.lat < x2){
            if (clickedPos.lng > y && clickedPos.lng < y2){
                notify();
            }};
      };
    
    const onMarkerClick = (marker: MarkerType) => setSelectedMarker(marker);

    const moveTo = (position: LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: position.lat, lng: position.lng });
      mapRef.current.setZoom(15);
      setClickedPos(position);
      
    }
  };


    const fetchDirections = (house: LatLngLiteral) => {
        if (!office) return;
        const x = 40.83;
        const x2 = 40.85;
        const y = -73.95;
        const y2 = -73.92;
        if ( house.lat > x &&  house.lat < x2){
            if (house.lng > y && house.lng < y2){
                notify();
            }};
        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: office,
                destination: house,
                travelMode: google.maps.TravelMode.DRIVING
            },
            
            ( result, status ) => {
                if ( status === "OK" && result) {
                    setDirections(result);
                }
            }
            
        );

    }; 

    return (
    <div className="container">
        <div className="controls">
            <h1>Search</h1>
            <Places 
                setOffice={(position) => {
                    setOffice(position);
                    mapRef.current?.panTo(position);
                }}
            />
            {!office && <p>Enter your home address.</p>}
            {directions && <Distance leg={directions.routes[0].legs[0]} />}
        </div>
        <div className="map">
        

            <GoogleMap 
            zoom={14} 
            center={center} 
            mapContainerClassName = "map-container" 
            options={options}
            onLoad={onLoad}
            onClick={onMapClick}
            > 
            <CurrentLocation moveTo={moveTo} />
            {clickedPos.lat ? <Marker position={clickedPos} /> : null}
                <ToastContainer/>
                { directions && (<DirectionsRenderer
                    directions={directions} 
                    options={{
                        polylineOptions: {
                            zIndex: 50,
                            strokeColor: "#1976D2",
                            strokeWeight: 5,    
                    
                        },
                        
                    }}
                    
                />

            )}

            
            { office && (
                <>
                <Marker 
                position={office}/>
                <MarkerClusterer >
                    { ( clusterer ) => 
                    houses.map((house) => (
                        <Marker 
                        key={house.lat} 
                        position={house} 
                        clusterer={clusterer}
                        onClick={() => {fetchDirections(house)
                    }}
                        />
                    ))
                }
                </MarkerClusterer>
                
                <Circle center={office} radius={1000} options={closeOptions}/>
                <Circle center={office} radius={1500} options={middleOptions}/>
                <Circle center={office} radius={2000} options={farOptions}/>
                </>
                )}
            </GoogleMap>
        </div>
    </div>
    );
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

const generateHouses = (position: LatLngLiteral) => {
    const _houses: Array<LatLngLiteral> = [];
    for (let i = 0; i < 50; i++) {
        const direction = Math.random() < 25 ? -20 : 20;
        _houses.push({
            lat: position.lat + Math.random() / direction,
            lng: position.lng + Math.random() / direction,
        });
    }
    
    return _houses;
    
};


