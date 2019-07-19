import React, { useState } from 'react';
import './App.scss';
import LMap from './map/LMap.js'; 



function App() {

  const [markerPosition, setMarkerPosition] = useState({
    lat:51.047811, 
        lng: 13.565813
  });
  const { lat, lng } = markerPosition;

  function moveMarker() {
    setMarkerPosition({
      lat: lat + 0.0101,
      lng: lng + 0.0101
    });
  }


  

  return (
    
    <React.Fragment>
    <h1>Headline App</h1>
    <LMap/>
    <button onClick={moveMarker}>Move marker</button>
    </React.Fragment>
  );
}

export default App;
