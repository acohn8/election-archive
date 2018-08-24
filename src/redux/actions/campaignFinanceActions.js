import axios from 'axios';

const fetchCampaignFinanceData = candidateIds => async (dispatch, getState) => {
  const response = await Promise.all(candidateIds.map(id =>
    axios.get(`http://localhost:3000/api/v1/candidates/campaign-finance/${id}`)));
  console.log(response.map(res => res.data.results[0]));
};

const resetResults = () => ({ type: 'RESET_RESULTS' });

export default fetchCampaignFinanceData;
