import React from 'react';
import { connect } from 'react-redux';

import Map from './StateMap';
import MapInfo from './mapInfo';
import StateMapTest from './StateMapTest';

const MapContainer = props => (
  <div>
    {props.overlay.hoveredDem.votes !== '' && (
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
    )}
    <StateMapTest />
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapContainer);
