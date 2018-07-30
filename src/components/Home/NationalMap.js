import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import { push } from 'connected-react-router';

import { setActiveState } from '../../redux/actions/stateActions';
import { getHoverInfo, setMapDetails, resetHover } from '../../redux/actions/mapActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NationalMap extends React.Component {
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
      zoom: 3.5,
      center: [-98.585522, 39.8333333],
    });

    this.map.on('load', () => {
      this.addResultsLayer();
      this.stateSelection();
      this.enableHover();
    });
  };

  enableHover = () => {
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['dem-county-margin', 'dem-statewide-margin'],
      });
      if (features.length > 0) {
        const feature = features[0];
        this.map.getCanvas().style.cursor = 'pointer';
        if (feature.layer.id !== 'dem-statewide-margin') {
          this.props.getHoverInfo(
            feature.properties.NAME,
            feature.properties.county_r_1,
            feature.properties.county_res,
            feature.properties.county_r_4,
            feature.properties.county_r_3,
          );
        }
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.props.resetHover();
      }
    });
  };

  stateSelection = () => {
    this.map.on('click', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['dem-statewide-margin'],
      });
      if (features.length) {
        const state = this.props.states.states.find(
          state => state.attributes.name === features[0].properties.NAME,
        ).id;
        this.props.setActiveState(state);
      }
    });
  };

  addResultsLayer = () => {
    const zoomThreshold = 4;
    this.map.addSource('countyPresResults', {
      url: 'mapbox://adamcohn.7bxery92',
      type: 'vector',
    });

    this.map.addSource('statewidePresResults', {
      url: 'mapbox://adamcohn.bhhjwsxl',
      type: 'vector',
    });

    this.map.addLayer(
      {
        id: 'dem-statewide-margin',
        type: 'fill',
        source: 'statewidePresResults',
        maxzoom: zoomThreshold,
        'source-layer': '2016_statewide_results-bui81z',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'statewid_2'],
            -0.05,
            '#d6604d',
            -0.01,
            '#f4a582',
            0.0,
            '#f7f7f7',
            0.01,
            '#92c5de',
            0.05,
            '#4393c3',
          ],
          'fill-opacity': 0.7,
        },
      },
      'waterway-label',
    );

    this.map.addLayer(
      {
        id: 'dem-county-margin',
        type: 'fill',
        source: 'countyPresResults',
        minzoom: zoomThreshold,
        'source-layer': '2016_county_results-5wvgz3',
        filter: ['!=', ['get', 'STATEFP'], 15],

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
        feature => feature.properties.STATEFP !== '15' && feature.properties.STATEFP !== '02',
      );
    console.log(mapFeatures);
    this.map.addSource('counties', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapFeatures,
      },
    });

    const boundingBox = bbox(this.map.getSource('counties')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
    this.map.moveLayer('dem-county-margin', 'poi-parks-scalerank2');
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      minWidth: 100,
      minHeight: 600,
    };
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

const mapDispatchToProps = dispatch => ({
  setActiveState: id => dispatch(setActiveState(id)),
  setMapDetails: details => dispatch(setMapDetails(details)),
  getHoverInfo: (countyName, demMargin, demVotes, gopMargin, gopVotes) =>
    dispatch(getHoverInfo(countyName, demMargin, demVotes, gopMargin, gopVotes)),
  resetHover: () => dispatch(resetHover()),
});

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMap);
