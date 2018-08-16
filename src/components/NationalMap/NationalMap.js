import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import { setActiveState } from '../../redux/actions/stateActions';
import setActive from '../../redux/actions/navActions';
import { getHoverInfo, resetHover, hideHeader, showHeader } from '../../redux/actions/mapActions';
import { fetchStateData } from '../../redux/actions/resultActions';
import ResponsiveNav from '../Nav/ResponsiveNav';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NationalMap extends React.Component {
  componentDidMount() {
    this.createMap();
    this.props.showHeader();
    this.props.setActive('national map');
  }

  componentDidUpdate(prevProps) {
    if (this.props.offices.selectedOfficeId !== prevProps.offices.selectedOfficeId) {
      this.map.removeLayer('dem-statewide-margin');
      this.map.removeLayer('dem-county-margin');
      this.map.removeLayer('state-lines');
      this.map.removeLayer('county-hover-line');
      this.map.removeLayer('state-hover-line');
      this.map.removeSource('countyResults');
      this.map.removeSource('statewideResults');
      this.map.removeSource('counties');
      this.addResultsLayer();
    }
  }

  componentWillUnmount() {
    this.map.remove();
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
      // this.enableHover();
      this.map.addControl(new mapboxgl.FullscreenControl());
      // this.map.on('movestart', () => this.props.hideHeader());
      // this.map.on('moveend', () => this.props.showHeader());
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
        if (feature.layer.id === 'dem-county-margin') {
          this.map.setFilter('county-hover-line', ['==', 'GEOID', feature.properties.GEOID]);
          this.props.getHoverInfo(
            feature.properties.NAME,
            feature.properties.county_r_1,
            feature.properties.county_res,
            feature.properties.county_r_4,
            feature.properties.county_r_3,
            true,
            false,
          );
        } else if (feature.layer.id === 'dem-statewide-margin') {
          this.map.setFilter('state-hover-line', ['==', 'STATEFP', feature.properties.STATEFP]);
          this.props.getHoverInfo(
            feature.properties.NAME,
            feature.properties.statewid_1,
            feature.properties.statewide_,
            feature.properties.statewid_4,
            feature.properties.statewid_3,
            true,
            true,
          );
        }
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.map.setFilter('state-hover-line', ['==', 'STATEFP', '']);
        this.map.setFilter('county-hover-line', ['==', 'GEOID', '']);
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
        const coords = e.lngLat;
        const state = this.props.states.states.find(
          state => state.attributes.name === features[0].properties.NAME,
        );
        this.setStateOnClick(state, coords);
      }
    });
  };

  setStateOnClick = (state, coords) => {
    this.props.fetchStateData(state.id);
    this.map.flyTo({
      center: coords,
      zoom: 6,
      speed: 0.75,
    });
    this.map.on('moveend', () => this.props.setActiveState(state.id, false));
  };

  addResultsLayer = () => {
    const zoomThreshold = 4.2;
    this.map.addSource('countyResults', {
      url: `mapbox://adamcohn.${
        this.props.offices.offices.find(
          office => office.id === this.props.offices.selectedOfficeId.toString(),
        ).attributes['county-map']
      }`,
      type: 'vector',
    });

    this.map.addSource('statewideResults', {
      url: `mapbox://adamcohn.${
        this.props.offices.offices.find(
          office => office.id === this.props.offices.selectedOfficeId.toString(),
        ).attributes['state-map']
      }`,
      type: 'vector',
    });

    this.map.addLayer(
      {
        id: 'dem-statewide-margin',
        type: 'fill',
        source: 'statewideResults',
        maxzoom: zoomThreshold,
        'source-layer': 'cb_2017_us_state_500k',
        paint: {
          'fill-outline-color': '#696969',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'dem_margin'],
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
        source: 'countyResults',
        minzoom: zoomThreshold,
        'source-layer': 'cb_2017_us_county_500k',
        filter: ['!=', ['get', 'STATEFP'], 15],
        paint: {
          'fill-outline-color': '#696969',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'dem_margin'],
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

    this.map.addLayer(
      {
        id: 'state-lines',
        type: 'line',
        source: 'statewideResults',
        minzoom: zoomThreshold,
        'source-layer': 'cb_2017_us_state_500k',
        paint: {
          'line-width': 0.5,
          'line-color': '#696969',
          'line-opacity': 0.8,
        },
      },
      'waterway-label',
    );

    const mapFeatures = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'statewideResults',
      })
      .filter(
        feature => feature.properties.STATEFP !== '15' && feature.properties.STATEFP !== '02',
      );
    this.map.addSource('counties', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapFeatures,
      },
    });

    this.map.addLayer(
      {
        id: 'county-hover-line',
        type: 'line',
        source: 'countyResults',
        minzoom: zoomThreshold,
        'source-layer': 'cb_2017_us_county_500k',
        filter: ['==', 'GEOID', ''],
        paint: {
          'line-width': 2,
          'line-color': '#696969',
          'line-opacity': 1,
        },
      },
      'waterway-label',
    );

    this.map.addLayer(
      {
        id: 'state-hover-line',
        type: 'line',
        source: 'statewideResults',
        maxzoom: zoomThreshold,
        'source-layer': 'cb_2017_us_state_500k',
        filter: ['==', 'STATEFP', ''],
        paint: {
          'line-width': 2,
          'line-color': '#696969',
          'line-opacity': 1,
        },
      },
      'waterway-label',
    );

    // const boundingBox = bbox(this.map.getSource('counties')._data);
    // this.map.fitBounds(boundingBox, { padding: 20, animate: false });
    this.map.moveLayer('dem-county-margin', 'poi-parks-scalerank2');
    this.map.moveLayer('county-hover-line', 'poi-parks-scalerank2');
    this.map.moveLayer('state-hover-line', 'poi-parks-scalerank2');
    this.map.moveLayer('state-lines', 'poi-parks-scalerank2');
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      // height: '100%',
      minHeight: '90vh',
      // 'touch-action': 'none',
    };
    return (
      <ResponsiveNav>
        <div style={style} ref={el => (this.mapContainer = el)} />
      </ResponsiveNav>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActiveState: (id, fetch) => dispatch(setActiveState(id, fetch)),
  getHoverInfo: (countyName, demMargin, demVotes, gopMargin, gopVotes, isNational) =>
    dispatch(getHoverInfo(countyName, demMargin, demVotes, gopMargin, gopVotes, isNational)),
  resetHover: () => dispatch(resetHover()),
  fetchStateData: id => dispatch(fetchStateData(id)),
  hideHeader: () => dispatch(hideHeader()),
  showHeader: () => dispatch(showHeader()),
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMap);
