const initialCountyState = {
  id: null,
  name: null,
  details: null,
  images: [],
};

const countiesReducer = (previousState = initialCountyState, action) => {
  switch (action.type) {
    case 'SET_COUNTY_INFO':
      return {
        ...previousState,
        id: action.id,
        name: action.name,
        details: action.details,
        images: action.images,
      };
    case 'RESET_COUNTY_INFO':
      return {
        initialCountyState,
      };
    default:
      return previousState;
  }
};

export default countiesReducer;
