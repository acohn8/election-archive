import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import { getHoverInfo, setMapDetails } from '../../redux/actions/mapActions';

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

  enableHover = () => {
    this.map.on('mousemove', 'dem-margin', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['dem-margin'],
      });
      if (features.length) {
        const feature = features[0];
        this.props.getHoverInfo(
          feature.properties.NAME,
          feature.properties.county_r_1,
          feature.properties.county_res,
          feature.properties.county_r_4,
          feature.properties.county_r_3,
        );
      }
    });
  };

  addResultsLayer = () => {
    this.map.addSource('presResults', {
      url: 'mapbox://adamcohn.019zfefq',
      type: 'vector',
    });

    this.map.addLayer(
      {
        id: 'dem-margin',
        type: 'fill',
        source: 'presResults',
        'source-layer': '2016_pres-asczpp',
        filter: [
          '==',
          ['get', 'STATEFP'],
          this.props.geography.entities.state[this.props.geography.result.state].fips
            .toString()
            .padStart(2, '0'),
        ],

        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'county_r_2'],
            -0.3,
            '#d6604d',
            -0.2,
            '#f4a582',
            -0.1,
            '#fddbc7',
            0.0,
            '#f7f7f7',
            0.1,
            '#d1e5f0',
            0.2,
            '#92c5de',
            0.3,
            '#4393c3',
          ],
          'fill-opacity': 0.7,
        },
      },
      'waterway-label',
    );

    const mapFeatures = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'cb_2017_us_county_500k-7qwbcn',
      })
      .filter(
        county =>
          county.properties.STATEFP ===
          this.props.geography.entities.state[this.props.geography.result.state].fips
            .toString()
            .padStart(2, '0'),
      );

    this.map.addSource('counties', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapFeatures,
      },
    });

    const boundingBox = bbox(this.map.getSource('counties')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
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
  getHoverInfo: (countyName, demMargin, demVotes, gopMargin, gopVotes) =>
    dispatch(getHoverInfo(countyName, demMargin, demVotes, gopMargin, gopVotes)),
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
