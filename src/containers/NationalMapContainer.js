import React from 'react';
import { connect } from 'react-redux';
import DesktopNationalMapOverlay from '../components/DesktopNationalMapOverlay/DesktopNationalMapOverlay';
import ResultsMap from '../components/Map/ResultsMap';
import MobileNationalMapOverlay from '../components/MobileNationalMapOverlay/MobileNationalMapOverlay';
import { setActive } from '../redux/actions/navActions';
import MapLayers from '../util/MapLayers';

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
        {this.props.offices.allOffices.result !== undefined && (
          <div>
            <MobileNationalMapOverlay
              hoveredWinner={this.props.overlay.hoveredWinner}
              office={
                this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
                  .attributes.name
              }
            />
            <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
              <ResultsMap height={'100%'} geographies={this.getMapGeographies()} clickToNavigate />
            </div>
            <DesktopNationalMapOverlay
              hoveredWinner={this.props.overlay.hoveredWinner}
              office={
                this.props.offices.allOffices.entities.offices[this.props.offices.selectedOfficeId]
                  .attributes.name
              }
            />
          </div>
        )}
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
  windowWidth: state.nav.windowWidth,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMapContainer);
