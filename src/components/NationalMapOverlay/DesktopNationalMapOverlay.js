import React from 'react';
import { Header, Responsive } from 'semantic-ui-react';

const DesktopNationalMapOverlay = ({ hoveredWinner, office, children }) => (
  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
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
  </Responsive>
);

export default DesktopNationalMapOverlay;
