import { GET_DASHBOARD_MENU,GET_SUB_DASHBOARD_MENU,SET_DASHBOARD_ID } from '../actions/actionTypes';
const initialState = {
    lstDashboardMenu : [],
    lstSubDashboardMenu : [],
    DashboardId : null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DASHBOARD_MENU:
            return {
                ...state,
                lstDashboardMenu: action.lstDashboardMenu,             
            };
            case GET_SUB_DASHBOARD_MENU:
            return {
                ...state,
                lstSubDashboardMenu: action.lstSubDashboardMenu, 
                DashboardId : action.DashboardId            
            };
            case SET_DASHBOARD_ID:
                return {
                    ...state, 
                    DashboardId : action.DashboardId            
                };
            
        default:
            return state;
    }
}

export default reducer;