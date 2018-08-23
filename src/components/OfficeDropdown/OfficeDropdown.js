import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';

const OfficeDropdown = (props) => {
  const createOptions = () => {
    if (props.activeItem === 'national map') {
      return props.offices.allOffices
        .map(office => ({
          key: office.id,
          value: office.id,
          text: office.attributes.name,
          onClick: () => props.setActiveOffice(office.id),
        }))
        .sort((a, b) => b.text - a.text);
    } else if (props.activeItem === 'statesShow') {
      return props.offices.stateOffices.map(office => ({
        key: office.id,
        value: office.id,
        text: office.name,
        onClick: () => props.setActiveOffice(office.id),
      }));
    }
  };

  return (
    <Dropdown
      transparent="true"
      options={createOptions()}
      value={createOptions().find(office => office.value === props.offices.selectedOfficeId).value}
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
