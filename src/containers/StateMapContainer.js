import React from 'react';
import { connect } from 'react-redux';
import MapHoverInfo from '../components/Map/MapHoverInfo';

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
          left: 30,
          top: 20,
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <MapHoverInfo />
      </div>
    )}
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapContainer);
