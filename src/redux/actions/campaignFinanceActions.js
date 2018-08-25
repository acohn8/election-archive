import axios from 'axios';

const fetchCampaignFinanceData = candidateIds => async (dispatch) => {
  const response = await axios.get(`http://localhost:3000/api/v1/candidates/campaign-finance/${candidateIds}`);
  dispatch({ type: 'SET_FINANCE_DATA', financeData: response.data });
};

const resetCampaignFinanceData = () => dispatch => dispatch({ type: 'RESET_FINANCE_DATA' });

export { fetchCampaignFinanceData, resetCampaignFinanceData };
