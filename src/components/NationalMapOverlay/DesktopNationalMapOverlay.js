import React from 'react';
import { Header, Responsive } from 'semantic-ui-react';
import DesktopNationalHoverContainer from './DesktopNationalHoverOverlay';

const DesktopNationalMapOverlay = ({ hoveredWinner, office, children }) => (
  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
    <DesktopNationalHoverContainer>
      {hoveredWinner.votes === '' ? (
        <Header size="huge">
          {office}
          <Header.Subheader>
            Zoom in to see counties or out to see states. Click for details.
          </Header.Subheader>
        </Header>
      ) : (
        <div>{children}</div>
      )}
    </DesktopNationalHoverContainer>
  </Responsive>
);

export default DesktopNationalMapOverlay;
