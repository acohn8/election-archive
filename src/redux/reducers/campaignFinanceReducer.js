const initialFinanceState = {
  financeData: {},
};

const campaignFinanceReducer = (previousState = initialFinanceState, action) => {
  switch (action.type) {
    case 'SET_FINANCE_DATA':
      return {
        ...previousState,
        financeData: action.financeData,
      };
    case 'RESET_FINANCE_DATA':
      return {
        ...previousState,
        financeData: {},
      };
    default:
      return previousState;
  }
};

export default campaignFinanceReducer;
