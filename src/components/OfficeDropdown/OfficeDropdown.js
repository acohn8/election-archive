import React from 'react';
import { Select } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';

const OfficDropdown = props => (
  // handleChange = officeId => {
  //   this.props.fetchStateData(this.props.activeStateId, officeId);
  // };

  <Select
    text="Select an office"
    search
    fluid
    selection
    options={props.offices.map(office => ({
      key: office.id,
      value: office.id,
      text: office.attributes.name,
      onClick: () => props.setActiveOffice(office.id.toString()),
    }))}
  />
);
const mapDespatchToProps = dispatch => ({
  setActiveOffice: officeId => dispatch(setActiveOffice(officeId)),
});

const mapStateToProps = state => ({
  offices: state.offices.offices,
  activeStateId: state.states.activeStateId,
});

export default connect(
  mapStateToProps,
  mapDespatchToProps,
)(OfficDropdown);
