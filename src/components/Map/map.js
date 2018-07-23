import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class Map extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjjyfk3es0nfj2rqpf9j53505',
      zoom: 5.7,
      center: [-77.48, 41.082],
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
      .filter(feature => feature.properties.STATEFP === '42');
    const countyResults = this.props.electionResults.result.map(countyId => ({
      fips: this.props.geography.entities.counties[countyId].fips,
      results: this.props.electionResults.entities.results[countyId].results,
    }));
    stateCounties.map(county => {
      const result = countyResults.find(
        countyResult => countyResult.fips === parseInt(county.properties.GEOID),
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
    console.log(stateCounties);
    return stateCounties;
  };

  addResultsLayer = () => {
    this.map.addLayer({
      id: 'results',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.makeDataLayer(),
        },
      },
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'clintonMargin'],
          -1,
          'red',
          0,
          'white',
          1,
          'blue',
        ],
        'fill-opacity': 0.8,
      },
    });
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
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  electionResults: state.results.electionResults,
});

export default connect(mapStateToProps)(Map);
