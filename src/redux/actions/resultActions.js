const fetchResults = () => dispatch =>
  fetch('http://localhost:3000/api/v1/states/3/counties')
    .then(res => res.json())
    .then(countyData => dispatch(countyResults(countyData)));

const countyResults = response => ({
  type: 'COUNTY_RESULTS',
  stateName: response.name,
  stateFips: response.fips,
  electionResults: response.counties,
});

export { fetchResults };
