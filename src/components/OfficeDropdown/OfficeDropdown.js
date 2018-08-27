import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setActiveOffice } from '../../redux/actions/officeActions';
import { fetchStateData } from '../../redux/actions/resultActions';

const OfficeDropdown = (props) => {
  let filteredOffices;
  props.activeItem === 'national map'
    ? (filteredOffices = props.offices.allOffices)
    : (filteredOffices = props.offices.stateOffices);

  const setAndFetchOfficeInfo = (officeId, stateId, districtId = null) => {
    props.setActiveOffice(officeId, districtId);
    if (props.activeItem !== 'national map') {
      props.fetchStateData(stateId, districtId);
    }
  };

  return (
    <Dropdown
      text={
        props.offices.allOffices.entities.offices[props.offices.selectedOfficeId].attributes.name
      }
      pointing
    >
      <Dropdown.Menu>
        <Dropdown.Header>Offices</Dropdown.Header>
        {/* undefined office districts allows the component to work on the national map as allOffices doesn't include districts */}
        {filteredOffices.result.map(office =>
            (filteredOffices.entities.offices[office].districts === undefined ||
            filteredOffices.entities.offices[office].districts.length <= 1 ? (
              <Dropdown.Item
                key={office}
                onClick={() => setAndFetchOfficeInfo(office, props.activeStateId)}
              >
                {props.activeItem === 'national map'
                  ? filteredOffices.entities.offices[office].attributes.name
                  : filteredOffices.entities.offices[office].name}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item key={office}>
                <Dropdown text={filteredOffices.entities.offices[office].name} scrolling>
                  <Dropdown.Menu>
                    <Dropdown.Header>Districts</Dropdown.Header>
                    {filteredOffices.entities.offices[office].districts
                      .sort((a, b) => a.name.split('-')[1] - b.name.split('-')[1])
                      .map(district => (
                        <Dropdown.Item
                          key={district.id}
                          onClick={
                            () => {
                              setAndFetchOfficeInfo(office, props.activeStateId, district.id);
                            }
                            // setAndFetchOfficeInfo(office, this.props.activeStateId, district.id)
                            // props.setActiveOffice(office, this.props.activeStateId, district.id);
                            // props.fetchStateData(this.props.activeStateId, district.id);
                          }
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
  );
};

const mapDispatchToProps = dispatch => ({
  setActiveOffice: (officeId, districtId) => dispatch(setActiveOffice(officeId, districtId)),
  fetchStateData: (stateId, districtId) => dispatch(fetchStateData(stateId, districtId)),
});

const mapStateToProps = state => ({
  offices: state.offices,
  activeItem: state.nav.activePage,
  activeStateId: state.states.activeStateId,
  resultsOfficeName: state.results.name,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfficeDropdown);
