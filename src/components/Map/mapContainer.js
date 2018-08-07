import React from 'react';

import Map from './StateMap';
import MapInfo from './mapInfo';

const MapContainer = () => (
  <div>
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'white',
        opacity: '0.8',
        padding: '10px',
        margin: 'auto',
        right: 30,
        top: 50,
        borderColor: 'gray',
        borderStyle: 'solid',
        borderWidth: '0.5px',
      }}
    >
      <MapInfo />
    </div>
    <Map />
  </div>
);

export default MapContainer;
