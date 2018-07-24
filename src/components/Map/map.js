import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class Map extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjjyfk3es0nfj2rqpf9j53505',
      zoom: 5,
      //grabs the lat long from the first county in the state to ensure the counties layer is loading the right geos
      center: [
        this.props.geography.entities.counties[this.props.geography.result.counties[0]].longitude,
        this.props.geography.entities.counties[this.props.geography.result.counties[0]].latitude,
      ],
    });

    this.map.on('load', () => {
      this.addResultsLayer();
    });
  }

  makeDataLayer = () => {
    const stateCounties = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'us_counties-16cere',
      })
      .slice()
      .filter(
        feature =>
          parseInt(feature.properties.STATEFP) ===
          this.props.geography.entities.state[this.props.states.activeStateId].fips,
      );
    const countyResults = this.props.electionResults.result.map(countyId => ({
      fips: this.props.geography.entities.counties[countyId].fips.toString().padStart(5, '0'),
      results: this.props.electionResults.entities.results[countyId].results,
    }));
    stateCounties.map(county => {
      const result = countyResults.find(
        countyResult => countyResult.fips === county.properties.GEOID,
      );
      const clintonMargin = parseFloat(
        (result.results[16] - result.results[10]) / (result.results[16] + result.results[10]),
      );
      const clintonVotes = result.results[16];
      const trumpVotes = result.results[10];
      stateCounties[stateCounties.indexOf(county)].properties.clintonMargin = clintonMargin;
      stateCounties[stateCounties.indexOf(county)].properties.clintonVotes = clintonVotes;
      stateCounties[stateCounties.indexOf(county)].properties.trumpVotes = trumpVotes;
    });
    return stateCounties;
  };

  addResultsLayer = () => {
    this.map.addSource('results', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.makeDataLayer(),
      },
    });
    this.map.addLayer({
      id: 'clinton-margin',
      type: 'fill',
      source: 'results',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'clintonMargin'],
          -0.7,
          'red',
          0,
          'white',
          0.7,
          'blue',
        ],
        'fill-opacity': 1,
      },
    });
    const boundingBox = bbox(this.map.getSource('results')._data);
    this.map.fitBounds(boundingBox, { padding: 10, animate: false });
    this.map.moveLayer('clinton-margin', 'poi-parks-scalerank1');
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      minHeight: 400,
    };
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(Map);
