import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

class PrecinctTable extends React.Component {
  state = { filtered: [] };

  makeData = () => {
    console.log(this.props.electionResults);
    // const majorCandidates = Object.keys(this.props.electionResults.precincts[0].results);
    // const data = this.props.electionResults.precincts.map(precinct => ({
    //   precinct: precinct.name,
    // }));

    // data.forEach(precinct => {
    //   precinct.candidates = {};
    //   majorCandidates.forEach(candidateId => {
    //     county.precinct[candidateId] = {
    //       votes: this.props.electionResults.precincts.results[county.countyId].results[candidateId],
    //     };
    //   });
    // });
    // return data;
  };

  makeColumns = () => {
    const majorCandidates = Object.keys(this.props.electionResults.precincts[0].results);

    const columns = [
      {
        Header: 'Precinct',
        id: 'precinct',
        width: 300,
        accessor: d => d.name,
        filterMethod: (filter, row) =>
          this.state.filtered.length > 0 &&
          row.county.toLowerCase().includes(this.state.filtered[0].value.toLowerCase()),
      },
    ];

    majorCandidates.map(candidateId => {
      columns.push({
        id: candidateId,
        Header: `${
          candidateId === 'other'
            ? 'Other'
            : this.props.candidates.entities.candidates[candidateId].attributes.name
        }`,
        accessor: d => d.results[candidateId],
        filterable: false,
        minWidth: 100,
      });
    });
    return columns;
  };

  render() {
    return (
      <div>
        {this.props.electionResults.precincts !== undefined && (
          <ReactTable
            data={this.props.electionResults}
            columns={this.makeColumns()}
            defaultPageSize={this.props.electionResults.length}
            showPagination={false}
            style={{
              height: '400px',
            }}
          />
        )}
      </div>
    );
    //       SubComponent={row => {
    //         {
    //           this.props.fetchPrecinctData(row.original.countyId);
    //         }
    //         return (
    //           <div style={{ padding: '20px', backgroundColor: '#F9FAFB' }}>
    //             <Header as="h4">Precinct Results</Header>
    //             <br />
    //             <br />
    //             <div>
    //               <ReactTable
    //                 data={this.makeData()}
    //                 columns={this.makeColumns()}
    //                 defaultPageSize={this.makeData().length}
    //                 showPagination={false}
    //                 style={{
    //                   height: '400px',
    //                 }}
    //               />
    //             </div>
    //           </div>
    //         );
    //       }}
    //     />
    //   );
    // }
  }
}

const mapStateToProps = state => ({
  candidates: state.results.candidates,
  geography: state.results.geography,
  electionResults: state.results.precinctResults,
});

export default connect(mapStateToProps)(PrecinctTable);
