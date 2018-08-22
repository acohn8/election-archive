import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';

const OfficeDropdown = (props) => {
  let filterOptions;
  props.activeItem === 'national map'
    ? (filterOptions = props.offices.allOffices)
    : (filterOptions = props.offices.stateOffices);
  const options = filterOptions
    .map(office => ({
      key: office.id,
      value: office.id,
      text: office.attributes.name,
      onClick: () => props.setActiveOffice(office.id),
    }))
    .sort((a, b) => b.text - a.text);

  return (
    <Dropdown
      // inline
      transparent="true"
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
  activeItem: state.nav.activePage,
  activeStateId: state.states.activeStateId,
});

export default connect(
  mapStateToProps,
  mapDespatchToProps,
)(OfficeDropdown);
