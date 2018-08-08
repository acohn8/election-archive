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
    let zoomThreshold;
    const precinctStates = [4, 11, 45, 14];
    const pa = 3;
    if (precinctStates.includes(this.props.geography.result.state)) {
      zoomThreshold = 8;
    } else if (this.props.geography.result.state === pa) {
      zoomThreshold = 9;
    } else {
      zoomThreshold = 0;
    }
    this.map.addSource('presResults', {
      url: 'mapbox://adamcohn.7bxery92',
      type: 'vector',
    });

    this.map.addLayer(
      {
        id: 'dem-margin',
        type: 'fill',
        source: 'presResults',
        'source-layer': '2016_county_results-5wvgz3',
        maxzoom: zoomThreshold,
        filter: [
          '==',
          ['get', 'GEOID'],
          this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
            .toString()
            .padStart(5, '0'),
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

    if (this.props.geography.result.state === 4) {
      this.map.addSource('wi-precinct', {
        url: 'mapbox://adamcohn.adwhne7t',
        type: 'vector',
      });

      this.map.addLayer(
        {
          id: 'wi-pres-precinct',
          type: 'fill',
          minzoom: zoomThreshold,
          source: 'wi-precinct',
          'source-layer': 'wi-2016-final-6apfcm',
          filter: [
            '==',
            ['get', 'CNTY_FIPS'],
            this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
              .toString()
              .padStart(5, '0'),
          ],
          paint: {
            'fill-outline-color': '#696969',
            'fill-color': [
              'interpolate',
              ['linear'],
              [
                '-',
                ['/', ['get', 'G16PREDCli'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
                ['/', ['get', 'G16PRERTru'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
              ],
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
    }

    if (
      this.props.geography.result.state === 45 ||
      this.props.geography.result.state === 11 ||
      this.props.geography.result.state === 14 ||
      this.props.geography.result.state === 3
    ) {
      const links = {
        3: 'adamcohn.3sna8yq5',
        45: 'adamcohn.9iseezid',
        11: 'adamcohn.1g8o5usp',
        14: 'adamcohn.8risplqr',
      };
      const layers = {
        3: 'pa-2016-final-597cvl',
        45: 'tx-2016-final-7ylsll',
        11: 'ga-2016-final-9bvbyq',
        14: 'mn-2016-final-53132s',
      };

      this.map.addSource('precinct', {
        url: `mapbox://${links[this.props.geography.result.state]}`,
        type: 'vector',
      });

      this.map.addLayer(
        {
          id: 'precinct',
          type: 'fill',
          minzoom: zoomThreshold,
          source: 'precinct',
          'source-layer': layers[this.props.geography.result.state],
          filter: [
            '==',
            ['get', 'GEOID'],
            this.props.geography.result.state === 11 || this.props.geography.result.state === 14
              ? this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
              : this.props.geography.entities.counties[this.props.precinctResults.county_id].fips
                  .toString()
                  .padStart(5, '0'),
          ],
          paint: {
            'fill-outline-color': '#696969',
            'fill-color': [
              'interpolate',
              ['linear'],
              [
                '-',
                ['/', ['get', 'G16PREDCli'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
                ['/', ['get', 'G16PRERTru'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
              ],
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
    }

    this.map.moveLayer('dem-margin', 'poi-parks-scalerank2');
    const boundingBox = bbox(this.map.getSource('counties')._data);
    this.map.fitBounds(boundingBox, { padding: 30, animation: { duration: 200 } });
  };

  render() {
    const style = {
      position: 'relative',
      top: 0,
      bottom: 0,
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
  mapDetails: state.maps.mapDetails,
});

export default connect(mapStateToProps)(CountyMap);
