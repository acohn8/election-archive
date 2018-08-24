import React from 'react';
import { connect } from 'react-redux';

import MapInfo from './mapInfo';
import StateMap from './StateMap';

const MapContainer = props => (
  <div>
    {props.overlay.hoveredWinner.votes !== '' && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: 'white',
          opacity: '0.8',
          padding: '10px',
          margin: 'auto',
          right: 70,
          top: 10,
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <MapInfo />
      </div>
    )}
    <StateMap />
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapContainer);
