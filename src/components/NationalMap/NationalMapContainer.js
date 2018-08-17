import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import OfficeDropdown from '../OfficeDropdown/OfficeDropdown';
import { fetchOfficesList } from '../../redux/actions/officeActions';
import { resetActiveState } from '../../redux/actions/stateActions';

class NationalMapContainer extends React.Component {
  state = { windowWidth: '' };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate() {
    if (this.props.offices.offices.length !== 3) {
      this.props.fetchOfficesList();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ windowWidth: this.divElement.clientWidth });
  };

  render() {
    return (
      <div ref={divElement => (this.divElement = divElement)}>
        {!this.props.headerHid && (
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              left: this.state.windowWidth >= 768 ? 30 : 0,
              borderRadius: this.state.windowWidth >= 768 ? '25px' : 0,
              height: this.state.windowWidth <= 768 && '10vh',
              top: this.state.windowWidth >= 768 ? 80 : 0,
              bottom: this.state.windowWidth <= 768 ? 0 : 80,
              marginTop: this.state.windowWidth >= 768 ? 0 : '75vh',
              width: this.state.windowWidth >= 768 ? 300 : '100vw',
              backgroundColor: 'white',
              padding: this.state.windowWidth >= 768 ? '20px' : '5px',
              opacity: this.state.windowWidth >= 768 ? '0.8' : '1',
              borderColor: this.state.windowWidth >= 768 && 'gray',
              borderStyle: this.state.windowWidth >= 768 && 'solid',
              borderWidth: this.state.windowWidth >= 768 && '0.5px',
            }}
          >
            {this.props.overlay.hoveredWinner.votes === '' &&
            this.props.offices.offices.length > 0 ? (
              <Header size={this.state.windowWidth >= 768 ? 'huge' : 'large'}>
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
        {this.props.offices.offices.length === 3 && (
          <NationalMap windowWidth={this.state.windowWidth} />
        )}
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  fetchOfficesList: () => dispatch(fetchOfficesList()),
  resetActiveState: () => dispatch(resetActiveState()),
});

const mapStateToProps = state => ({
  headerHid: state.maps.headerHid,
  overlay: state.maps.overlay,
  offices: state.offices,
  states: state.states.activeStateId,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMapContainer);
