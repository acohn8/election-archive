import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'react-redux';

import { StateColorScale, CountyColorScale } from '../../functions/ColorScale';

// import {
//   getHoverInfo,
//   setMapDetails,
//   resetHover,
//   resetMapDetails,
// } from '../../redux/actions/mapActions';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhbWNvaG4iLCJhIjoiY2pod2Z5ZWQzMDBtZzNxcXNvaW8xcGNiNiJ9.fHYsK6UNzqknxKuchhfp7A';

class NewMap extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/adamcohn/cjjyfk3es0nfj2rqpf9j53505',
    });
  }

  componentDidUpdate() {
    if (this.props.allOffices.result !== undefined) {
      const office = this.props.allOffices.entities.offices[this.props.selectedOffice];
      this.map.on('load', () => {
        this.map.on('load');
        this.addSources('county', office);
        this.addFillLayer('county');
        this.addLineLayer('county');
        this.addHoverLayer('county', 'GEOID');
        this.setFilter(['countyFill', 'countyLines'], 'STATEFP', '12');
        this.enableHover('county', 'GEOID');
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  enableHover = (geography, filter) => {
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [`${geography}Fill`],
      });
      if (features.length > 0) {
        const feature = features[0];
        this.map.setFilter(`${geography}Hover`, ['==', filter, feature.properties[filter]]);
        this.map.getCanvas().style.cursor = 'pointer';
      } else if (features.length === 0) {
        this.map.getCanvas().style.cursor = '';
        this.map.setFilter(`${geography}Hover`, ['==', filter, '']);
      }
    });
  };

  addSources = (geography, office) => {
    this.map.addSource(`${geography}`, {
      url: `mapbox://adamcohn.${office.attributes['county-map']}`,
      type: 'vector',
    });
  };

  addFillLayer = geography => {
    this.map.addLayer(
      {
        id: `${geography}Fill`,
        type: 'fill',
        source: `${geography}`,
        'source-layer': 'cb_2017_us_county_500k',
        paint: CountyColorScale,
      },
      'waterway-label',
    );
  };

  addLineLayer = geography => {
    this.map.addLayer(
      {
        id: `${geography}Lines`,
        type: 'line',
        source: `${geography}`,
        'source-layer': 'cb_2017_us_county_500k',
        paint: {
          'line-width': 0.3,
          'line-color': '#696969',
          'line-opacity': 0.6,
        },
      },
      'waterway-label',
    );
  };

  setFilter(layers, property, value) {
    layers.forEach(layer => this.map.setFilter(layer, ['==', property, value]));
  }

  addHoverLayer = (geography, filter) => {
    this.map.addLayer(
      {
        id: `${geography}Hover`,
        type: 'line',
        source: `${geography}`,
        'source-layer': 'cb_2017_us_county_500k',
        filter: ['==', `${filter}`, ''],
        paint: {
          'line-width': 2,
          'line-color': '#696969',
          'line-opacity': 1,
        },
      },
      'waterway-label',
    );
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

const mapStateToProps = state => ({
  allOffices: state.offices.allOffices,
  selectedOffice: state.offices.selectedOfficeId,
});

export default connect(mapStateToProps)(NewMap);
