const initialFinanceState = {
  financeData: {},
  loadingComplete: false,
};

const campaignFinanceReducer = (previousState = initialFinanceState, action) => {
  switch (action.type) {
    case 'SET_FINANCE_DATA':
      return {
        ...previousState,
        financeData: action.financeData,
        loadingComplete: true,
      };
    default:
      return previousState;
  }
};

export default campaignFinanceReducer;
