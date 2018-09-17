import React from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import { fetchPrecinctData, resetPrecinctResults } from '../redux/actions/resultActions';

import { Loader, Grid, Segment, Label, Icon, Header, Image } from 'semantic-ui-react';
import CountyTableContainer from './CountyTableContainer';
import { fetchCountyDetails, resetCountyDetails } from '../redux/actions/countyActions';
import CountyMapContainer from './CountyMapContainer';

class CountyContainer extends React.Component {
  state = { height: 300, expanded: false };
  componentDidMount() {
    this.props.fetchPrecinctData(this.props.countyId, this.props.districtId);
    this.props.fetchCountyDetails(this.props.countyId);
  }

  componentWillUnmount() {
    this.props.resetPrecinctResults();
    this.props.resetCountyDetails();
  }

  handleClick = () => {
    this.setState({ expandedOverview: !this.state.expandedOverview });
  };

  handleClick = () => {
    this.setState({ expandedOverview: !this.state.expandedOverview });
  };

  formatCountySummary = () => {
    const splitSummary = this.props.countyInfo.details
      .split(' ')
      .filter(word => !word.includes('()'));
    if (this.state.expandedOverview === true) {
      return (
        <div>
          <p>{splitSummary.join(' ')}. </p>
          <Label as="a" onClick={this.handleClick}>
            <Icon name="arrow up" /> Less
          </Label>
        </div>
      );
    } else if (splitSummary.length <= 150) {
      return this.props.countyInfo.details;
    } else {
      const sentences = splitSummary
        .slice(0, 150)
        .join(' ')
        .split('.');
      const shortenedSummary = sentences.slice(0, sentences.length - 2).join('.');
      return (
        <div>
          <p>{shortenedSummary}. </p>
          <Label onClick={this.handleClick}>
            <Icon name="arrow down" /> More
          </Label>
        </div>
      );
    }
  };

  render() {
    const { details, fips, images, url } = this.props.countyInfo;
    return (
      <div>
        {this.props.precinctResults.result !== undefined && fips ? (
          <Grid stackable>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Measure
                  bounds
                  onResize={contentRect => {
                    this.setState({ height: contentRect.bounds.height });
                  }}
                >
                  {({ measureRef }) => (
                    <div ref={measureRef} height="100%">
                      <Segment style={{ minHeight: 300 }}>
                        <Header size="medium">Overview</Header>
                        {images &&
                          images.length > 0 && (
                            <Image size="small" floated="left" src={images[0].url} />
                          )}
                        {details !== undefined && this.formatCountySummary()}
                        {url && (
                          <Label
                            attached="top right"
                            as="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon name="wikipedia w" />
                          </Label>
                        )}
                      </Segment>
                    </div>
                  )}
                </Measure>
              </Grid.Column>
              <Grid.Column>
                <Segment style={{ height: this.state.height }}>
                  <CountyMapContainer height={this.state.height - 30} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row colums={1}>
              <Grid.Column>
                <Segment style={{ minHeight: 430, overflow: 'hidden' }}>
                  <Header size="medium">
                    Results
                    <Header.Subheader>{this.props.officeInfo.name}</Header.Subheader>
                  </Header>
                  <CountyTableContainer countyId={this.props.countyId} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
  officeInfo: state.results.officeInfo,
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
  null,
  { withRef: true },
)(CountyContainer);
