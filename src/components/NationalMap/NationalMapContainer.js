import React from 'react';
import { Header, Segment, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import MapLayers from '../../functions/MapLayers';
import MapInfo from '../Map/mapInfo';
import { resetActiveState } from '../../redux/actions/stateActions';
import { setActive } from '../../redux/actions/navActions';
import NewMapComponent from '../Map/NewMapComponent';

class NationalMapContainer extends React.Component {
  state = { windowWidth: '' };

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
      <div ref={divElement => (this.divElement = divElement)}>
        {this.props.offices.allOffices.result !== undefined && (
          <NewMapComponent
            minHeight={this.props.windowWidth >= 768 ? '94vh' : '65vh'}
            geographies={this.getMapGeographies()}
          />
        )}
        {!this.props.headerHid &&
          this.props.windowWidth >= 768 && (
            <div
              style={{
                position: 'absolute',
                zIndex: 1,
                left: 30,
                borderRadius: '25px',
                top: 80,
                width: 300,
                backgroundColor: 'white',
                padding: '20px',
                opacity: '0.8',
                borderColor: 'gray',
                borderStyle: 'solid',
                borderWidth: '0.5px',
              }}
            >
              {this.props.overlay.hoveredWinner.votes === '' &&
              this.props.offices.allOffices.result !== undefined ? (
                <Header size="huge">
                  {
                    this.props.offices.allOffices.entities.offices[
                      this.props.offices.selectedOfficeId
                    ].attributes.name
                  }
                  <Header.Subheader>
                    Zoom in to see counties or out to see states. Click for details.
                  </Header.Subheader>
                </Header>
              ) : (
                <div>
                  <MapInfo />
                </div>
              )}
            </div>
          )}
        {this.props.windowWidth < 768 && (
          <Container>
            <Segment vertical padded>
              {this.props.overlay.hoveredWinner.votes === '' &&
              this.props.offices.allOffices.result !== undefined ? (
                <Header size="huge">
                  {
                    this.props.offices.allOffices.entities.offices[
                      this.props.offices.selectedOfficeId
                    ].attributes.name
                  }
                  <Header.Subheader>
                    Zoom in to see counties or out to see states. Click for details.
                  </Header.Subheader>
                </Header>
              ) : (
                <div>
                  <MapInfo />
                </div>
              )}
            </Segment>
          </Container>
        )}
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  resetActiveState: () => dispatch(resetActiveState()),
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  headerHid: state.maps.headerHid,
  overlay: state.maps.overlay,
  offices: state.offices,
  windowWidth: state.nav.windowWidth,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NationalMapContainer);
