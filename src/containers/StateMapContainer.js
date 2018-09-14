import React from 'react';
import { connect } from 'react-redux';
import MapHoverInfo from '../components/Map/MapHoverInfo';
import StateHoverOverlay from '../components/Map/StateHoverOverlay';
import ResultsMap from '../components/Map/ResultsMap';
import { PrecinctColorScale } from '../util/ColorScale';
import MapLayers from '../util/MapLayers';

class StateMapContainer extends React.Component {
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
    const stateFips = this.props.stateInfo.attributes.fips.toString().padStart(2, '0');
    if (this.props.selectedOfficeId !== '322') {
      return { property: 'STATEFP', value: stateFips };
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
    return (
      <div>
        {this.props.overlay.hoveredWinner.votes !== '' && (
          <StateHoverOverlay>
            <MapHoverInfo overlay={this.props.overlay} />
          </StateHoverOverlay>
        )}
        <ResultsMap
          hideHeaderOnPrecincts
          height={600}
          geographies={this.getMapGeographies()}
          mapFilter={this.getMapFilter()}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
  stateInfo: state.results.stateInfo,
  stateOffices: state.results.stateOffices,
  selectedOfficeId: state.offices.selectedOfficeId,
  selectedDistrictId: state.offices.selectedDistrictId,
});

export default connect(mapStateToProps)(StateMapContainer);
