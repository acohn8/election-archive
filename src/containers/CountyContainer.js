import React from 'react';
import { connect } from 'react-redux';
import { fetchPrecinctData, resetPrecinctResults } from '../redux/actions/resultActions';

import { Loader, Container } from 'semantic-ui-react';
import CountyTableContainer from './CountyTableContainer';
import { fetchCountyDetails, resetCountyDetails } from '../redux/actions/countyActions';

class CountyContainer extends React.Component {
  componentDidMount() {
    console.log(this.props.districtId);
    this.props.fetchPrecinctData(this.props.countyId, this.props.districtId);
    this.props.fetchCountyDetails(this.props.countyId);
  }

  componentWillUnmount() {
    this.props.resetPrecinctResults();
    this.props.resetCountyDetails();
  }

  render() {
    const { details } = this.props.countyInfo;
    return (
      <div>
        {this.props.precinctResults.result !== undefined ? (
          <div>
            {details !== undefined && <Container>{details}</Container>}
            <CountyTableContainer countyId={this.props.countyId} />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  precinctResults: state.results.precinctResults,
  countyInfo: state.counties,
  districtId: state.offices.selectedDistrictId,
});

const mapDispatchToProps = dispatch => ({
  fetchPrecinctData: (countyId, districtId) => dispatch(fetchPrecinctData(countyId, districtId)),
  fetchCountyDetails: countyId => dispatch(fetchCountyDetails(countyId)),
  resetPrecinctResults: () => dispatch(resetPrecinctResults()),
  resetCountyDetails: () => dispatch(resetCountyDetails()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CountyContainer);
