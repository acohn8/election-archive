import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class CountyMap extends React.Component {
  componentDidMount() {
    this.createMap();
  }

  componentWillUnmount() {
    this.map.remove();
  }

  createMap = () => {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjjyfk3es0nfj2rqpf9j53505',
      zoom: this.props.mapDetails.zoom,
      center: this.props.mapDetails.center,
    });

    this.map.on('load', () => {
      this.addResultsLayer();
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
          ['get', 'GEOID'],
          this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
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
          county.properties.GEOID ===
          this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
            .toString()
            .padStart(5, '0'),
      );

    this.map.addSource('counties', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapFeatures,
      },
    });

    this.map.moveLayer('dem-margin', 'poi-parks-scalerank2');
    const boundingBox = bbox(this.map.getSource('counties')._data);
    this.map.fitBounds(boundingBox, { padding: 70, animation: { duration: 200 } });
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

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  electionResults: state.results.electionResults,
  candidates: state.results.candidates,
  precinctResults: state.results.precinctResults,
  mapDetails: state.results.mapDetails,
});

export default connect(mapStateToProps)(CountyMap);
