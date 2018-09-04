import React from 'react';
import { Container, Header, Responsive, Segment } from 'semantic-ui-react';

const MobileNationalMapOverlay = ({ hoveredWinner, office, children }) => (
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
          <div>{children}</div>
        )}
      </Segment>
    </Container>
  </Responsive>
);

export default MobileNationalMapOverlay;
