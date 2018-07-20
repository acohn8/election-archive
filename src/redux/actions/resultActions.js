const fetchResults = () => (dispatch) => {
  dispatch({ type: 'LOADING' });
  return fetch('http://localhost:3000/api/v1/states/3/counties')
    .then(res => res.json())
    .then(countyData => dispatch(countyResults(countyData)));
};
const countyResults = response => ({
  type: 'COUNTY_RESULTS',
  stateName: response.state,
  electionResults: response,
});

export { fetchResults };
