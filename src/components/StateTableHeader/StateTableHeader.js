import React from 'react';
import { Header } from 'semantic-ui-react';

const tableHeaders = {
  results: { header: 'County Election Results', subheader: 'Click a county for details' },
  finance: { header: 'Campaign Finance Data', subheader: '2016 Election Cycle' },
};

const StateTableHeader = ({ selectedTable }) => (
  <Header size="medium">
    {tableHeaders[selectedTable].header}
    <Header.Subheader>{tableHeaders[selectedTable].subheader}</Header.Subheader>
  </Header>
);

export default StateTableHeader;
