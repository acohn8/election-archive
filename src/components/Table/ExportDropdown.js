import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ExportDropdown = props => (
  <Dropdown text="CSV Export" icon="cloud download" floating labeled button className="icon">
    <Dropdown.Menu>
      <Dropdown.Header icon="tags" content="Select a geography" />
      <Dropdown.Item
        as="a"
        href={`https://s3.amazonaws.com/stateprecinctresults/countyresults/${props.geography.entities.state[
          props.states.activeStateId
        ].short_name.toLowerCase()}-county-results.csv`}
      >
        County
      </Dropdown.Item>
      <Dropdown.Item
        as="a"
        href={`https://s3.amazonaws.com/stateprecinctresults/precinctresults/${props.geography.entities.state[
          props.states.activeStateId
        ].short_name.toLowerCase()}-precinct-results.csv`}
      >
        Precinct
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
});

export default connect(mapStateToProps)(ExportDropdown);
