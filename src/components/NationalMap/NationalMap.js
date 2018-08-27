import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';

import { pushToNewState } from '../../redux/actions/stateActions';
import { getHoverInfo, resetHover, hideHeader, showHeader } from '../../redux/actions/mapActions';
import { setActiveOffice, fetchStateOffices } from '../../redux/actions/officeActions';
import { fetchStateData } from '../../redux/actions/resultActions';
import { setStateId } from '../../redux/actions/stateActions';
import { StateColorScale, CountyColorScale } from '../../functions/ColorScale';
mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NationalMap extends React.Component {
  componentDidMount() {
    this.props.showHeader();
    this.props.states.activeStateId === null && this.createMap();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.offices.selectedOfficeId !== prevProps.offices.selectedOfficeId &&
      this.map !== undefined
    ) {
      prevProps.offices.selectedOfficeId !== '322' && this.map.removeLayer('dem-statewide-margin');
      prevProps.offices.selectedOfficeId !== '322' && this.map.removeLayer('state-lines');
      prevProps.offices.selectedOfficeId !== '322' && this.map.removeLayer('state-hover-line');
      prevProps.offices.selectedOfficeId !== '322' && this.map.removeSource('statewideResults');
      this.map.removeLayer('dem-county-margin');
      this.map.removeLayer('county-lines');
      this.map.removeLayer('county-hover-line');
      this.map.removeSource('countyResults');
      this.props.offices.selectedOfficeId === '322'
        ? this.addCongressionalLayers()
        : this.addResultsLayer();
    } else if (this.map === undefined) {
      this.createMap();
    }
  }

  componentWillUnmount() {
    this.props.resetHover();
    this.map.remove();
  }

  createMap = () => {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjlbpna8q30602rmcwbmtz9zv',
      zoom: 3.5,
      center: [-98.585522, 39.8333333],
    });

    this.map.on('load', () => {
      this.props.offices.selectedOfficeId === '322'
        ? this.addCongressionalLayers()
        : this.addResultsLayer();
      this.stateSelection();
      this.enableHover();
      this.map.addControl(new mapboxgl.FullscreenControl());
      this.map.addControl(new mapboxgl.NavigationControl());
      this.props.windowWidth >= 768 && this.map.on('movestart', () => this.props.hideHeader());
      this.props.windowWidth >= 768 && this.map.on('moveend', () => this.props.showHeader());
    });
  };

  enableHover = () => {
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers:
          this.props.offices.selectedOfficeId === '322'
            ? ['dem-county-margin']
            : ['dem-county-margin', 'dem-statewide-margin'],
      });
      if (features.length > 0) {
        const feature = features[0];
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
        if (feature.layer.id === 'dem-county-margin') {
          this.map.setFilter('county-hover-line', ['==', 'GEOID', feature.properties.GEOID]);
        } else if (feature.layer.id === 'dem-statewide-margin') {
          this.map.setFilter('state-hover-line', ['==', 'STATEFP', feature.properties.STATEFP]);
        }
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.map.setFilter('county-hover-line', ['==', 'GEOID', '']);
        this.map.setFilter('state-hover-line', ['==', 'STATEFP', '']);
        this.props.resetHover();
      }
    });
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

  addResultsLayer = () => {
    const zoomThreshold = 4.2;
    this.map.addSource('countyResults', {
      url: `mapbox://adamcohn.${
        this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
          .attributes['county-map']
      }`,
      type: 'vector',
    });

    this.map.addSource('statewideResults', {
      url: `mapbox://adamcohn.${
        this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
          .attributes['state-map']
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
        paint: StateColorScale,
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
        paint: CountyColorScale,
      },
      'waterway-label',
    );

    this.map.addLayer(
      {
        id: 'state-lines',
        type: 'line',
        source: 'statewideResults',
        'source-layer': 'cb_2017_us_state_500k',
        paint: {
          'line-width': 0.5,
          'line-color': '#696969',
          'line-opacity': 0.6,
        },
      },
      'waterway-label',
    );

    this.map.addLayer(
      {
        id: 'county-lines',
        type: 'line',
        minzoom: zoomThreshold,
        source: 'countyResults',
        'source-layer': 'cb_2017_us_county_500k',
        paint: {
          'line-width': 0.3,
          'line-color': '#696969',
          'line-opacity': 0.5,
        },
      },
      'waterway-label',
    );

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

    this.map.moveLayer('dem-county-margin', 'poi-parks-scalerank2');
    this.map.moveLayer('county-hover-line', 'poi-parks-scalerank2');
    this.map.moveLayer('state-hover-line', 'poi-parks-scalerank2');
    this.map.moveLayer('state-lines', 'poi-parks-scalerank2');
    this.map.moveLayer('county-lines', 'state-lines');
  };

  addCongressionalLayers = () => {
    this.map.addSource('countyResults', {
      url: 'mapbox://adamcohn.4c51e3au',
      type: 'vector',
    });

    this.map.addLayer(
      {
        id: 'county-lines',
        type: 'line',
        source: 'countyResults',
        'source-layer': 'cb_2017_us_cd115_500k',
        paint: {
          'line-width': 0.3,
          'line-color': '#696969',
          'line-opacity': 0.6,
        },
      },
      'waterway-label',
    );

    this.map.addLayer(
      {
        id: 'county-hover-line',
        type: 'line',
        source: 'countyResults',
        'source-layer': 'cb_2017_us_cd115_500k',
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
        id: 'dem-county-margin',
        type: 'fill',
        source: 'countyResults',
        'source-layer': 'cb_2017_us_cd115_500k',
        paint: StateColorScale,
      },
      'waterway-label',
    );
    this.map.moveLayer('dem-county-margin', 'poi-parks-scalerank2');
    this.map.moveLayer('county-hover-line', 'poi-parks-scalerank2');
    this.map.moveLayer('county-lines', 'poi-parks-scalerank2');
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      height: this.props.windowWidth >= 768 ? '94vh' : '65vh',
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
});

const mapStateToProps = state => ({
  states: state.states,
  offices: state.offices,
  shortName: state.results.shortName,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMap);
