import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ExportDropdown = props => (
  <Dropdown text="CSV Export" icon="cloud download" floating labeled button className="icon">
    <Dropdown.Menu>
      <Dropdown.Header icon="tags" content="Select a geography" />
      <Dropdown.Item
        as="a"
        href={`https://election-data-2016.herokuapp.com/api/v1/results/export/county/${
          props.states.activeStateId
        }.csv`}
      >
        County
      </Dropdown.Item>
      <Dropdown.Item
        as="a"
        href={`https://election-data-2016.herokuapp.com/api/v1/results/export/precinct/${
          props.states.activeStateId
        }.csv`}
      >
        Precinct
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const mapStateToProps = state => ({
  states: state.states,
});

export default connect(mapStateToProps)(ExportDropdown);
