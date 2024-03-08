import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const CountryLayer = () => {
  const [geoJson, setGeoJson] = useState(null);

  // Default style
  const defaultStyle = {
    weight: 2,
    color: '#000',
    dashArray: '',
    fillOpacity: 0.2,
  };

  // Function to highlight feature on mouse over
  const highlightFeature = (e) => {
    var layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  // Function to reset highlight
  const resetHighlight = (e) => {
    var layer = e.target;
    layer.setStyle(defaultStyle); // Apply default style on mouseout
  };

  // Function to attach the event handlers for each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  // Load GeoJSON data
  useEffect(() => {
    // Correct path when fetching from the public directory
    fetch('/map.geo.json') // Assuming 'public/custom.geo.json' is the correct path
      .then((response) => response.json())
      .then((data) => {
        setGeoJson(data);
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, []);

  return geoJson ? (
    <GeoJSON
      data={geoJson}
      onEachFeature={onEachFeature}
      style={defaultStyle} // Apply default style
    />
  ) : null;
};

export default CountryLayer;
