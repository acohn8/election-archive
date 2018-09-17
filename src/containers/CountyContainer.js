import React from 'react';
import { connect } from 'react-redux';
import { fetchPrecinctData, resetPrecinctResults } from '../redux/actions/resultActions';

import { Loader, Grid, Segment, Label, Icon } from 'semantic-ui-react';
import CountyTableContainer from './CountyTableContainer';
import { fetchCountyDetails, resetCountyDetails } from '../redux/actions/countyActions';
import CountyMapContainer from './CountyMapContainer';
import CountyImageGallery from '../components/ImageGallery/ImageGallery';

class CountyContainer extends React.Component {
  componentDidMount() {
    this.props.fetchPrecinctData(this.props.countyId, this.props.districtId);
    this.props.fetchCountyDetails(this.props.countyId);
  }

  componentWillUnmount() {
    this.props.resetPrecinctResults();
    this.props.resetCountyDetails();
  }

  render() {
    const {
      details, fips, images, url,
    } = this.props.countyInfo;
    return (
      <div>
        {this.props.precinctResults.result !== undefined && fips ? (
          <Grid stackable>
            <Grid.Row columns={2} stretched>
              <Grid.Column>
                <Segment
                  style={{
                    minHeight: 330,
                  }}
                >
                  {images &&
                    images.length > 0 && (
                      <CountyImageGallery
                        images={images.map(image => ({
                          original: image.url,
                          thumbnail: image.url,
                        }))}
                      />
                    )}
                  {details !== undefined && (
                    <span>
                      <p>{details}</p>
                    </span>
                  )}

                  {url && (
                    <Label
                      attached="bottom right"
                      as="a"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="wikipedia w" />
                      More
                    </Label>
                  )}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment style={{ height: 330 }}>
                  <CountyMapContainer />
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row colums={1}>
              <Grid.Column>
                <CountyTableContainer countyId={this.props.countyId} />
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
