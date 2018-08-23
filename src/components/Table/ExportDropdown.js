import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ExportDropdown = (props) => {
  const stateName = props.geography.entities.state[
    props.states.activeStateId
  ].short_name.toLowerCase();

  const officeName = props.offices.stateOffices
    .find(office => office.id === props.offices.selectedOfficeId)
    .name.toLowerCase()
    .split(' ')
    .join('_');

  return (
    <Dropdown text="CSV Export" icon="cloud download" floating labeled button className="icon">
      <Dropdown.Menu>
        <Dropdown.Header icon="globe" content="Select a geography" />
        <Dropdown.Item
          as="a"
          href={`https://s3.amazonaws.com/stateprecinctresults/statewideexports/${stateName}/${officeName}/counties/${stateName}_${officeName}_county_results.csv`}
        >
          County
        </Dropdown.Item>
        <Dropdown.Item
          as="a"
          href={`https://s3.amazonaws.com/stateprecinctresults/statewideexports/${stateName}/${officeName}/precincts/${stateName}_${officeName}_precinct_results.csv`}
        >
          Precinct
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = state => ({
  states: state.states,
  offices: state.offices,
  geography: state.results.geography,
});

export default connect(mapStateToProps)(ExportDropdown);
