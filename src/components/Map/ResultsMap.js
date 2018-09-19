import bbox from '@turf/bbox';
import union from '@turf/union';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  addLayer,
  addSource,
  getHoverInfo,
  removeLayer,
  removeSource,
  resetHover,
} from '../../redux/actions/mapActions';
import { stateOutline, subGeographyOutline, hoverOutline } from '../../util/ColorScale';
import formatMapOverlayInfo from '../../util/FormatMapOverlayInfo';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class ResultsMap extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjld3m3g66xlb2sl2ojc73n5v',
      zoom: 3,
      center: [-98.5795, 39.8283],
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
      this.loadLayers();
    }
    if (this.map === undefined) {
      this.createMap();
    }
    if (this.props.height !== prevProps.height) {
      this.map.resize();
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
      this.loadLayers();
      this.map.addControl(new mapboxgl.NavigationControl());
    });
  };

  loadLayers = () => {
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
    const allRenderedLayers = this.props.geographies.map(geography => `${geography.name}Fill`);
    this.props.geographies.forEach(geography => {
      const features = this.getRenderedFeatures([`${geography.name}Fill`], e.point);
      if (this.getRenderedFeatures([`${geography.name}Fill`], e.point).length > 0) {
        const feature = features[0];
        if (feature.layer.source === 'state' || feature.layer.source === 'congressionalDistrict') {
          this.filterTopHover(geography, feature);
        } else if (feature.layer.source === 'county') {
          this.filterSubGeographyHover(geography, feature);
        }
      } else if (!this.getRenderedFeatures(allRenderedLayers, e.point).length) {
        this.map.getCanvas().style.cursor = '';
        this.props.resetHover();
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
    this.map.getCanvas().style.cursor = 'pointer';
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
    this.map.getCanvas().style.cursor = '';
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
    const isNational = this.props.activeItem === 'national map';
    const overlayInfo = formatMapOverlayInfo(feature, isNational);
    this.props.getHoverInfo(overlayInfo);
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
      return feature.properties.NAME.toLowerCase();
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
    const statePath = state.attributes.name
      .split(' ')
      .join('-')
      .toLowerCase();
    const officePath = this.props.offices.allOffices.entities.offices[
      this.props.offices.selectedOfficeId
    ].attributes.name
      .split(' ')
      .join('-')
      .toLowerCase();
    if (!districtId) {
      this.props.history.push(`states/${statePath}/${officePath}`);
    } else {
      const districtPath = districtId.toLowerCase();
      this.props.history.push(`states/${statePath}/${officePath}/${districtPath}`);
    }
  };

  getUrl = geography => {
    if (geography.name === 'precinct') {
      return geography.url;
    } else {
      return this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
        .attributes[geography.layer];
    }
  };

  addNewLayer = (geography, layerId, type, layerStyle, subGeoHover = false) => {
    this.map.addLayer(
      {
        id: layerId,
        minzoom: geography.minzoom,
        maxzoom: geography.maxzoom,
        type: type,
        source: !subGeoHover ? geography.name : layerId,
        'source-layer': !subGeoHover ? geography.sourceLayer : '',
        paint: layerStyle,
      },
      'waterway-label',
    );
    this.props.addLayer(layerId);
    this.map.moveLayer(layerId, 'poi-parks-scalerank2');
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

  addGeoJsonSource = (layerId, features) => {
    this.map.addSource(layerId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features,
      },
    });
    this.props.addSource(layerId);
  };

  addFillLayers = geographies => {
    geographies.forEach(geography =>
      this.addNewLayer(geography, `${geography.name}Fill`, 'fill', geography.fillColorScale),
    );
  };

  addLineLayers = geographies => {
    geographies.sort((a, b) => a.order - b.order).forEach(geography => {
      if (geography.name === 'state') {
        this.addNewLayer(geography, `${geography.name}Line`, 'line', stateOutline);
      } else {
        this.addNewLayer(geography, `${geography.name}Line`, 'line', subGeographyOutline);
      }
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
      if (
        this.map.getLayer(layer) &&
        this.props.countyMap &&
        this.props.states.activeStateId === '14'
      ) {
        //temporary fix for mn layer
        this.map.setFilter(layer, ['==', property, parseInt(value, 10)]);
      } else if (this.map.getLayer(layer)) {
        this.map.setFilter(layer, ['==', property, value]);
      }
    });
  };

  addHoverLayers = geographies => {
    geographies.forEach(geography => {
      const layerId = `${geography.name}Hover`;
      if (
        geography.sourceLayer === 'cb_2017_us_state_500k' ||
        geography.sourceLayer === 'cb_2017_us_cd115_500k'
      ) {
        this.addNewLayer(geography, layerId, 'line', hoverOutline);
        this.map.setFilter(layerId, ['==', geography.filter, '']);
      } else {
        this.addGeoJsonSource(layerId, []);
        this.addNewLayer(geography, layerId, 'line', hoverOutline, true);
      }
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
    this.addGeoJsonSource('bounds', features);
    const boundingBox = bbox(this.map.getSource('bounds')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      height: this.props.height,
    };
    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

const mapDispatchToProps = dispatch => ({
  getHoverInfo: mapInfo => dispatch(getHoverInfo(mapInfo)),
  resetHover: () => dispatch(resetHover()),
  addLayer: layer => dispatch(addLayer(layer)),
  addSource: source => dispatch(addSource(source)),
  removeLayer: layer => dispatch(removeLayer(layer)),
  removeSource: source => dispatch(removeSource(source)),
});

const mapStateToProps = state => ({
  states: state.states,
  offices: state.offices,
  activeItem: state.nav.activePage,
  savedLayers: state.maps.layers,
  savedSources: state.maps.sources,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ResultsMap),
);
