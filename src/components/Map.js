import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CountryLayer from './CountryLayer'; // Adjust the import path as necessary

const Map = () => {
  // Define the geographical bounds for the map
  const bounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
  ];

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: "100vh", width: "100%" }}
      maxBounds={[[ -90, -180], [90, 180]]}
      minZoom={2} // Adjust minimum zoom level as needed
      maxBoundsViscosity={1.0} // Makes the bounds fully solid, preventing the user from dragging outside
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CountryLayer />
    </MapContainer>
  );
};

export default Map;
