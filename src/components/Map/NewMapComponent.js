import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import union from '@turf/union';

import { StateColorScale, CountyColorScale } from '../../functions/ColorScale';

import { pushToNewState } from '../../redux/actions/stateActions';
import {
  addLayer,
  addSource,
  removeSource,
  removeLayer,
  resetMapData,
  getHoverInfo,
  resetHover,
  hideHeader,
  showHeader,
} from '../../redux/actions/mapActions';
import { setActiveOffice, fetchStateOffices } from '../../redux/actions/officeActions';
import { fetchStateData } from '../../redux/actions/resultActions';
import { setStateId } from '../../redux/actions/stateActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NewMap extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjld3m3g66xlb2sl2ojc73n5v',
    });
    this.createMap();
  }

  componentDidUpdate(prevProps) {
    //by checking layers, we're making sure the previous map exists (otherwise it's created)
    if (
      this.props.offices.selectedOfficeId !== prevProps.offices.selectedOfficeId &&
      prevProps.layers.length > 0
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
      this.bindToMap('STATEFP');
      if (this.props.activeItem === 'national map') {
        this.props.windowWidth >= 768 && this.map.on('movestart', () => this.props.hideHeader());
        this.props.windowWidth >= 768 && this.map.on('moveend', () => this.props.showHeader());
      }
      // if (this.props.filter) {
      //   this.setFilter(['stateFill', 'countyFill', 'stateLine', 'countyLine'], 'STATEFP', '12');
      // }
    });
  };

  addLayers = () => {
    const zoomThreshold = this.props.zoomThreshold;
    const layers = this.getLayers(this.props.offices.selectedOfficeId);
    this.addSources(layers);
    this.addHoverLayers(layers, zoomThreshold);
    this.addFillLayers(layers, zoomThreshold);
    this.addLineLayers(layers, zoomThreshold);
    this.map.on('mousemove', e => this.enableHover(e));
    if (this.props.activeItem === 'national map') {
      this.map.on('click', e => this.stateSelection(e));
      this.map.off('click', e => this.stateSelection(e));
    }
  };

  removeLayers = () => {
    this.props.layers.forEach(layer => {
      if (this.map.getLayer(layer)) {
        this.map.removeLayer(layer);
        this.props.removeLayer(layer);
      }
    });
  };

  removeSources = () => {
    this.props.sources.forEach(source => {
      if (this.map.getSource(source)) {
        this.map.removeSource(source);
        this.props.removeSource(source);
      }
    });
  };

  getLayers = officeId => {
    if (officeId === '322') {
      return [
        {
          name: 'district',
          sourceLayer: 'cb_2017_us_cd115_500k',
          colorScale: StateColorScale,
          layer: 'state-map',
          filter: 'GEOID',
          order: 1,
        },
      ];
    } else {
      return [
        {
          name: 'county',
          sourceLayer: 'cb_2017_us_county_500k',
          colorScale: CountyColorScale,
          layer: 'county-map',
          filter: 'GEOID',
          order: 1,
        },
        {
          name: 'state',
          sourceLayer: 'cb_2017_us_state_500k',
          colorScale: StateColorScale,
          layer: 'state-map',
          filter: 'GEOID',
          order: 2,
        },
      ];
    }
  };

  enableHover = e => {
    if (!this.map.loaded()) {
      return;
    }
    this.getLayers(this.props.offices.selectedOfficeId).forEach(geography => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [`${geography.name}Fill`],
      });
      if (features.length > 0) {
        const feature = features[0];
        if (
          (features !== undefined && feature.layer.source === 'state') ||
          (features !== undefined && feature.layer.source === 'district')
        ) {
          this.map.getCanvas().style.cursor = 'pointer';
          this.filterTopHover(geography, feature, geography.filter);
        } else if (features !== undefined && feature.layer.source === 'county') {
          this.map.getCanvas().style.cursor = 'pointer';
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

  filterTopHover = (geography, feature, filter) => {
    this.map.setFilter(`${geography.name}Hover`, ['==', filter, feature.properties[filter]]);
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
    }
    if (sourceFeatures.length > 0) {
      this.map.getSource(`${geography.name}Hover`).setData(feature);
      this.addGeographyInfoToOverlay(dataFeature);
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
      true,
    );
  };

  getClickLayer = () => {
    const geographies = this.getLayers(this.props.offices.selectedOfficeId);
    if (geographies.length > 1) {
      return geographies.sort((a, b) => a.order - b.order)[1];
    } else {
      return geographies[0];
    }
  };

  getRenderedFeatures(layer, point) {
    return this.map.queryRenderedFeatures(point, {
      layers: [`${layer.name}Fill`],
    });
  }

  stateSelection = e => {
    if (!this.map.loaded()) {
      return;
    }
    const clickLayer = this.getClickLayer();
    const features = this.getRenderedFeatures(clickLayer, e.point);
    if (features.length) {
      const coords = e.lngLat;
      const state = this.getStateName(features[0]);
      const district = this.getDistrictId(features[0]);
      if (district !== 0) {
        this.setStateOnClick(state, coords, district);
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

  setStateOnClick = (state, coords, districtId) => {
    this.map.flyTo({
      center: coords,
      zoom: 6,
      speed: 0.75,
    });
    this.props.setStateId(state.id);
    this.props.fetchStateOffices(state.id);
    this.props.setActiveOffice(this.props.offices.selectedOfficeId, districtId);
    this.props.fetchStateData(state.id, districtId);
    this.map.on('zoomend', () => this.props.pushToNewState(state.id));
  };

  addSources = geographies => {
    geographies.forEach(geography => {
      this.map.addSource(geography.name, {
        url: `mapbox://adamcohn.${
          this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
            .attributes[geography.layer]
        }`,
        type: 'vector',
      });
      this.props.addSource(geography.name);
    });
  };

  addFillLayers = (geographies, zoomThreshold = 0) => {
    geographies.forEach(geography => {
      this.map.addLayer(
        {
          id: `${geography.name}Fill`,
          minzoom: geographies.indexOf(geography) === 0 ? zoomThreshold : 0,
          maxzoom: geographies.indexOf(geography) === 1 ? zoomThreshold : 0,
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

  addLineLayers = (geographies, zoomThreshold = 0) => {
    geographies.sort((a, b) => a.order - b.order).forEach(geography => {
      this.map.addLayer(
        {
          id: `${geography.name}Line`,
          minzoom: geographies.indexOf(geography) === 0 ? zoomThreshold : 0,
          maxzoom: geographies.indexOf(geography) === 1 ? zoomThreshold : 0,
          type: 'line',
          source: geography.name,
          'source-layer': geography.sourceLayer,
          paint: {
            'line-width': 0.3,
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

  setFilter(layers, property, value) {
    layers.forEach(layer => this.map.setFilter(layer, ['==', property, value]));
  }

  addHoverLayers = (geographies, zoomThreshold = 0) => {
    geographies.forEach(geography => {
      if (
        geography.sourceLayer === 'cb_2017_us_state_500k' ||
        geography.sourceLayer === 'cb_2017_us_cd115_500k'
      ) {
        this.map.addLayer(
          {
            id: `${geography.name}Hover`,
            type: 'line',
            minzoom: geographies.indexOf(geography) === 0 ? zoomThreshold : 0,
            maxzoom: geographies.indexOf(geography) === 1 ? zoomThreshold : 0,
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
          minzoom: geographies.indexOf(geography) === 0 ? zoomThreshold : 0,
          maxzoom: geographies.indexOf(geography) === 1 ? zoomThreshold : 0,
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

  filterGeojson = (property, value = null) => {
    const layer = this.map.querySourceFeatures('composite', {
      sourceLayer: 'cb_2017_us_state_500k',
    });
    if (value === null) {
      const filterfips = ['02', '14', '60', '66', '78', '72', '15', '69', '68'];
      return layer.filter(geo => !filterfips.includes(geo.properties[property]));
    } else {
      return layer.filter(geo => geo.properties[property] === value);
    }
  };

  bindToMap = (property, value = null) => {
    const features = this.filterGeojson(property, value);
    this.map.addSource('bounds', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features,
      },
    });
    const boundingBox = bbox(this.map.getSource('bounds')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
  };

  render() {
    const style = {
      position: this.props.position,
      top: 0,
      bottom: 0,
      width: '100%',
      height: this.props.height,
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
        isNational,
      ),
    ),
  resetHover: () => dispatch(resetHover()),
  fetchStateData: (stateId, districtId) => dispatch(fetchStateData(stateId, districtId)),
  hideHeader: () => dispatch(hideHeader()),
  showHeader: () => dispatch(showHeader()),
  pushToNewState: stateId => dispatch(pushToNewState(stateId)),
  setActiveOffice: (officeId, districtId) => dispatch(setActiveOffice(officeId, districtId)),
  setStateId: stateId => dispatch(setStateId(stateId)),
  fetchStateOffices: stateId => dispatch(fetchStateOffices(stateId)),
  addLayer: layer => dispatch(addLayer(layer)),
  addSource: source => dispatch(addSource(source)),
  removeLayer: layer => dispatch(removeLayer(layer)),
  removeSource: source => dispatch(removeSource(source)),
  resetMapData: () => dispatch(resetMapData()),
});

const mapStateToProps = state => ({
  states: state.states,
  offices: state.offices,
  shortName: state.results.shortName,
  windowWidth: state.nav.windowWidth,
  activeItem: state.nav.activePage,
  layers: state.maps.layers,
  sources: state.maps.sources,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewMap);
