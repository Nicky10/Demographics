import React, { useEffect, useState, useRef  } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const CountryLayer = ({ selectedYear }) => {
  const geoJsonLayerRef = useRef(null);
  const [geoJson, setGeoJson] = useState(null);
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const populations = [0, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
      const labels = ['<strong>Population</strong>'];

      populations.forEach((value, index) => {
        labels.push(
          `<i style="background:${getColor(value + 1)}"></i> ` +
          `${value.toLocaleString()}${populations[index + 1] ? '&ndash;' + populations[index + 1].toLocaleString() + '<br>' : '+'}`
        );
      });

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);

    return () => legend.remove();
  }, [map]);

  function getColor(population) {
    return population > 100000000 ? '#800026' :
      population > 50000000 ? '#BD0026' :
      population > 20000000 ? '#E31A1C' :
      population > 10000000 ? '#FC4E2A' :
      population > 5000000 ? '#FD8D3C' :
      population > 2000000 ? '#FEB24C' :
      population > 1000000 ? '#FED976' :
      '#FFEDA0';
  }

  const geoJsonStyle = (feature) => {
    const yearPop = feature.properties[`population_${selectedYear}`];
    const population = yearPop ? parseInt(yearPop, 10) : parseInt(feature.properties.pop_est, 10);

    return {
      fillColor: getColor(population),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

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

  const resetHighlight = (e) => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.resetStyle(e.target);
    }
  };

  const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: (e) => {
        const yearPop = feature.properties[`population_${selectedYear}`];
        const population = yearPop ? parseInt(yearPop, 10) : parseInt(feature.properties.pop_est, 10);
        const formattedPopulation = formatNumber(population);

        const popupContent = `
          <div>
            <h2>${feature.properties.name}</h2>
            <p><strong>Population:</strong> ${formattedPopulation} People</p>
            <p><strong>Continent:</strong> ${feature.properties.continent}</p>
          </div>
        `;

        var infoPopup = L.popup()
          .setLatLng(e.latlng)
          .setContent(popupContent)
          .openOn(map);
      }
    });
  };

  useEffect(() => {
    // Fetch the GeoJSON data based on the selectedYear
    fetch('/updated_map.geo.json') // Ensure this path correctly points to your GeoJSON file
      .then((response) => response.json())
      .then((data) => {
        // Once the data is loaded, check if there's an existing GeoJSON layer and clear it
        if (geoJsonLayerRef.current) {
          map.removeLayer(geoJsonLayerRef.current); // Remove the existing layer from the map
        }
        
        // Create a new GeoJSON layer with the loaded data
        const newGeoJsonLayer = L.geoJson(data, {
          style: geoJsonStyle, // Apply styles based on the selected year's population data
          onEachFeature: onEachFeature, // Attach the event handlers for each feature
        });
  
        // Add the new GeoJSON layer to the map
        newGeoJsonLayer.addTo(map);
        geoJsonLayerRef.current = newGeoJsonLayer; // Update the ref to point to the new layer
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, [selectedYear, map]);
  return null;
};

export default CountryLayer;
