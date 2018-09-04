import React from 'react';
import { connect } from 'react-redux';
import { Header, List } from 'semantic-ui-react';
import PartyColorCircle from '../Ui/ColorCircle';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

const MapHoverInfo = props => (
  <div>
    <Header as={props.overlay.isNational === true ? 'h2' : 'h4'}>
      {props.overlay.hoveredGeography}
      {props.overlay.layer === 'state' &&
        !props.mobile && <Header.Subheader>Click for details</Header.Subheader>}
      {props.overlay.layer === 'state' &&
        props.mobile && <Header.Subheader>Tap for details</Header.Subheader>}
    </Header>
    <List divided relaxed>
      <List.Item>
        <List.Content>
          <List.Header>
            <span>
              <PartyColorCircle color={colors[props.overlay.hoveredWinner.party]} />
              {props.overlay.hoveredWinner.name}
            </span>
          </List.Header>
          <List.Description>
            {`${props.overlay.hoveredWinner.votes.toLocaleString()} votes (${Math.round(props.overlay.hoveredWinner.percent * 100)}%)`}
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>
            <PartyColorCircle color={colors[props.overlay.hoveredSecond.party]} />
            {props.overlay.hoveredSecond.name}
          </List.Header>
          <List.Description>
            {`${props.overlay.hoveredSecond.votes.toLocaleString()} votes (${Math.round(props.overlay.hoveredSecond.percent * 100)}%)`}
          </List.Description>
        </List.Content>
      </List.Item>
    </List>
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapHoverInfo);
