import React from 'react';
import { connect } from 'react-redux';

import NewMap from './NewMapComponent';

class NewMapContainer extends React.Component {
  render() {
    return (
      <div>
        <NewMap />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  // headerHid: state.maps.headerHid,
  // overlay: state.maps.overlay,
  allOffices: state.offices.allOffices,
  selectedOffice: state.offices.selectedOfficeId,
  // states: state.states.activeStateId,
  // windowWidth: state.nav.windowWidth,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewMapContainer);
