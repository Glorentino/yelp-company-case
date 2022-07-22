import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Map from "../components/map";

export default function Home() {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: "AIzaSyBu5Iv5mr7omeGDWxIPRaFlFTzogwzNCfE", //
        libraries: [ "places" ],
    }); //process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!isLoaded) return <div>Loading...</div>;
    return <Map />;
}