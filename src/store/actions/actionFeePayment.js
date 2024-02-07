
import { SET_FEE_PAYMENT_INFO } from './actionTypes';
// import {  } from './index';

export const setFeePaymentInfo = (FeePaymentInfo) => {
    return {
        type: SET_FEE_PAYMENT_INFO,
        FeePaymentInfo: FeePaymentInfo
    }
}
