import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ExportDropdown = (props) => {
  const stateName = props.shortName.toLowerCase();

  const formattedOfficeName = props.officeName
    .toLowerCase()
    .split(' ')
    .join('_');

  return (
    <Dropdown text="CSV Export" icon="cloud download" floating labeled button className="icon">
      <Dropdown.Menu>
        <Dropdown.Header icon="globe" content="Select a geography" />
        <Dropdown.Item
          as="a"
          href={`https://s3.amazonaws.com/stateprecinctresults/statewideexports/${stateName}/${formattedOfficeName}/counties/${stateName}_${formattedOfficeName}_county_results.csv`}
        >
          County
        </Dropdown.Item>
        <Dropdown.Item
          as="a"
          href={`https://s3.amazonaws.com/stateprecinctresults/statewideexports/${stateName}/${formattedOfficeName}/precincts/${stateName}_${formattedOfficeName}_precinct_results.csv`}
        >
          Precinct
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = state => ({
  shortName: state.results.shortName,
  officeName: state.results.officeName,
});

export default connect(mapStateToProps)(ExportDropdown);
