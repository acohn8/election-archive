import React from 'react';
import { connect } from 'react-redux';

import MapInfo from './mapInfo';
import StateMap from './StateMap';
import NewMapComponent from './NewMapComponent';

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
          left: 20,
          top: 20,
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <MapInfo />
      </div>
    )}
    <NewMapComponent minHeight={368} zoomThreshold={2} />
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapContainer);
