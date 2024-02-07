import { START_LOADING, STOP_LOADING } from '../actions/actionTypes';

export const startLoading = () =>{
    return {
        type: START_LOADING
    };
};

export const stopLoading = () =>{
    return {
      type:STOP_LOADING  
    };
};


