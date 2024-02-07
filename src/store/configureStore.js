

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from "redux-thunk";


import reducerLogin from './reducers/reducerLogin';
import reducerUi from './reducers/reducerUi';
import reducerActivities from './reducers/reducerActivities';
import reducerAttendance from './reducers/reducerAttendance';
import reducerFeePayment from './reducers/reducerFeePayment';
import reducerDashboard from './reducers/reducerDashboard';

const rootReducer = combineReducers({
     reducerLogin,
     reducerUi,
     reducerActivities,
     reducerAttendance,
     reducerFeePayment,
     reducerDashboard
});

let composeEnhancers = compose;
if (__DEV__){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} 

const configureStore =() => {
    return createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;