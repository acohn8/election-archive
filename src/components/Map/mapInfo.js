import React from 'react';
import { connect } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

const colors = {
  democratic: '#2085D0',
  republican: '#DB2828',
  libertarian: '#FBBD09',
  other: '#6435C9',
};

const MapInfo = props => (
  <div>
    <Header as={props.overlay.isNational === true ? 'h2' : 'h4'}>
      {props.overlay.hoveredGeography}
      {props.overlay.layer === 'state' &&
        !props.mobile && <Header.Subheader>Click for details</Header.Subheader>}
    </Header>
    <List divided relaxed>
      <List.Item>
        <List.Content>
          <List.Header>
            <span>
              <span
                style={{
                  color: colors[props.overlay.hoveredWinner.party],
                  transition: 'all .3s ease',
                  margin: '3px',
                }}
              >
                &#x25cf;
              </span>
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
            <span>
              <span
                style={{
                  color: colors[props.overlay.hoveredSecond.party],
                  transition: 'all .3s ease',
                  margin: '3px',
                }}
              >
                &#x25cf;
              </span>
              {props.overlay.hoveredSecond.name}
            </span>
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
  activeItem: state.nav.activePage,
});

export default connect(mapStateToProps)(MapInfo);
