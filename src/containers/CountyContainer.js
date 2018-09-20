import React from 'react';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import { fetchPrecinctData, resetPrecinctResults } from '../redux/actions/resultActions';

import { Loader, Grid, Segment, Label, Icon, Header, Image, Button } from 'semantic-ui-react';
import CountyTableContainer from './CountyTableContainer';
import { fetchCountyDetails, resetCountyDetails } from '../redux/actions/countyActions';
import CountyMapContainer from './CountyMapContainer';
import ButtonWithIcon from '../components/ButtonWithIcon/ButtonWithIcon';

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
      .replace(
        /\b(\w\.\w\.|\d+(?:\.\d+){1,2}\.?)|([.?!])\s+(?=[A-Za-z])/g,
        (m, g1, g2) => (g1 ? g1 : g2 + '\r'),
      )
      .split('\r');
    const wikiUrl = this.props.countyInfo.url;
    if (this.state.expandedOverview === true) {
      return (
        <div>
          <p>{this.props.officeInfo.overview}</p>
          <Button.Group>
            <ButtonWithIcon color="teal" icon="arrow up" text={'Less'} onClick={this.handleClick} />
            <ButtonWithIcon color="grey" link={wikiUrl} icon="wikipedia w" text={'Wiki'} />
          </Button.Group>
        </div>
      );
    } else if (splitSummary.length <= 3) {
      return (
        <div>
          <p>{this.props.countyInfo.details}</p>
          <Button.Group>
            <ButtonWithIcon color="grey" link={wikiUrl} icon="wikipedia w" text={'Wiki'} />
          </Button.Group>
        </div>
      );
    } else {
      const shortenedSummary = splitSummary.slice(0, 3).join(' ');
      return (
        <div>
          <p>{shortenedSummary}</p>
          <Button.Group>
            <ButtonWithIcon
              color="teal"
              icon="arrow down"
              text={'More'}
              onClick={this.handleClick}
            />
            <ButtonWithIcon color="grey" link={wikiUrl} icon="wikipedia w" text={'Wiki'} />
          </Button.Group>
        </div>
      );
    }
  };

  render() {
    const { details, fips, images } = this.props.countyInfo;
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
                      {details !== undefined &&
                        details && (
                          <Segment style={{ minHeight: 300 }}>
                            <Header size="medium">Overview</Header>
                            {images &&
                              images.length > 0 && (
                                <Image size="small" floated="left" src={images[0].url} />
                              )}
                            {this.formatCountySummary()}
                          </Segment>
                        )}
                    </div>
                  )}
                </Measure>
              </Grid.Column>
              <Grid.Column>
                <Segment style={{ height: this.state.height, minHeight: 300 }}>
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
)(CountyContainer);
