import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const CountryLayer = () => {
  const [geoJson, setGeoJson] = useState(null);
  const map = useMap();

  useEffect(() => {
    const legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const populations = [0, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
        const labels = ['<strong>Population</strong>'];
    
        // Generate a label with a colored square for each interval
        populations.forEach((value, index) => {
            labels.push(
                '<i style="background:' + getColor(value + 1) + '"></i> ' +
                (value.toLocaleString()) + (populations[index + 1] ? '&ndash;' + populations[index + 1].toLocaleString() + '<br>' : '+'));
        });
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
  
    legend.addTo(map);
  
    // Cleanup function to remove legend when component unmounts
    return () => legend.remove();
  }, [map]); // Ensure this effect runs when the map instance changes

  // Default style
  const defaultStyle = {
    weight: 2,
    color: '#000',
    dashArray: '',
    fillOpacity: 0.2,
  };

  // Function to get country Color
  function getColor(population) {
    return population > 100000000 ? '#800026' :
           population > 50000000  ? '#BD0026' :
           population > 20000000  ? '#E31A1C' :
           population > 10000000  ? '#FC4E2A' :
           population > 5000000   ? '#FD8D3C' :
           population > 2000000   ? '#FEB24C' :
           population > 1000000   ? '#FED976' :
                                    '#FFEDA0';
  }

  //Color Scale Style
  const geoJsonStyle = (feature) => ({
    fillColor: getColor(parseInt(feature.properties.pop_est)),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  // Function to highlight feature on mouse over
  const highlightFeature = (e) => {
    var layer = e.target;
    layer.setStyle({
      dashArray: '',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  // Function to reset highlight
  const resetHighlight = (e) => {
    var layer = e.target;
    layer.setStyle(geoJsonStyle); // Apply color style on mouseout
  };

  const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Function to attach the event handlers for each feature
  const onEachFeature = (feature, layer) => {
    const countryName = feature.properties.name;
    layer.on({
        mouseover: (e) => {
          highlightFeature(e);
          var popup = L.popup()
            .setLatLng(e.latlng) 
            .setContent(countryName)
            .openOn(map);
        },
        mouseout: (e) => {
          resetHighlight(e);
          //map.closePopup(); // Close the popup when the mouse leaves
        },
        click: (e) => {
          
          const population = parseInt(feature.properties.pop_est, 10);
          // Format the population number with commas for readability
          const formattedPopulation = formatNumber(population);
          const popupContent = `
        <div>
          <h2>${feature.properties.name}</h2>
          <p><strong>Population:</strong> ${formattedPopulation} People</p>
          <p><strong>Continent:</strong> ${feature.properties.continent}</p>
        </div>
      `;

      var infoPopup = L.popup()
        .setLatLng(e.latlng) // Set the popup at the clicked location
        .setContent(popupContent) // Set the HTML content
        .openOn(map);
        }
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
      style={geoJsonStyle} // Apply color style
    />
  ) : null;
};

export default CountryLayer;
