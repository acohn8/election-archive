import axios from 'axios';

const fetchOfficesList = () => async (dispatch) => {
  const response = await axios.get('http://localhost:3000/api/v1/offices');
  dispatch({ type: 'SET_OFFICES', offices: response.data.data });
};

export default fetchOfficesList;
