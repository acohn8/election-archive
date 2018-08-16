import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import NationalMap from './NationalMap';
import MapInfo from '../Map/mapInfo';
import OfficeDropdown from '../OfficeDropdown/OfficeDropdown';
import { fetchOfficesList } from '../../redux/actions/officeActions';
import { resetActiveState } from '../../redux/actions/stateActions';

class NationalMapContainer extends React.Component {
  componentDidUpdate() {
    if (this.props.offices.offices.length !== 3) {
      this.props.fetchOfficesList();
    } else if (this.props.states !== null) {
      this.props.resetActiveState();
    }
  }

  render() {
    return (
      <div>
        {!this.props.headerHid && (
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
                <OfficeDropdown />
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
        {this.props.offices.offices.length === 3 && <NationalMap />}
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
