import axios from 'axios';

const fetchCampaignFinanceData = candidateIds => async (dispatch) => {
  dispatch(resetCampaignFinanceData());
  const response = await axios.get(`https://election-data-2016.herokuapp.com/api/v1/candidates/campaign-finance/${candidateIds}`);
  dispatch({ type: 'SET_FINANCE_DATA', financeData: response.data });
};

const resetCampaignFinanceData = () => dispatch => dispatch({ type: 'RESET_FINANCE_DATA' });

export { fetchCampaignFinanceData, resetCampaignFinanceData };