import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import findTopCandidates from '../functions/findTopCandidates';
import CountyPopup from './countyPopup';
import { setMapDetails } from '../../redux/actions/resultActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class Map extends React.Component {
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
      zoom: 5,
      //grabs the lat long from the first county in the state to ensure the counties layer is loading the right geos
      center: this.getCoords(),
    });

    this.map.on('load', () => {
      this.addResultsLayer();
      this.enableHover();
    });
  };

  setTooltip(features) {
    if (features.length) {
      ReactDOM.render(
        React.createElement(CountyPopup, {
          features,
        }),
        this.tooltipContainer,
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
  }

  enableHover = () => {
    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [0, 60],
    })
      .setLngLat([0, 0])
      .addTo(this.map);

    this.map.on('mousemove', 'dem-margin', e => {
      const features = this.map.queryRenderedFeatures(e.point);
      tooltip.setLngLat(e.lngLat);
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
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
    const stateCounties = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'cb_2017_us_county_500k-7qwbcn',
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
      console.log(county, result);
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
    //   this.map.addSource('countyLines', {
    //     url: 'mapbox://adamcohn.4rxuwfht',
    //     type: 'vector',
    //   });

    //   this.map.addLayer(
    //     {
    //       id: 'states-join',
    //       type: 'line',
    //       source: 'countyLines',
    //       'source-layer': 'cb_2017_us_county_5m-2n1v3o',
    //       filter: [
    //         '==',
    //         'STATEFP',
    //         this.props.geography.entities.state[this.props.geography.result.state].fips,
    //       ],
    //       paint: {
    //         'line-color': '#ff69b4',
    //         'line-width': 1,
    //       },
    //     },
    //     'waterway-label',
    //   );

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
    const boundingBox = bbox(this.map.getSource('results')._data);
    this.map.fitBounds(boundingBox, { padding: 10, animate: false });
    this.map.moveLayer('dem-margin', 'poi-parks-scalerank2');
    const mapDetails = {
      center: this.map.getCenter(),
      zoom: this.map.getZoom(),
      bbox: boundingBox,
    };
    this.props.setMapDetails(mapDetails);
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

const mapDispatchToProps = dispatch => ({
  setMapDetails: details => dispatch(setMapDetails(details)),
});

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  candidates: state.results.candidates,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
