import React from 'react';
import { Header, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';

const OfficDropdown = (props) => {
  const options = props.offices.offices.map(office => ({
    key: office.id,
    value: office.id,
    text: office.attributes.name,
    onClick: () => props.setActiveOffice(office.id),
  }));

  return (
    <Dropdown
      inline
      options={options}
      value={
        options.find(office => office.value === props.offices.selectedOfficeId.toString()).value
      }
    />
  );
};

const mapDespatchToProps = dispatch => ({
  setActiveOffice: officeId => dispatch(setActiveOffice(officeId)),
});

const mapStateToProps = state => ({
  offices: state.offices,
  activeStateId: state.states.activeStateId,
});

export default connect(
  mapStateToProps,
  mapDespatchToProps,
)(OfficDropdown);
