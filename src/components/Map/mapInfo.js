import React from 'react';
import { List, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

const colors = {
  democratic: 'blue',
  republican: 'red',
  libertarian: 'yellow',
  green: 'green',
  'working families': 'purple',
};

const MapInfo = props => (
  <div>
    <Header as={props.overlay.isNational === true ? 'h2' : 'h4'}>
      {props.overlay.hoveredGeography}
      {props.overlay.isNational === true && <Header.Subheader>Click for details</Header.Subheader>}
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
});

export default connect(mapStateToProps)(MapInfo);
