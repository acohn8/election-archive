import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import union from '@turf/union';

import { pushToNewState } from '../../redux/actions/stateActions';
import {
  addLayer,
  addSource,
  removeSource,
  removeLayer,
  getHoverInfo,
  resetHover,
  hideHeader,
  showHeader,
} from '../../redux/actions/mapActions';
import { setActiveDistrict, fetchStateOffices } from '../../redux/actions/officeActions';
import { fetchStateData } from '../../redux/actions/resultActions';
import { setStateId, getStateData } from '../../redux/actions/stateActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class ResultsMap extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjld3m3g66xlb2sl2ojc73n5v',
    });
    this.createMap();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.offices.selectedOfficeId !== prevProps.offices.selectedOfficeId &&
      this.props.activeItem === prevProps.activeItem
    ) {
      this.removeLayers();
      this.removeSources();
      this.addLayers();
    }
    if (this.map === undefined) {
      this.createMap();
    }
  }

  componentWillUnmount() {
    this.removeLayers();
    this.removeSources();
    this.props.resetHover();
    this.map.remove();
  }

  createMap = () => {
    this.map.on('load', () => {
      this.addLayers();
      this.map.addControl(new mapboxgl.FullscreenControl());
      this.map.addControl(new mapboxgl.NavigationControl());
      if (this.props.activeItem === 'national map') {
        this.props.windowWidth >= 768 && this.map.on('movestart', () => this.props.hideHeader());
        this.props.windowWidth >= 768 && this.map.on('moveend', () => this.props.showHeader());
      }
    });
  };

  addLayers = () => {
    const geographies = this.props.geographies;
    const nonPrecinctGeographies = geographies.filter(geography => geography.name !== 'precinct');
    this.addSources(geographies);
    this.addFillLayers(geographies);
    this.addLineLayers(geographies);
    if (!this.props.countyMap) {
      this.addHoverLayers(geographies);
      this.map.on('mousemove', e => this.enableHover(e));
    }
    if (this.props.clickToNavigate) {
      this.map.on('click', e => this.stateSelection(e));
    }
    if (this.props.hideHeaderOnPrecincts) {
      this.map.on('zoom', this.hideHeaderOnPrecinct);
    }
    if (this.props.mapFilter) {
      this.setGeographyFilter(this.props.mapFilter.property, this.props.mapFilter.value);
      this.bindToMap(
        nonPrecinctGeographies[0],
        this.props.mapFilter.property,
        this.props.mapFilter.value,
      );
    } else {
      this.bindToMap(nonPrecinctGeographies[0]);
    }
  };

  removeLayers = () => {
    this.props.savedLayers.forEach(layer => {
      this.props.removeLayer(layer);
      if (this.map.getLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });
  };

  removeSources = () => {
    this.props.savedSources.forEach(source => {
      this.props.removeSource(source);
      if (this.map.getSource(source)) {
        this.map.removeSource(source);
      }
    });
  };

  getRenderedFeatures = (layers, point) => {
    return this.map.queryRenderedFeatures(point, {
      layers: layers,
    });
  };

  enableHover = e => {
    if (!this.map.loaded()) {
      return;
    }
    this.props.geographies.forEach(geography => {
      const features = this.getRenderedFeatures([`${geography.name}Fill`], e.point);
      if (features.length > 0) {
        this.map.getCanvas().style.cursor = 'pointer';
        const feature = features[0];
        if (
          (feature.layer.source === 'state' && feature.properties[geography.filter].length > 0) ||
          (feature.layer.source === 'congressionalDistrict' &&
            feature.properties[geography.filter].length > 0)
        ) {
          this.filterTopHover(geography, feature);
        } else if (
          feature.layer.source === 'county' &&
          feature.properties[geography.filter].length > 0
        ) {
          this.filterSubGeographyHover(geography, feature);
        }
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        geography.sourceLayer === 'cb_2017_us_state_500k' ||
        geography.sourceLayer === 'cb_2017_us_cd115_500k'
          ? this.resetTopFilter(geography)
          : this.resetSubGeoFilter(geography);
      }
    });
  };

  resetTopFilter = geography => {
    if (this.map.getLayer(`${geography.name}Hover`)) {
      this.map.setFilter(`${geography.name}Hover`, ['==', geography.filter, '']);
    }
  };

  resetSubGeoFilter = geography => {
    if (this.map.getSource(`${geography.name}Hover`)) {
      this.map.getSource(`${geography.name}Hover`).setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  };

  filterTopHover = (geography, feature) => {
    this.map.setFilter(`${geography.name}Hover`, [
      '==',
      geography.filter,
      feature.properties[geography.filter],
    ]);
    this.addGeographyInfoToOverlay(feature);
  };

  filterSubGeographyHover = (geography, feature) => {
    const dataFeature = feature;
    const sourceFeatures = this.map.querySourceFeatures('composite', {
      sourceLayer: geography.sourceLayer,
      filter: ['==', geography.filter, feature.properties[geography.filter]],
    });
    if (sourceFeatures.length > 1) {
      feature = sourceFeatures[0];
      for (let i = 1; i < sourceFeatures.length; i++) {
        feature = union(feature, sourceFeatures[i]);
      }
      feature.properties = dataFeature.properties;
    }
    this.map.getSource(`${geography.name}Hover`).setData(feature);
    this.addGeographyInfoToOverlay(dataFeature);
  };

  hideHeaderOnPrecinct = () => {
    const nonPrecinctGeography = this.props.geographies.find(geo => geo.name !== 'precinct');
    if (this.map.getZoom() > nonPrecinctGeography.maxzoom) {
      this.props.resetHover();
    }
  };

  addGeographyInfoToOverlay = feature => {
    this.props.getHoverInfo(
      feature.properties.NAME,
      feature.properties.winner_name,
      feature.properties.winner_party,
      feature.properties.winner_margin,
      feature.properties.winner_votes,
      feature.properties.second_name,
      feature.properties.second_party,
      feature.properties.second_margin,
      feature.properties.second_votes,
      feature.layer.source,
      this.props.activeItem === 'national map',
    );
  };

  getClickLayer = () => {
    if (this.props.geographies.length > 1) {
      return this.props.geographies.find(geo => geo.name === 'state');
    } else {
      return this.props.geographies.find(geo => geo.name === 'congressionalDistrict');
    }
  };

  stateSelection = e => {
    const clickLayer = this.getClickLayer();
    const features = this.getRenderedFeatures([`${clickLayer.name}Fill`], e.point);
    if (features.length) {
      const state = this.getStateName(features[0]);
      const district = this.getDistrictId(features[0]);
      if (district !== 0) {
        this.setStateOnClick(state, district);
      }
    }
  };

  getDistrictId = feature => {
    if (this.props.offices.selectedOfficeId === '322') {
      return feature.properties.id;
    } else {
      return null;
    }
  };

  getStateName = feature => {
    if (this.props.offices.selectedOfficeId === '322') {
      return this.props.states.states.find(
        state =>
          state.attributes['short-name'].toLowerCase() ===
          feature.properties.NAME.split('-')[0].toLowerCase(),
      );
    } else {
      return this.props.states.states.find(
        state =>
          state.attributes['short-name'].toLowerCase() === feature.properties.STUSPS.toLowerCase(),
      );
    }
  };

  setStateOnClick = (state, districtId) => {
    this.props.setStateId(state.id);
    this.props.getStateData(state.id);
    this.props.fetchStateOffices(state.id);
    if (districtId) {
      this.props.setActiveDistrict(districtId);
    }
    this.props.fetchStateData(state.id, districtId);
    this.props.pushToNewState(state.id);
  };

  getUrl = geography => {
    if (geography.name === 'precinct') {
      return geography.url;
    } else {
      return this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
        .attributes[geography.layer];
    }
  };

  addSources = geographies => {
    geographies.forEach(geography => {
      this.map.addSource(geography.name, {
        url: `mapbox://adamcohn.${this.getUrl(geography)}`,
        type: 'vector',
      });
      this.props.addSource(geography.name);
    });
  };

  addFillLayers = geographies => {
    geographies.forEach(geography => {
      this.map.addLayer(
        {
          id: `${geography.name}Fill`,
          minzoom: geography.minzoom,
          maxzoom: geography.maxzoom,
          type: 'fill',
          source: geography.name,
          'source-layer': geography.sourceLayer,
          paint: geography.colorScale,
        },
        'waterway-label',
      );
      this.props.addLayer(`${geography.name}Fill`);
      this.map.moveLayer(`${geography.name}Fill`, 'poi-parks-scalerank2');
    });
  };

  addLineLayers = geographies => {
    geographies.sort((a, b) => a.order - b.order).forEach(geography => {
      this.map.addLayer(
        {
          id: `${geography.name}Line`,
          minzoom: geography.minzoom,
          maxzoom: geography.maxzoom,
          type: 'line',
          source: geography.name,
          'source-layer': geography.sourceLayer,
          paint: {
            'line-width': geography.name === 'state' ? 0.7 : 0.3,
            'line-color': '#696969',
            'line-opacity': 0.6,
          },
        },
        'waterway-label',
      );
      this.props.addLayer(`${geography.name}Line`);
      this.map.moveLayer(`${geography.name}Line`, 'poi-parks-scalerank2');
    });
  };

  setGeographyFilter = (property, value) => {
    let layersToFilter;
    if (this.props.countyMap) {
      layersToFilter = this.props.savedLayers;
    } else {
      layersToFilter = this.props.savedLayers.filter(layer => !layer.includes('precinct'));
    }

    layersToFilter.forEach(layer => {
      if (this.map.getLayer(layer)) {
        this.map.setFilter(layer, ['==', property, value]);
      }
    });
  };

  addHoverLayers = geographies => {
    geographies.forEach(geography => {
      if (
        geography.sourceLayer === 'cb_2017_us_state_500k' ||
        geography.sourceLayer === 'cb_2017_us_cd115_500k'
      ) {
        this.map.addLayer(
          {
            id: `${geography.name}Hover`,
            type: 'line',
            minzoom: geography.minzoom,
            maxzoom: geography.maxzoom,
            source: geography.name,
            'source-layer': geography.sourceLayer,
            filter: ['==', geography.filter, ''],
            paint: {
              'line-width': 2,
              'line-color': '#696969',
              'line-opacity': 1,
            },
          },
          'waterway-label',
        );
        this.props.addLayer(`${geography.name}Hover`);
      } else {
        this.map.addSource(`${geography.name}Hover`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
        this.props.addSource(`${geography.name}Hover`);
        this.map.addLayer({
          id: `${geography.name}Hover`,
          source: `${geography.name}Hover`,
          minzoom: geography.minzoom,
          maxzoom: geography.maxzoom,
          type: 'line',
          paint: {
            'line-width': 2,
            'line-color': '#696969',
            'line-opacity': 1,
          },
        });
        this.props.addLayer(`${geography.name}Hover`);
      }
      this.map.moveLayer(`${geography.name}Hover`, 'place-islands');
    });
  };

  filterGeojson = (layer, property, value = null) => {
    const boundsLayer = this.map.querySourceFeatures('composite', {
      sourceLayer: layer.sourceLayer,
    });
    if (value === null) {
      const filterfips = ['02', '14', '60', '66', '78', '72', '15', '69', '68'];
      return boundsLayer.filter(geo => !filterfips.includes(geo.properties[property]));
    } else {
      return boundsLayer.filter(geo => geo.properties[property] === value);
    }
  };

  bindToMap = (layer, property = 'STATEFP', value = null) => {
    const features = this.filterGeojson(layer, property, value);
    this.map.addSource('bounds', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features,
      },
    });
    this.props.addSource('bounds');
    const boundingBox = bbox(this.map.getSource('bounds')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      minHeight: this.props.minHeight,
    };
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

const mapDispatchToProps = dispatch => ({
  getHoverInfo: (
    geographyName,
    winnerName,
    winnerParty,
    winnerMargin,
    winnerVotes,
    secondName,
    secondParty,
    secondMargin,
    secondVotes,
    layer,
    isNational,
  ) =>
    dispatch(
      getHoverInfo(
        geographyName,
        winnerName,
        winnerParty,
        winnerMargin,
        winnerVotes,
        secondName,
        secondParty,
        secondMargin,
        secondVotes,
        layer,
        isNational,
      ),
    ),
  resetHover: () => dispatch(resetHover()),
  fetchStateData: (stateId, districtId) => dispatch(fetchStateData(stateId, districtId)),
  hideHeader: () => dispatch(hideHeader()),
  showHeader: () => dispatch(showHeader()),
  pushToNewState: stateId => dispatch(pushToNewState(stateId)),
  setActiveDistrict: districtId => dispatch(setActiveDistrict(districtId)),
  setStateId: stateId => dispatch(setStateId(stateId)),
  fetchStateOffices: stateId => dispatch(fetchStateOffices(stateId)),
  addLayer: layer => dispatch(addLayer(layer)),
  addSource: source => dispatch(addSource(source)),
  removeLayer: layer => dispatch(removeLayer(layer)),
  removeSource: source => dispatch(removeSource(source)),
  getStateData: stateId => dispatch(getStateData(stateId)),
});

const mapStateToProps = state => ({
  states: state.states,
  offices: state.offices,
  windowWidth: state.nav.windowWidth,
  activeItem: state.nav.activePage,
  savedLayers: state.maps.layers,
  savedSources: state.maps.sources,
  stateFips: state.results.stateFips,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsMap);
