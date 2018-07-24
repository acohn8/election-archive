import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class Map extends React.Component {
  componentDidMount() {
    this.createMap();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.map.remove();
      this.createMap();
    }
  }

  createMap = () => {
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
  };

  makeDataLayer = () => {
    const demCandidate = this.props.candidates.result.find(
      candidateId =>
        this.props.candidates.entities.candidates[candidateId].attributes.party === 'democratic',
    );
    const gopCandidate = this.props.candidates.result.find(
      candidateId =>
        this.props.candidates.entities.candidates[candidateId].attributes.party === 'republican',
    );
    //finds the county layer, filters counties with matching fips, matches results from state
    const stateCounties = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'us_counties-16cere',
      })
      .slice()
      .filter(
        feature =>
          parseInt(feature.properties.STATEFP, 0) ===
          this.props.geography.entities.state[this.props.states.activeStateId].fips,
      );
    const countyResults = this.props.electionResults.result.map(countyId => ({
      fips: this.props.geography.entities.counties[countyId].fips.toString().padStart(5, '0'),
      results: this.props.electionResults.entities.results[countyId].results,
    }));
    stateCounties.forEach(county => {
      const result = countyResults.find(
        countyResult => countyResult.fips === county.properties.GEOID,
      );
      const demMargin = parseFloat(
        (result.results[demCandidate] - result.results[gopCandidate]) /
          (result.results[demCandidate] + result.results[gopCandidate]),
      );
      const demVotes = result.results[demCandidate];
      const gopVotes = result.results[gopCandidate];
      stateCounties[stateCounties.indexOf(county)].properties.demMargin = demMargin;
      stateCounties[stateCounties.indexOf(county)].properties.demVotes = demVotes;
      stateCounties[stateCounties.indexOf(county)].properties.gopVotes = gopVotes;
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
      id: 'dem-margin',
      type: 'fill',
      source: 'results',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'demMargin'],
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
    this.map.moveLayer('dem-margin', 'poi-parks-scalerank1');
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
  candidates: state.results.candidates,
});

export default connect(mapStateToProps)(Map);
