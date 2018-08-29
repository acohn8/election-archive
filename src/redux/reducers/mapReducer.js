const initialMapState = {
  overlay: {
    geographyName: '',
    layer: '',
    hoveredWinner: {
      name: '',
      party: '',
      votes: '',
      percent: '',
    },
    hoveredSecond: {
      name: '',
      party: '',
      votes: '',
      percent: '',
    },
    isNational: false,
  },
  headerHid: false,
  layers: [],
  sources: [],
  mapDetails: {},
  showingPrecincts: false,
};

const mapsReducer = (previousState = initialMapState, action) => {
  switch (action.type) {
    case 'SET_HOVER':
      console.log(action);
      return {
        ...previousState,
        overlay: {
          hoveredGeography: action.geographyName,
          layer: action.layer,
          hoveredWinner: {
            name: action.winnerName,
            party: action.winnerParty,
            votes: action.winnerVotes,
            percent: action.winnerMargin,
          },
          hoveredSecond: {
            name: action.secondName,
            party: action.secondParty,
            votes: action.secondVotes,
            percent: action.secondMargin,
          },
          isNational: action.isNational,
        },
      };
    case 'ADD_LAYER':
      return { ...previousState, layers: [...previousState.layers, action.layer] };
    case 'REMOVE_LAYER':
      return {
        ...previousState,
        layers: [
          ...previousState.layers.slice(0, action.layer),
          ...previousState.layers.slice(action.layer + 1),
        ],
      };
    case 'ADD_SOURCE':
      return { ...previousState, sources: [...previousState.sources, action.source] };
    case 'REMOVE_SOURCE':
      return {
        ...previousState,
        sources: [
          ...previousState.sources.slice(0, action.source),
          ...previousState.sources.slice(action.source + 1),
        ],
      };
    case 'RESET_MAP_DATA':
      return { ...previousState, layers: [], sources: [] };
    case 'SET_MAP_DETAILS':
      return {
        ...previousState,
        mapDetails: action.details,
      };
    case 'RESET_MAP_DETAILS':
      return {
        ...previousState,
        mapDetails: {},
      };
    case 'SHOWING_PRECINCTS':
      return {
        ...previousState,
        showingPrecincts: true,
      };
    case 'RESET_PRECINCTS':
      return {
        ...previousState,
        showingPrecincts: false,
      };
    case 'RESET_HOVER':
      return {
        ...previousState,
        overlay: {
          hoveredGeography: '',
          hoveredWinner: {
            name: '',
            party: '',
            votes: '',
            percent: '',
          },
          hoveredSecond: {
            name: '',
            party: '',
            votes: '',
            percent: '',
          },
          isNational: false,
        },
      };
    case 'HIDE_HEADER':
      return {
        ...previousState,
        headerHid: true,
      };
    case 'SHOW_HEADER':
      return {
        ...previousState,
        headerHid: false,
      };
    default:
      return previousState;
  }
};

export default mapsReducer;
