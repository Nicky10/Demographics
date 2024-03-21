import React from 'react';
import { useState } from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  const [selectedDemographic, setSelectedDemographic] = useState('population_2018'); // Default selection
  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
