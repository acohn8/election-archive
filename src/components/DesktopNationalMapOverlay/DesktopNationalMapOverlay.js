import React from 'react';
import { Header, Responsive } from 'semantic-ui-react';
import MapInfo from '../Map/MapInfo';

const DesktopNationalMapOverlay = ({ hoveredWinner, office }) => (
  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        left: 30,
        borderRadius: '25px',
        top: 80,
        width: 300,
        backgroundColor: 'white',
        padding: '20px',
        opacity: '0.8',
        borderColor: 'gray',
        borderStyle: 'solid',
        borderWidth: '0.5px',
      }}
    >
      {hoveredWinner.votes === '' ? (
        <Header size="huge">
          {office}
          <Header.Subheader>
            Zoom in to see counties or out to see states. Click for details.
          </Header.Subheader>
        </Header>
      ) : (
        <div>
          <MapInfo />
        </div>
      )}
    </div>
  </Responsive>
);

export default DesktopNationalMapOverlay;
