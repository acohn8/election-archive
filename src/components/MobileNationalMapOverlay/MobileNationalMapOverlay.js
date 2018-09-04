import React from 'react';
import { Container, Header, Responsive, Segment } from 'semantic-ui-react';
import MapHoverInfo from '../Map/MapHoverInfo';

const MobileNationalMapOverlay = ({ hoveredWinner, office }) => (
  <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
    <Container>
      <Segment vertical padded>
        {hoveredWinner.votes === '' ? (
          <Header size="huge">
            {office}
            <Header.Subheader>
              Zoom in to see counties or out to see states. Tap for details.
            </Header.Subheader>
          </Header>
        ) : (
          <div>
            <MapHoverInfo mobile />
          </div>
        )}
      </Segment>
    </Container>
  </Responsive>
);

export default MobileNationalMapOverlay;
