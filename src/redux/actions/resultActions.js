import axios from 'axios';

const fetchStateData = () => async (dispatch) => {
  dispatch({ type: 'LOADING' });
  const url = 'http://localhost:3000/api/v1';
  const response = await Promise.all([
    axios.get(`${url}/states/3/counties`),
    axios.get(`${url}/states/3/candidates`),
    axios.get(`${url}/states/3/results`),
  ]);
  const geography = response[0].data;
  const candidates = response[1].data.data;
  const countyResults = response[2].data;
  dispatch({
    type: 'SET_STATE_DATA',
    geography,
    candidates,
    countyResults,
  });
};

export { fetchStateData };
