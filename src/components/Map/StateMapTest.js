import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import {
  getHoverInfo,
  setMapDetails,
  resetHover,
  resetMapDetails,
} from '../../redux/actions/mapActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class MapTest extends React.Component {
  componentDidMount() {
    this.createMap();
  }

  componentWillUnmount() {
    this.map.remove();
    this.props.resetMapDetails();
  }

  getCoords = () => {
    const foundCounty = this.props.geography.result.counties.find(
      countyId =>
        this.props.geography.entities.counties[countyId].latitude &&
        this.props.geography.entities.counties[countyId].longitude !== false,
    );
    return [
      this.props.geography.entities.counties[foundCounty].longitude,
      this.props.geography.entities.counties[foundCounty].latitude,
    ];
  };

  createMap = () => {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjjyfk3es0nfj2rqpf9j53505',
      zoom: 3,
      //grabs the lat long from the first county in the state to ensure the counties layer is loading the right geos
      //if it's Alaska, it just jumps to the middle of the state
      center: this.props.geography.result.state !== 17 ? this.getCoords() : [-149.4937, 64.2008],
    });

    this.map.on('load', () => {
      this.map.addSource('counties', {
        type: 'vector',
        url: 'mapbox://adamcohn.1k3u9fep',
      });

      const maxValue = 14;

      this.map.addLayer(
        {
          id: 'counties-join',
          type: 'fill',
          source: 'counties',
          'source-layer': 'cb_2017_us_county_500k-7qwbcn',
          filter: [
            '==',
            ['get', 'STATEFP'],
            this.props.geography.entities.state[this.props.geography.result.state].fips
              .toString()
              .padStart(2, '0'),
          ],
          paint: {
            'fill-color': [
              'rgba',
              0,
              ['*', ['/', ['feature-state', 'dem_mrgin'], maxValue], 255],
              0,
              0.9,
            ],
          },
        },
        'waterway-label',
      );

      // this.props.geography.result.state !== 17 && this.enableHover();
      // this.map.addControl(new mapboxgl.FullscreenControl());
      if (this.map.isSourceLoaded('counties')) {
        this.setStates({ sourceId: 'counties', isSourceLoaded: true });
      } else {
        this.map.on('sourcedata', this.setStates);
      }
    });
  };

  enableHover = () => {
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['dem-margin'],
      });
      if (features.length > 0) {
        const feature = features[0];
        this.props.getHoverInfo(
          feature.properties.NAME,
          feature.properties.county_r_1,
          feature.properties.county_res,
          feature.properties.county_r_4,
          feature.properties.county_r_3,
        );
        this.map.setFilter('county-hover-line', ['==', 'GEOID', feature.properties.GEOID]);
        this.map.getCanvas().style.cursor = 'pointer';
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.map.setFilter('county-hover-line', ['==', 'GEOID', '']);
        this.props.resetHover();
      }
    });
  };

  // addResultsLayer = () => {

  // };

  setStates = e => {
    if (e.sourceId === 'counties' && e.isSourceLoaded) {
      this.map.off('sourcedata', this.setStates);
      this.props.countyResults.result.forEach(resultId =>
        this.map.setFeatureState(
          {
            source: 'counties',
            sourceLayer: 'cb_2017_us_county_5m-2n1v3o',
            id: this.props.countyResults.entities.results[resultId].fips,
          },
          this.props.countyResults.entities.results[resultId],
        ),
      );
    }
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      minHeight: 400,
      // 'touch-action': 'none',
    };
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

const mapDispatchToProps = dispatch => ({
  setMapDetails: details => dispatch(setMapDetails(details)),
  getHoverInfo: (countyName, demMargin, demVotes, gopMargin, gopVotes) =>
    dispatch(getHoverInfo(countyName, demMargin, demVotes, gopMargin, gopVotes)),
  resetHover: () => dispatch(resetHover()),
  resetMapDetails: () => dispatch(resetMapDetails()),
});

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  countyResults: state.results.countyResults,
  candidates: state.results.candidates,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapTest);
