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

  formatData = () => {
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
    const countyResults = this.props.electionResults.result.map(result => ({
      fips: this.props.geography.entities.counties[result].fips,
      demMargin:
        (this.props.electionResults.entities.results[result].results[demCandidate] /
          (this.props.electionResults.entities.results[result].results[demCandidate] +
            this.props.electionResults.entities.results[result].results[gopCandidate])) *
        100,
    }));
    return countyResults;
  };

  addResultsLayer = () => {
    this.map.addSource('counties', {
      type: 'vector',
      source: 'mapbox://adamcohn.4rxuwfht',
    });

    this.map.addLayer({
      id: 'results',
      type: 'fill',
      source: 'counties',
      sourceLayer: 'demMargin',
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

    console.log(
      this.map.querySourceFeatures('counties', {
        sourceLayer: 'counties',
      }),
    );
  };

  //   this.formatData().forEach(row => {
  //     console.log(row);
  //     this.map.addLayer(
  //       {
  //         source: 'us-counties',
  //         sourceLayer: 'cb_2017_us_county_5m-2n1v3o',
  //         GEOID: row.fips.toString(),
  //       },
  //       row,
  //     );
  //   });
  //   console.log(this.map.getStyle().layers.GEOID);
  // };

  //   this.map.addSource('results', {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: this.makeDataLayer(),
  //     },
  //   });
  //   this.map.addLayer({
  //     id: 'dem-margin',
  //     type: 'fill',
  //     source: 'results',
  //     paint: {
  //       'fill-color': [
  //         'interpolate',
  //         ['linear'],
  //         ['get', 'demMargin'],
  //         -0.3,
  //         '#ef8a62',
  //         0,
  //         '#f7f7f7',
  //         0.3,
  //         '#67a9cf',
  //       ],
  //       'fill-opacity': 1,
  //     },
  //   });
  //   const boundingBox = bbox(this.map.getSource('results')._data);
  //   this.map.fitBounds(boundingBox, { padding: 10, animate: false });
  //   this.map.moveLayer('dem-margin', 'poi-parks-scalerank2');
  //   const mapDetails = {
  //     center: this.map.getCenter(),
  //     zoom: this.map.getZoom(),
  //     bbox: boundingBox,
  //   };
  //   this.props.setMapDetails(mapDetails);
  //   console.log(mapDetails);
  // };

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

//  addResultsLayer = () => {
//   this.map.addSource('mn-votes', {
//     type: 'vector',
//     url: 'mapbox://adamcohn.5lxa6wia',
//   });

//   this.map.addLayer({
//     id: 'clinton-votes',
//     source: 'mn-votes',
//     'source-layer': 'MN-2016-a7m9cx',
//     type: 'fill',
//     paint: {
//       'fill-color': [
//         'interpolate',
//         ['linear'],
//         ['/', ['get', 'USPRSDFL'], ['get', 'USPRSTOTAL']],
//         0,
//         'red',
//         0.5,
//         'white',
//         1,
//         'blue',
//       ],
//       'fill-opacity': 0.75,
//     },
//   });
// };
