import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import findTopCandidates from '../functions/findTopCandidates';
import CountyPopup from './countyPopup';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class CountyMap extends React.Component {
  componentDidMount() {
    this.tooltipContainer = document.createElement('div');
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
      zoom: 8,
      //grabs the lat long from the first county in the state to ensure the counties layer is loading the right geos
      center: [
        this.props.geography.entities.counties[this.props.precinctResults.county_id].longitude,
        this.props.geography.entities.counties[this.props.precinctResults.county_id].latitude,
      ],
    });

    this.map.on('load', () => {
      this.addResultsLayer();
    });
  };

  makeDataLayer = () => {
    let demCandidate;
    let gopCandidate;
    findTopCandidates(this.props.candidates, this.props.electionResults).forEach(candidateId => {
      if (
        this.props.candidates.entities.candidates[candidateId].attributes.party === 'democratic'
      ) {
        demCandidate = candidateId;
      } else if (
        this.props.candidates.entities.candidates[candidateId].attributes.party === 'republican'
      ) {
        gopCandidate = candidateId;
      }
    });
    //finds the county layer, filters counties with matching fips, matches results from state
    const fips = this.props.geography.entities.counties[this.props.precinctResults.county_id].fips;
    const stateCounties = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'cb_2017_us_county_500k-7qwbcn',
      })
      .slice()
      .filter(county => fips === parseInt(county.properties.GEOID, 0));

    const countyResults = this.props.electionResults.result.map(countyId => ({
      fips: this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
        .toString()
        .padStart(5, '0'),
      results: this.props.electionResults.entities.results[this.props.precinctResults.county_id]
        .results,
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
          -0.3,
          '#ef8a62',
          0,
          '#f7f7f7',
          0.3,
          '#67a9cf',
        ],
        'fill-opacity': 1,
      },
    });
    this.map.fitBounds(this.props.boundingBox, { padding: 40, animate: false });
    this.map.moveLayer('dem-margin', 'waterway-river-canal');
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
  precinctResults: state.results.precinctResults,
  boundingBox: state.results.boundingBox,
});

export default connect(mapStateToProps)(CountyMap);
