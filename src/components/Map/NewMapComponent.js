import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import union from '@turf/union';

import { StateColorScale, CountyColorScale } from '../../functions/ColorScale';

import {
  getHoverInfo,
  //   setMapDetails,
  //   resetHover,
  //   resetMapDetails,
} from '../../redux/actions/mapActions';
import { geometry } from '@turf/helpers';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NewMap extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjld3m3g66xlb2sl2ojc73n5v',
    });
  }

  componentDidUpdate() {
    if (this.props.allOffices.result !== undefined) {
      const layers = [
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
      this.map.on('load', () => {
        this.map.on('load');
        this.addSources(layers);
        this.addFillLayers(layers, 4.2);
        this.addLineLayers(layers, 4.2);
        this.addHoverLayers(layers);
        // this.setFilter(['stateFill', 'countyFill', 'stateLine', 'countyLine'], 'STATEFP', '12');
        this.enableHover(layers);
        // this.bindToMap();
        // this.stateSelection();
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  enableHover = geographies => {
    geographies.forEach(geography =>
      this.map.on('mousemove', `${geography.name}Fill`, e => {
        if (e.features) {
          const feature = e.features[0];
          console.log(this.map.getSource('composite').vectorLayerIds);
          const sourceFeatures = this.map.querySourceFeatures('composite', {
            sourceLayer: geography.sourceLayer,
            filter: ['==', geography.filter, feature.properties[geography.filter]],
          });
          // const joinedFeatures = union.apply(this, sourceFeatures);
          // console.log(joinedFeatures);
          // const layer = sourceFeatures.map(sourceFeature => {
          //   const areaFeature = sourceFeature[0];
          //   union(sourceFeature, areaFeature);
          // });
          this.map.getSource(`${geography.name}Hover`).setData({
            type: 'FeatureCollection',
            features: sourceFeatures,
          });
          this.map.getCanvas().style.cursor = 'pointer';

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
        } else if (!e.features) {
          this.map.getCanvas().style.cursor = '';
          this.map.getSource(`${geography.name}Hover`).setData({
            type: 'FeatureCollection',
            features: [],
          });
          return;
        }
      }),
    );
  };

  stateSelection = () => {
    this.map.on('click', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers:
          this.props.offices.selectedOfficeId !== '322'
            ? ['dem-statewide-margin']
            : ['dem-county-margin'],
      });
      if (features.length) {
        const coords = e.lngLat;
        const state = this.getStateName(features[0]);
        const district = this.getDistrictId(features[0]);
        if (district !== 0) {
          this.setStateOnClick(state, coords, district);
        }
      }
    });
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
    this.props.setStateId(state.id);
    this.props.fetchStateOffices(state.id);
    this.props.setActiveOffice(this.props.offices.selectedOfficeId, districtId);
    this.props.fetchStateData(state.id, districtId);
    this.map.flyTo({
      center: coords,
      zoom: 6,
      speed: 0.75,
    });
    this.map.on('moveend', () => this.props.pushToNewState(state.id));
  };

  addSources = geographies => {
    geographies.forEach(geography =>
      this.map.addSource(`${geography.name}`, {
        url: `mapbox://adamcohn.${
          this.props.allOffices.entities.offices[this.props.selectedOffice].attributes[
            geography.layer
          ]
        }`,
        type: 'vector',
      }),
    );
  };

  addFillLayers = (geographies, zoomThreshold = 0) => {
    geographies.forEach(geography =>
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
      ),
    );
  };

  addLineLayers = (geographies, zoomThreshold = 0) => {
    geographies.sort((a, b) => a.order - b.order).forEach(geography =>
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
      ),
    );
  };

  setFilter(layers, property, value) {
    layers.forEach(layer => this.map.setFilter(layer, ['==', property, value]));
  }

  addHoverLayers = geographies => {
    geographies.forEach(geography =>
      this.map.addSource(`${geography.name}Hover`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      }),
    );

    geographies.forEach(geography =>
      this.map.addLayer({
        id: `${geography.name}Hover`,
        source: `${geography.name}Hover`,
        type: 'line',
        paint: {
          'line-width': 2,
          'line-color': '#696969',
          'line-opacity': 1,
        },
      }),
    );
  };

  filterGeojson = (property = null, value = null) => {
    const layer = this.map.querySourceFeatures('composite', {
      sourceLayer: '2016_county_results-5wvgz3',
    });
    if (property === null && value === null) {
      return layer.filter(
        geo => geo.properties.STATEFP !== '15' && geo.properties.STATEFP !== '02',
      );
    } else {
      return layer.filter(geo => geo.properties[property] === value);
    }
  };

  bindToMap = (property = null, value = null) => {
    this.map.addSource('bounds', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.filterGeojson(property, value),
      },
    });
    const boundingBox = bbox(this.map.getSource('bounds')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
  };

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
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
});

const mapStateToProps = state => ({
  allOffices: state.offices.allOffices,
  selectedOffice: state.offices.selectedOfficeId,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewMap);
