import React from 'react';
import { List, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

const MapInfo = props => (
  <div>
    {props.overlay.hoveredDem.votes !== '' && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: 'white',
          opacity: '0.8',
          padding: props.overlay.isNational === true ? '20px' : '10px',
          margin: 'auto',
          right: 30,
          top: props.overlay.isNational ? 170 : 20,
          borderColor: 'gray',
          borderStyle: 'solid',
          borderWidth: '0.5px',
        }}
      >
        <Header as={props.overlay.isNational === true ? 'h3' : 'h4'}>
          {props.overlay.hoveredGeography}
          {props.overlay.isStatewide === true && (
            <Header.Subheader>Click for details</Header.Subheader>
          )}
        </Header>
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>
                <span>
                  <span
                    style={{
                      color: '#2085D0',
                      transition: 'all .3s ease',
                      margin: '3px',
                    }}
                  >
                    &#x25cf;
                  </span>
                  Hillary Clinton
                </span>
              </List.Header>
              <List.Description>
                {`${props.overlay.hoveredDem.votes.toLocaleString()} votes (${Math.round(props.overlay.hoveredDem.percent * 100)}%)`}
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>
                <span>
                  <span
                    style={{
                      color: '#DB2828',
                      transition: 'all .3s ease',
                      margin: '3px',
                    }}
                  >
                    &#x25cf;
                  </span>
                  Donald Trump
                </span>
              </List.Header>
              <List.Description>
                {`${props.overlay.hoveredRep.votes.toLocaleString()} votes (${Math.round(props.overlay.hoveredRep.percent * 100)}%)`}
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>
    )}
  </div>
);

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
});

export default connect(mapStateToProps)(MapInfo);
