import GLOABAL_PATH from '../../utils/GlobalPath';
import { GET_DASHBOARD_MENU,GET_SUB_DASHBOARD_MENU,SET_DASHBOARD_ID } from './actionTypes';
import { startLoading, stopLoading } from './index';
import axios from 'axios';
import Constants from './../../utils/Constants';


export const getDashboardMenu = (UserId) => {
    return (dispatch, getState) => {
        dispatch(startLoading());
        let url = GLOABAL_PATH.API_URL + 'MobileDashboardApi/GetDashboardMenu?UserId=' + UserId;
        axios.get(url)
            .then((resp) => {
                if (resp.data.Message === Constants.ApiResponse.Success) {
                    dispatch(setDashboardMenu(resp.data.ListDashboard));
                }
                // else {
                //     alert(Constants.DisMsg.ForgotPasswordError);
                // }
                dispatch(stopLoading());
            })
            .catch((err) => {
                console.log(err);
                dispatch(stopLoading());
            });
    }
}

export const getSubDashboardMenu = (UserId, DashboardId) => {
    return (dispatch, getState) => {
       // dispatch(startLoading());
        let url = GLOABAL_PATH.API_URL + 'MobileDashboardApi/GetSubDashboardMenu?UserId=' + UserId + '&DashboardId=' + DashboardId;
        axios.get(url)
            .then((resp) => {
                if (resp.data.Message === Constants.ApiResponse.Success) {
                    dispatch(setSubDashboardMenu(resp.data.ListSubDashboard,DashboardId));
                }
                // else {
                //     alert(Constants.DisMsg.ForgotPasswordError);
                // }
                //dispatch(stopLoading());
            })
            .catch((err) => {
                console.log(err);
                //dispatch(stopLoading());
            });
    }
}

// export const removeNotificationCount = async (SubDashboardId, UserId) => {
//     let url = GLOABAL_PATH.API_URL + Constants.ApiController.MobileDashboardApi + Constants.Actions.MobileDashboardApi.RemoveDashboardCountMenu + '?UserId=' + UserId+ '&DashboardId=' + SubDashboardId;
//         axios.get(url)
//             .then((resp) => {
//                 let info = resp.data;
//             })
//             .catch((error) => {
//                 alert(error)
//                 console.log(error);
//             });
// }



export const setDashboardMenu = (lstDashboardMenu) => {
    return {
        type: GET_DASHBOARD_MENU,
        lstDashboardMenu: lstDashboardMenu
    }
}

export const setSubDashboardMenu = (lstSubDashboardMenu,DashboardId) => {
    return {
        type: GET_SUB_DASHBOARD_MENU,
        lstSubDashboardMenu: lstSubDashboardMenu,
        DashboardId: DashboardId
    }
}

export const setDashboardId = (DashboardId) => {
    return {
        type: SET_DASHBOARD_ID,
        DashboardId: DashboardId
    }
}

