import { GET_ACTIVITY, GET_NOTICE, GET_HOMEWORK,GET_STUDENTS, SAVE_ACTIVITY } from './actionTypes';
import GLOABAL_PATH from '../../utils/GlobalPath';
import Constants from '../../utils/Constants';
import { startLoading, stopLoading } from './index';
import axios from 'axios';
import { Platform} from 'react-native';
export const getActivities = (StdId, ClassId, UserType,ActivityType, ImagePath) => {
    return dispatch => {

        dispatch(startLoading());
       
        let PlatforomAndVersion = '';
        if (Platform.OS === Constants.Platform.ios)
        {
            PlatforomAndVersion = '&Platform=' + Platform.OS + '&AppVersion='+GLOABAL_PATH.APP_VERSION_IOS;
        } else{
            PlatforomAndVersion = '&Platform=' + Platform.OS + '&AppVersion='+GLOABAL_PATH.APP_VERSION_ANDROID;
        }

        let url = GLOABAL_PATH.API_URL + 'ActivityApi/GetActivities?StdId=' + StdId + '&ClassId=' + ClassId +  '&UserType=' + UserType + "&ActivityType=" + ActivityType + "&ImagePath=" + ImagePath + PlatforomAndVersion;
        axios.get(url)
            .then(function (response, data) {
                //dispatch(stopLoading());
                let List = response.data.ActivityList;

                // let ActivitiesList = List.filter(type => type.ActivityType === Constants.ActivityType.Activity);
                // let NoticeList = List.filter(type => type.ActivityType === Constants.ActivityType.Notice);
                // let NoticeList = List.find(function (type) {
                //     return
                //     type.ActivityType === Constants.ActivityType.Notice;
                // }
                // );

console.log(List);

                dispatch(setActivitiesList(List, ActivityType));
                setTimeout(() =>{
                    dispatch(stopLoading());
                },500);
                
               
                // dispatch(setNoticeList(NoticeList, ActivityType));

                // if (ActivityType == Constants.ActivityType.Activity) {
                //     dispatch(setActivitiesList(List, ActivityType));
                // } else if (ActivityType == Constants.ActivityType.Notice) {
                //     dispatch(setNoticeList(List, ActivityType));
                // } else if (ActivityType == Constants.ActivityType.Homework) {
                //     dispatch(setHomeworkList(List, ActivityType));
                // }

                
            })
            .catch(function (error) {
                setTimeout(() =>{
                    dispatch(stopLoading());
                },500);
            });
    }
}



export const getNotices = (StdId, ClassId, ActivityType, ImagePath) => {
    return dispatch => {

        dispatch(startLoading());

        let url = GLOABAL_PATH.API_URL + 'ActivityApi/GetActivities?StdId=' + StdId + '&ClassId=' + ClassId + "&type=" + ActivityType + "&ImagePath=" + ImagePath;
        axios.get(url)
            .then(function (response, data) {
                let List = response.data.ActivityList;




                dispatch(setNoticeList(List, ActivityType));


                dispatch(stopLoading());
            })
            .catch(function (error) {
                dispatch(stopLoading());
            });
    }
}



export const setActivitiesList = (data, selectedTab) => {
    return {
        type: GET_ACTIVITY,
        ActivitiesList: data,
        ActivitySelectedTab: selectedTab

    };
};


export const setNoticeList = (data, selectedTab) => {
    return {
        type: GET_NOTICE,
        NoticeList: data,
        ActivitySelectedTab: selectedTab

    };
};

export const setHomeworkList = (data, selectedTab) => {
    return {
        type: GET_HOMEWORK,
        HomeworkList: data,
        ActivitySelectedTab: selectedTab

    };
};

export const getStudents = lstClassId => {
    return dispatch => {

        dispatch(startLoading());

        let url = GLOABAL_PATH.API_URL + 'ActivityApi/GetStudents?ClassIds=' + lstClassId;
        axios.get(url)
            .then(function (response, data) {
                let StudentList = response.data.StudentList;
                dispatch(setStudents(StudentList))
                dispatch(stopLoading());
            })
            .catch(function (error) {
                dispatch(stopLoading());
            });
    }
};

const setStudents = StudentList =>{
    return{
        type: GET_STUDENTS,
        StudentList : StudentList
    }
}


export const saveActivity = Activity => {
    return {

    };
}