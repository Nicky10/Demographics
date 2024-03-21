import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CountryLayer from './CountryLayer'; 

const Map = () => {
  const [selectedYear, setSelectedYear] = useState('2021'); // Default selected year

  return (
    <div>
      <h3>Select Year:</h3>
      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        {/* Add more years or other demographic data options as needed */}
      </select>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: "100vh", width: "100%" }}
        maxBounds={[[ -90, -180], [90, 180]]}
        minZoom={2}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CountryLayer selectedYear={selectedYear} />
      </MapContainer>
    </div>
  );
};

export default Map;
