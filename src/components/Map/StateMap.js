import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import {
  getHoverInfo,
  setMapDetails,
  resetHover,
  resetMapDetails,
} from '../../redux/actions/mapActions';
import { CountyColorScale } from '../../functions/ColorScale';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class Map extends React.Component {
  componentDidMount() {
    this.createMap();
  }

  componentWillUnmount() {
    this.map.remove();
    this.props.resetMapDetails();
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
      zoom: 3,
      //grabs the lat long from the first county in the state to ensure the counties layer is loading the right geos
      //if it's Alaska, it just jumps to the middle of the state
      center: this.props.geography.result.state !== 17 ? this.getCoords() : [-149.4937, 64.2008],
    });

    this.map.on('load', () => {
      this.addResultsLayer();
      this.props.geography.result.state !== 17 && this.enableHover();
      this.map.addControl(new mapboxgl.FullscreenControl());
    });
  };

  enableHover = () => {
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['dem-margin'],
      });
      if (features.length > 0) {
        const feature = features[0];
        this.map.setFilter('county-hover-line', ['==', 'GEOID', feature.properties.GEOID]);
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
        );
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.map.setFilter('county-hover-line', ['==', 'GEOID', '']);
        this.props.resetHover();
      }
    });
  };

  addResultsLayer = () => {
    //adds the precinct zoom threshold for precinct states
    const precinctStates = [4, 11, 45, 14];
    const pa = 3;
    let zoomThreshold;
    if (precinctStates.includes(this.props.geography.result.state)) {
      zoomThreshold = 8;
    } else if (this.props.geography.result.state === pa) {
      zoomThreshold = 9;
    } else {
      zoomThreshold = 0;
    }
    this.map.addSource('countyResults', {
      //loads the AK state leg map if it's Alaska
      url:
        this.props.geography.result.state !== 17
          ? `mapbox://adamcohn.${
              this.props.offices.offices.find(
                office => office.id === this.props.offices.selectedOfficeId.toString(),
              ).attributes['county-map']
            }`
          : 'mapbox://adamcohn.2hweullr',
      type: 'vector',
    });

    if (this.props.geography.result.state !== 17) {
      this.map.addLayer(
        {
          id: 'dem-margin',
          type: 'fill',
          source: 'countyResults',
          minzoom: zoomThreshold,
          'source-layer': 'cb_2017_us_county_500k',
          filter: [
            '==',
            ['get', 'STATEFP'],
            this.props.geography.entities.state[this.props.geography.result.state].fips
              .toString()
              .padStart(2, '0'),
          ],
          paint: CountyColorScale,
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
          filter: [
            '==',
            ['get', 'STATEFP'],
            this.props.geography.entities.state[this.props.geography.result.state].fips
              .toString()
              .padStart(2, '0'),
          ],
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
    } else if (this.props.geography.result.state === 17) {
      this.map.addLayer(
        {
          id: 'dem-margin',
          type: 'fill',
          source: 'countyResults',
          maxzoom: zoomThreshold,
          'source-layer': '2016_ak_results-d7n96u',
          paint: {
            'fill-outline-color': '#696969',
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'ak_resul_2'],
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
          id: 'county-lines',
          type: 'line',
          minzoom: zoomThreshold,
          source: 'countyResults',
          'source-layer': '2016_ak_results-d7n96u',
          paint: {
            'line-width': 0.3,
            'line-color': '#696969',
            'line-opacity': 0.5,
          },
        },
        'waterway-label',
      );
    }

    const mapFeatures = this.map
      .querySourceFeatures('composite', {
        sourceLayer: 'cb_2017_us_county_500k-7qwbcn',
      })
      .filter(
        county =>
          county.properties.STATEFP ===
          this.props.geography.entities.state[this.props.geography.result.state].fips
            .toString()
            .padStart(2, '0'),
      );

    this.map.addSource('counties', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mapFeatures,
      },
    });

    if (this.props.geography.result.state === 4) {
      this.map.addSource('precinct', {
        url: 'mapbox://adamcohn.adwhne7t',
        type: 'vector',
      });

      this.map.addLayer(
        {
          id: 'wi-pres-precinct',
          type: 'fill',
          minzoom: zoomThreshold,
          source: 'precinct',
          'source-layer': 'wi-2016-final-6apfcm',
          paint: CountyColorScale,
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
          paint: CountyColorScale,
        },
        'waterway-label',
      );
    }

    const boundingBox = bbox(this.map.getSource('counties')._data);
    this.map.fitBounds(boundingBox, { padding: 20, animate: false });
    this.map.moveLayer('dem-margin', 'poi-parks-scalerank2');
    this.map.moveLayer('county-lines', 'poi-parks-scalerank2');
    this.props.geography.result.state !== 17 &&
      this.map.moveLayer('county-hover-line', 'poi-parks-scalerank2');
    const mapDetails = {
      center: this.map.getCenter(),
      zoom: this.map.getZoom(),
      bbox: boundingBox,
    };
    this.props.setMapDetails(mapDetails);
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

const mapDispatchToProps = dispatch => ({
  setMapDetails: details => dispatch(setMapDetails(details)),
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
      ),
    ),
  resetHover: () => dispatch(resetHover()),
  resetMapDetails: () => dispatch(resetMapDetails()),
});

const mapStateToProps = state => ({
  states: state.states,
  geography: state.results.geography,
  candidates: state.results.candidates,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
