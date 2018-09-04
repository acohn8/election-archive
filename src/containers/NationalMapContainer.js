import React from 'react';
import { connect } from 'react-redux';
import DesktopNationalMapOverlay from '../components/NationalMapOverlay/DesktopNationalMapOverlay';
import ResultsMap from '../components/Map/ResultsMap';
import MobileNationalMapOverlay from '../components/NationalMapOverlay/MobileNationalMapOverlay';
import { setActive } from '../redux/actions/navActions';
import MapLayers from '../util/MapLayers';
import MapHoverInfo from '../components/Map/MapHoverInfo';
import NationalMapWrapper from '../components/Map/NationalMapWrapper';

class NationalMapContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('national map');
  }

  getMapGeographies = () => {
    if (this.props.offices.selectedOfficeId !== '322') {
      const countyLayer = MapLayers.county;
      const stateLayer = MapLayers.state;
      countyLayer.maxzoom = 0;
      countyLayer.minzoom = 4.2;
      stateLayer.maxzoom = 4.2;
      stateLayer.minzoom = 0;
      return [stateLayer, countyLayer];
    } else {
      const congressionalLayer = MapLayers.congressionalDistrict;
      congressionalLayer.minzoom = 0;
      congressionalLayer.maxzoom = 0;
      return [congressionalLayer];
    }
  };

  render() {
    return (
      <div>
        <MobileNationalMapOverlay
          hoveredWinner={this.props.overlay.hoveredWinner}
          office={
            this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
              .attributes.name
          }
        >
          <MapHoverInfo mobile />
        </MobileNationalMapOverlay>
        <NationalMapWrapper>
          <ResultsMap height={'100%'} geographies={this.getMapGeographies()} clickToNavigate />
        </NationalMapWrapper>
        <DesktopNationalMapOverlay
          hoveredWinner={this.props.overlay.hoveredWinner}
          office={
            this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
              .attributes.name
          }
        >
          <MapHoverInfo overlay={this.props.overlay} isNational />
        </DesktopNationalMapOverlay>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  overlay: state.maps.overlay,
  selectedOffice: state.results.officeInfo,
  offices: state.offices,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMapContainer);
