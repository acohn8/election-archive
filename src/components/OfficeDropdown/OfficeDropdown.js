import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';

const OfficeDropdown = (props) => {
  let filteredOffices;
  props.activeItem === 'national map'
    ? (filteredOffices = props.offices.allOffices)
    : (filteredOffices = props.offices.stateOffices);

  return (
    <Dropdown
      text={
        props.offices.allOffices.find(office => office.id === props.offices.selectedOfficeId)
          .attributes.name
      }
      pointing
      // className="link item"
    >
      <Dropdown.Menu>
        <Dropdown.Header>Offices</Dropdown.Header>
        {/* undefined office districts allows the component to work on the national map as allOffices doesn't include districts */}
        {filteredOffices.map(office =>
            (office.districts === undefined || office.districts.length <= 1 ? (
              <Dropdown.Item key={office.id} onClick={() => props.setActiveOffice(office.id)}>
                {props.activeItem === 'national map' ? office.attributes.name : office.name}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item key={office.id}>
                <Dropdown text={office.name}>
                  <Dropdown.Menu>
                    <Dropdown.Header>Districts</Dropdown.Header>
                    {office.districts
                      .sort((a, b) => a.name.split('-')[1] - b.name.split('-')[1])
                      .map(district => (
                        <Dropdown.Item
                          key={district.id}
                          onClick={() => props.setActiveOffice(office.id, district.id)}
                        >
                          {district.name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Dropdown.Item>
            )))}
      </Dropdown.Menu>
    </Dropdown>
    // <Dropdown
    //   transparent="true"
    //   options={createOptions()}
    //   value={createOptions().find(office => office.value === props.offices.selectedOfficeId).value}
    // />
  );
};

const mapDespatchToProps = dispatch => ({
  setActiveOffice: (officeId, districtId) => dispatch(setActiveOffice(officeId, districtId)),
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
