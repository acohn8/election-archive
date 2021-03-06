const initialCountyState = {
  id: null,
  name: null,
  fips: null,
  latitude: null,
  longitude: null,
  details: null,
  url: null,
  images: [],
};

const countiesReducer = (previousState = initialCountyState, action) => {
  switch (action.type) {
    case 'SET_COUNTY_INFO':
      return {
        ...previousState,
        id: action.id,
        name: action.name,
        fips: action.fips,
        latitude: action.latitude,
        longitude: action.longitude,
        details: action.details,
        images: action.images,
        url: action.url,
      };
    case 'RESET_COUNTY_INFO':
      return {
        id: null,
        name: null,
        fips: null,
        latitude: null,
        longitude: null,
        details: null,
        url: null,
        images: [],
      };
    default:
      return previousState;
  }
};

export default countiesReducer;
