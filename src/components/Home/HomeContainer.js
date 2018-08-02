import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import StateDropdown from '../StateDropdown';

const HomeContainer = props => (
  <div>
    {!props.headerHid && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 60,
          top: 72,
          width: 250,
          backgroundColor: 'white',
          padding: '20px',
          opacity: '0.8',
        }}
      >
        <Header as="h1">
          President: 2016
          <Header.Subheader>Select a state or zoom in</Header.Subheader>
        </Header>
      </div>
    )}
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        right: 60,
        top: 72,
        width: 250,
      }}
    >
      <StateDropdown />
    </div>
    <MapInfo />
    <NationalMap />
  </div>
);

const mapStateToProps = state => ({
  headerHid: state.maps.headerHid,
});

export default connect(mapStateToProps)(HomeContainer);
