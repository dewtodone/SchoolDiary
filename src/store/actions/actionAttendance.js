import { GET_LEAVES_REQUEST, SAVE_LEAVES_REQUEST } from '../actions/actionTypes';
import { startLoading, stopLoading } from './index';
import GLOABAL_PATH from '../../utils/GlobalPath';
import axios from 'axios';
import Constants from '../../utils/Constants';
import GlobalPath from '../../utils/GlobalPath';

export const getLeavesRequest = (StdId, ClassId) => {
    return dispatch => {
        dispatch(startLoading());


        let url = GLOABAL_PATH.API_URL + 'DiaryAttendanceApi/GetLeavesRequest?StdId=' + StdId + '&ClassId=' + ClassId+"&ImagePath=" +  GlobalPath.USER_IMAGE_PATH;
        axios.get(url)
            .then(function (response, data) {
                let List = response.data.List;

                dispatch(SetLeavesRequest(List));
                dispatch(stopLoading());

            })
            .catch(function (error) {
                dispatch(stopLoading());
            });
    };
};

export const SetLeavesRequest = (List) => {
    return {
        type: GET_LEAVES_REQUEST,
        LeavesRequestList: List
    };
};


export const saveLeaveRequest = (LeaveRequest, propsNavigate) => {
    //  alert(JSON.stringify(LeaveRequest));
    return dispatch => {
        dispatch(startLoading());
        let url = GLOABAL_PATH.API_URL + 'DiaryAttendanceApi/SaveLeavesRequest';        
        // axios.post(url,{data : LeaveRequest})
        axios({method: 'post', url: url, data: LeaveRequest})
            .then(function (response, data) {
                debugger;
                dispatch(stopLoading());
                if (response.data.Message === Constants.ApiResponse.Success)
                {
                    dispatch(getLeavesRequest(LeaveRequest.StudentId, LeaveRequest.ClassId));                   
                    dispatch(stopLoading());
                    alert('Saved Successfully');
                    propsNavigate.navigation.navigate(Constants.Navigation.Attendance);
                }
                else{
                    dispatch(stopLoading());
                    alert(response.data.Message);
                }
              
            })
            .catch(function (error) {
                alert(error);
                alert('Something Wrong!!');
                dispatch(stopLoading());
            });
    }
}