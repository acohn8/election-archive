import { CountyColorScale, StateColorScale } from './ColorScale';

const MapLayers = {
  county: {
    name: 'county',
    sourceLayer: 'cb_2017_us_county_500k',
    colorScale: CountyColorScale,
    layer: 'county-map',
    filter: 'GEOID',
    order: 1,
  },
  congressionalDistrict: {
    name: 'congressionalDistrict',
    sourceLayer: 'cb_2017_us_cd115_500k',
    colorScale: StateColorScale,
    layer: 'state-map',
    filter: 'GEOID',
    order: 1,
  },
  state: {
    name: 'state',
    sourceLayer: 'cb_2017_us_state_500k',
    colorScale: StateColorScale,
    layer: 'state-map',
    filter: 'GEOID',
    order: 2,
  },
};

export default MapLayers;
