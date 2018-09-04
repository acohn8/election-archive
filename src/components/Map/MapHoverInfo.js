import React from 'react';
import { Header, List } from 'semantic-ui-react';
import PartyColorCircle from '../Ui/ColorCircle';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

const MapHoverInfo = ({ overlay, mobile, isNational }) => (
  <div>
    <Header as={isNational ? 'h2' : 'h4'}>
      {overlay.hoveredGeography}
      {overlay.layer === 'state' &&
        !mobile && <Header.Subheader>Click for details</Header.Subheader>}
      {overlay.layer === 'state' && mobile && <Header.Subheader>Tap for details</Header.Subheader>}
    </Header>
    <List divided relaxed>
      <List.Item>
        <List.Content>
          <List.Header>
            <span>
              <PartyColorCircle color={colors[overlay.hoveredWinner.party]} />
              {overlay.hoveredWinner.name}
            </span>
          </List.Header>
          <List.Description>
            {`${overlay.hoveredWinner.votes.toLocaleString()} votes (${Math.round(overlay.hoveredWinner.percent * 100)}%)`}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <PartyColorCircle color={colors[overlay.hoveredSecond.party]} />
            {overlay.hoveredSecond.name}
          </List.Header>
          <List.Description>
            {`${overlay.hoveredSecond.votes.toLocaleString()} votes (${Math.round(overlay.hoveredSecond.percent * 100)}%)`}
          </List.Description>
        </List.Content>
      </List.Item>
    </List>
  </div>
);

export default MapHoverInfo;
