import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';

import { setActiveState } from '../../redux/actions/stateActions';
import setActive from '../../redux/actions/navActions';
import { getHoverInfo, resetHover, hideHeader, showHeader } from '../../redux/actions/mapActions';
import { fetchOfficesList } from '../../redux/actions/officeActions';
import { fetchStateData } from '../../redux/actions/resultActions';
import ResponsiveNav from '../Nav/ResponsiveNav';
import { StateColorScale, CountyColorScale } from '../../functions/ColorScale';
mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NationalMap extends React.Component {
  componentDidMount() {
    this.props.showHeader();
    this.props.setActive('national map');
    this.props.states.activeStateId === null && this.createMap();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.offices.selectedOfficeId !== prevProps.offices.selectedOfficeId &&
      this.map !== undefined
    ) {
      this.map.removeLayer('dem-statewide-margin');
      this.map.removeLayer('dem-county-margin');
      this.map.removeLayer('state-lines');
      this.map.removeLayer('county-lines');
      this.map.removeLayer('county-hover-line');
      this.map.removeLayer('state-hover-line');
      this.map.removeSource('countyResults');
      this.map.removeSource('statewideResults');
      this.addResultsLayer();
    } else if (this.map === undefined) {
      this.createMap();
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

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
      this.map.addControl(new mapboxgl.FullscreenControl());
      this.map.addControl(new mapboxgl.NavigationControl());
      this.props.windowWidth >= 768 && this.map.on('movestart', () => this.props.hideHeader());
      this.props.windowWidth >= 768 && this.map.on('moveend', () => this.props.showHeader());
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
        if (
          feature.layer.id === 'dem-county-margin' ||
          feature.layer.id === 'dem-statewide-margin'
        ) {
          this.map.setFilter(
            feature.layer.id === 'dem-county-margin' ? 'county-hover-line' : 'state-hover-line',
            ['==', 'GEOID', feature.properties.GEOID],
          );
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
          state =>
            state.attributes['short-name'].toLowerCase() ===
            features[0].properties.STUSPS.toLowerCase(),
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

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
      width: '100%',
      height: this.props.windowWidth >= 768 ? '90vh' : '62vh',
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
  fetchStateData: id => dispatch(fetchStateData(id)),
  hideHeader: () => dispatch(hideHeader()),
  showHeader: () => dispatch(showHeader()),
  setActive: name => dispatch(setActive(name)),
  fetchOfficesList: () => dispatch(fetchOfficesList()),
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
