const fetchResults = () => (dispatch) => {
  dispatch({ type: 'LOADING' });
  return fetch('http://localhost:3000/api/v1/states/3/counties')
    .then(res => res.json())
    .then((countyData) => {
      // fetchCandidateDetails(countyData.counties[0].results[0]);
      dispatch(countyResults(countyData));
    });
};

// const fetchCandidateDetails = (resultsList) => {
//   fetch('http://localhost:3000/api/v1/candidates')
//     .then(res => res.json())
//     .then((candidateInfo) => {
//       const candidates = Object.keys(resultsList);
//       const found = candidateInfo.data.filter(fetchedCandidates =>
//         candidateInfo.includes(fetchedCandidates.id))
//       console.log(found);
//     });
// };

const candidateInfo = (candidates) => {
  console.log(candidates);
};

const countyResults = response => ({
  type: 'COUNTY_RESULTS',
  stateName: response.state,
  electionResults: response,
});

export { fetchResults };
