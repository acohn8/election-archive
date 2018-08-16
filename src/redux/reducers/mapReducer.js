const initialMapState = {
  overlay: {
    geographyName: '',
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
  mapDetails: {},
};

const mapsReducer = (previousState = initialMapState, action) => {
  switch (action.type) {
    case 'SET_HOVER':
      return {
        ...previousState,
        overlay: {
          hoveredGeography: action.geographyName,
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
