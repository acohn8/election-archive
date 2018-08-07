import React from 'react';
import { Header, Breadcrumb, Responsive, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import StateDropdown from '../StateDropdown';

const NationalMapContainer = props => (
  <div>
    {!props.headerHid && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 30,
          'border-radius': '25px',
          top: 8,
          width: 270,
          backgroundColor: 'white',
          padding: '20px',
          opacity: '0.8',
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/">
            Home
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>National Map</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h2">
          President: 2016
          <Header.Subheader>
            Zoom in to see counties or out to see states. Click for details.
          </Header.Subheader>
        </Header>
        <StateDropdown />
      </div>
    )}
    {props.overlay.hoveredDem.votes !== '' && (
      <Responsive
        as="div"
        {...Responsive.onlyComputer}
        style={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: 'white',
          opacity: '0.8',
          padding: '20px',
          margin: 'auto',
          right: 12,
          top: 55,
          width: 250,
          'border-radius': '25px',
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <MapInfo />
      </Responsive>
    )}
    <NationalMap />
  </div>
);

const mapStateToProps = state => ({
  headerHid: state.maps.headerHid,
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(NationalMapContainer);
