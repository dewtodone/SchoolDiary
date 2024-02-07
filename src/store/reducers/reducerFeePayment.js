import { SET_FEE_PAYMENT_INFO} from '../actions/actionTypes';
import { getClassOrStdId } from '../../utils/UserTypeFunc';

const initialState = {
    FeePaymentInfo: null,
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FEE_PAYMENT_INFO:
            return {
                ...state,
                FeePaymentInfo: action.FeePaymentInfo,
            };
        default:
            return state;
    }
}

export default reducer;