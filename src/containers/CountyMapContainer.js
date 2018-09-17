import { connect } from 'react-redux';
import React from 'react';
import ResultsMap from '../components/Map/ResultsMap';

import { PrecinctColorScale } from '../util/ColorScale';
import MapLayers from '../util/MapLayers';

class CountyMapContainer extends React.Component {
  getMapGeographies = () => {
    if (
      this.props.stateInfo.attributes['precinct-map'] !== null &&
      this.props.selectedOfficeId === '308'
    ) {
      const countyLayer = MapLayers.county;
      const precinctMinCountyMaxZoom = this.props.stateInfo.id === '3' ? 9 : 8;
      countyLayer.order = 2;
      countyLayer.minzoom = 0;
      countyLayer.maxzoom = precinctMinCountyMaxZoom;
      const precinctMinZoom = this.props.stateInfo.id === '3' ? 9 : precinctMinCountyMaxZoom;
      const precinctLayer = {
        name: 'precinct',
        url: this.props.stateInfo.attributes['precinct-map'],
        sourceLayer: this.props.stateInfo.attributes['precinct-source'],
        fillColorScale: PrecinctColorScale,
        minzoom: precinctMinZoom,
        maxzoom: 0,
        layer: 'precinct-map',
        filter: null,
        order: 1,
      };
      return [precinctLayer, countyLayer];
    } else if (this.props.selectedOfficeId !== '322') {
      const countyLayer = MapLayers.county;
      countyLayer.minzoom = 0;
      countyLayer.maxzoom = 0;
      return [countyLayer];
    } else {
      const congressionalLayer = MapLayers.congressionalDistrict;
      congressionalLayer.minzoom = 0;
      congressionalLayer.maxzoom = 0;
      return [congressionalLayer];
    }
  };

  getMapFilter = () => {
    const { fips } = this.props.countyInfo;
    const stateFips = this.props.stateInfo.attributes.fips.toString().padStart(2, '0');
    if (this.props.selectedOfficeId !== '322') {
      return { property: 'GEOID', value: fips.toString().padStart(5, '0') };
    } else {
      const congressionalDistricts = this.props.stateOffices.entities.offices[
        this.props.selectedOfficeId
      ].districts;
      const districtNumber = congressionalDistricts
        .find(district => district.name.toLowerCase() === this.props.selectedDistrictId)
        .name.split('-')[1];
      return {
        property: 'GEOID',
        value: `${stateFips}${districtNumber}`,
      };
    }
  };

  render() {
    const { fips } = this.props.countyInfo;
    const { height } = this.props;

    return (
      fips && (
        <ResultsMap
          hideHeaderOnPrecincts
          height={height}
          geographies={this.getMapGeographies()}
          mapFilter={this.getMapFilter()}
          countyMap
        />
      )
    );
  }
}

const mapStateToProps = state => ({
  stateInfo: state.results.stateInfo,
  stateOffices: state.results.stateOffices,
  selectedOfficeId: state.offices.selectedOfficeId,
  selectedDistrictId: state.offices.selectedDistrictId,
  countyInfo: state.counties,
});

export default connect(mapStateToProps)(CountyMapContainer);
