import React from 'react';
import { Header, Segment, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import { fetchOfficesList } from '../../redux/actions/officeActions';
import { resetActiveState } from '../../redux/actions/stateActions';
import { setActive } from '../../redux/actions/navActions';

class NationalMapContainer extends React.Component {
  state = { windowWidth: '' };

  componentDidMount() {
    this.props.setActive('national map');
  }

  componentDidUpdate() {
    if (this.props.offices.offices.length !== 3) {
      this.props.fetchOfficesList();
    }
  }

  render() {
    return (
      <div ref={divElement => (this.divElement = divElement)}>
        {this.props.offices.offices.length === 3 && (
          <NationalMap windowWidth={this.props.windowWidth} />
        )}
        {!this.props.headerHid &&
          this.props.windowWidth >= 768 && (
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
              {this.props.overlay.hoveredWinner.votes === '' &&
              this.props.offices.offices.length > 0 ? (
                <Header size="huge">
                  {
                    this.props.offices.offices.find(
                      office => office.id === this.props.offices.selectedOfficeId.toString(),
                    ).attributes.name
                  }
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
          )}
        {this.props.windowWidth < 768 && (
          <Container>
            <Segment vertical padded>
              {this.props.overlay.hoveredWinner.votes === '' &&
              this.props.offices.offices.length > 0 ? (
                <Header size="huge">
                  {
                    this.props.offices.offices.find(
                      office => office.id === this.props.offices.selectedOfficeId.toString(),
                    ).attributes.name
                  }
                  <Header.Subheader>
                    Zoom in to see counties or out to see states. Click for details.
                  </Header.Subheader>
                </Header>
              ) : (
                <div>
                  <MapInfo />
                </div>
              )}
            </Segment>
          </Container>
        )}
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  fetchOfficesList: () => dispatch(fetchOfficesList()),
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  headerHid: state.maps.headerHid,
  overlay: state.maps.overlay,
  offices: state.offices,
  states: state.states.activeStateId,
  windowWidth: state.nav.windowWidth,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMapContainer);
