import { LOGIN, LOGOUT, STUDENT_CHANGED, CLASS_CHANGED, APP_VERSION, FORGOT_PASSWORD, FORGOT_PASSWORD_INFO, OTP_MODAL, ONE_SIGNAL_ROUTE } from './actionTypes';
import { startLoading, stopLoading, getActivities, getLeavesRequest, removeNotificationCount,setDashboardId } from './index';
import { DeviceUniqueId } from '../../utils/UserTypeFunc';
// import { getOneSignalPlayerId} from '../../General/LoginUserInfo';
import axios from 'axios';

import { setUserInfo, OneSignalInitialized, getOneSignalPlayerId } from '../../components/General/LoginUserInfo';
import Constants from '../../utils/Constants';

import GLOABAL_PATH from '../../utils/GlobalPath';
import store from '../configureStore';
import { connect } from 'react-redux';

import { Platform } from 'react-native';
import GlobalPath from '../../utils/GlobalPath';

import NavigationService from './../../../src/components/Navigation/NavigationService';

export const login = (userName, password, PlayerId, propsNavigate) => {
    return (dispatch, getState) => {
        dispatch(startLoading());
        let VersionParam = '';


        if (Platform.OS === 'ios') {
            VersionParam = GLOABAL_PATH.APP_VERSION_IOS + '&Platform=' + Platform.OS;
        }
        else {
            VersionParam = GLOABAL_PATH.APP_VERSION_ANDROID + '&Platform=' + Platform.OS;
        }


        let url = GLOABAL_PATH.API_URL + 'LoginApi/GetAppVersion?AppName=' + GLOABAL_PATH.APP_NAME + "&CurrentVersion=" + VersionParam;
        axios.get(url)
            .then((respAppVersion) => {
                // dispatch(stopLoading());
                let objAppVersion = respAppVersion.data.AppVersion;
                if (objAppVersion) {

                    if (objAppVersion.AppVersionAndroid !== GLOABAL_PATH.APP_VERSION_ANDROID && Platform.OS === 'android') {
                        dispatch(setAppVersionInfo(objAppVersion));
                        dispatch(stopLoading());
                    }
                    else if (objAppVersion.AppVersionIos !== GLOABAL_PATH.APP_VERSION_IOS && Platform.OS === 'ios') {
                        dispatch(setAppVersionInfo(objAppVersion));
                        dispatch(stopLoading());
                    }
                    else {
                        if (userName != '') {
                            url = GLOABAL_PATH.API_URL + 'LoginApi/Login?username=' + userName + '&password=' + password + '&DeviceId=' + DeviceUniqueId() + '&PlayerId=' + PlayerId;

                            axios.get(url)


                                // axios.get('http://192.168.10.40:8002/api/LoginApi?username=01-002-30556&password=ngsparent')
                                //     axios.post('http://192.168.1.218:8002/ApiSMS/api/LoginApi?username=01-002-30556&password=ngsparent', {        
                                //     userName: 'test',
                                //     userusername: this.state.username,
                                //     userPassword: this.state.password
                                //   } )
                                .then(function (response, data) {
                                    // if (response.data.Message)
                                    // alert(response.data.Students[0]);
                                    // alert(response.data.UserType);
                                    //dispatch(stopLoading());
                                    // dispatch(stopLoading());
                                    let userData = response.data;
                                    let msg = userData.Message;
                                    //alert(msg);
                                    // dispatch(stopLoading());
                                    if (msg === Constants.ApiResponse.Success) {

                                        if (userData.StudentOrClassList.length > 0) {
                                            setUserInfo(userName, password).then((response) => {
                                                //this callback is executed when your Promise is resolved
                                                // setUserInfo(userName,password);

                                                // alert(userData.StudentOrClassList[0].UserId);
                                                // let UserId = userData.StudentOrClassList[0].UserId;

                                                // if (!userData.StudentOrClassList[0].IsUserSubcribed) {
                                                //     let OneSignal = OneSignalInitialized();
                                                //     OneSignal.sendTags({ "UserPkId":  UserId });
                                                //     console.log(PlayerId);
                                                //     dispatch(UserSubscribedData(PlayerId,UserId));
                                                // }
                                                let StdIndex = -1;
                                                let PushNotificationClassIds = getState().reducerLogin.PushNotificationClassIds;
                                                if (PushNotificationClassIds != null) {

                                                    // in each userData.StudentOrClassList list UserType must be present so dnt worry
                                                    if (userData.StudentOrClassList[0].UserType === Constants.UserType.Parent) {
                                                        if (userData.StudentOrClassList.length > 1) { //if students are more than one of any parent

                                                            let ClassIdsList = PushNotificationClassIds.split(',');
                                                            for (let i = 0; i < userData.StudentOrClassList.length; i++) {
                                                                for (let j = 0; j < ClassIdsList.length; j++) {
                                                                    if (parseInt(ClassIdsList[j]) === parseInt(userData.StudentOrClassList[i].ClassId)) {
                                                                        StdIndex = i;
                                                                        break;
                                                                    }
                                                                }
                                                                if (StdIndex >= 0) {
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }

                                                    PushNotificationClassIds = null;
                                                }

                                                if (StdIndex === -1) {
                                                    StdIndex = 0;
                                                }
                                                dispatch(setLogin(userData, StdIndex));



                                                let PageRoute = getState().reducerLogin.PageRoute;
                                                let SubDashboardId = getState().reducerLogin.PushNotificationSubDashboardId;
                                                let DashboardId = getState().reducerLogin.PushNotificationDashboardId
                                                dispatch(setDashboardId(DashboardId));
                                                if (PageRoute === null) {
                                                    propsNavigate.navigate("App");
                                                } else {
                                                    //dispatch(removeNotificationCount(SubDashboardId, userData.StudentOrClassList[StdIndex].Id));
                                                    
                                                    let url = GLOABAL_PATH.API_URL + Constants.ApiController.MobileDashboardApi + Constants.Actions.MobileDashboardApi.RemoveDashboardCountMenu + '?UserId=' + userData.StudentOrClassList[StdIndex].StudentUserId+ '&DashboardId=' + SubDashboardId;
                                                    axios.get(url)
                                                        .then((resp) => {
                                                            let info = resp.data;
                                                        })
                                                        .catch((error) => {
                                                            alert(error)
                                                            console.log(error);
                                                        });
                                                    
                                                    propsNavigate.navigate(PageRoute);
                                                }
                                                dispatch(stopLoading());
                                            }).catch((error) => {
                                                dispatch(stopLoading());
                                                //this callback is executed when your Promise is rejected
                                                //console.log('Promise is rejected with error: ' + error);
                                            });
                                        } else {
                                            // dispatch(stopLoading());
                                            dispatch(stopLoading());
                                            if (Constants.UserType.Teacher) {
                                                alert("You are not authroized of any class")
                                            } else if (Constants.UserType.Parent) {
                                                alert("No Student Found");
                                            } else {
                                                alert("You are not authorized");
                                            }

                                        }

                                    } else if (msg === Constants.ApiResponse.InvalidUserNamePassword) {
                                        dispatch(stopLoading());
                                        alert(msg);
                                    }
                                    else {
                                        dispatch(stopLoading());
                                        alert(Constants.DisMsg.SomeThingWrong);
                                    }

                                })
                                .catch(function (error) {
                                    dispatch(stopLoading());
                                    console.log(error);
                                    //dispatch(stopLoading());
                                    alert(error);
                                });
                        }//If USername is not empty
                        else {
                            dispatch(stopLoading());
                        }
                    }//If COndidtion of App Version Check
                }//If condition of objAppVersion
                else {
                    dispatch(stopLoading());
                }
            })//Then Call back respAppVersion
            .catch((error) => {
                dispatch(stopLoading());
                console.log(error);
                alert(error);
            });
    };
};


export const setLogin = (data, StdIndex) => {
    return {
        type: LOGIN,
        StudentOrClassList: data.StudentOrClassList,
        UserType: data.UserType,
        StdIndex: StdIndex
    };
};

export const setAppVersionInfo = (AppVersionInfo) => {
    return {
        type: APP_VERSION,
        appVersionModalVisible: true,
        AppVersionInfo: AppVersionInfo
    };
};

export const studentChanged = (StdIdOrClassId) => {

    return (dispatch, getState) => {
        // dispatch(startLoading());
        let StudentId = 0;
        let ClassId = 0;
        let SelectedUser = null;
        let userType = getState().reducerLogin.SelectedUser.UserType;
        if (userType === Constants.UserType.Parent) {
            SelectedUser = getState().reducerLogin.StudentOrClassList.find(std => {
                return std.Id == StdIdOrClassId;
            });
        } else {
            SelectedUser = getState().reducerLogin.StudentOrClassList.find(c => {
                return c.ClassId == StdIdOrClassId;
            });
        }

        let SelectedTab = getState().reducerActivities.ActivitySelectedTab;
        //   alert(SelectedStudent.StudentName);
        if (SelectedUser.UserType === Constants.UserType.Parent) {
            dispatch(studentChangedDispatch(StdIdOrClassId));
            StudentId = SelectedUser.Id;
            ClassId = SelectedUser.ClassId;
        }
        else {
            dispatch(classChangedDispatch(StdIdOrClassId));
            ClassId = StdIdOrClassId;
        }

       
            NavigationService.navigate('FakeScreen');
        

        //dispatch(getActivities(StudentId, ClassId, SelectedUser.UserType, SelectedTab, GLOABAL_PATH.ACTIVITY_IMAGES));


        // let NavigateTab = 'Activity';
        // if (SelectedTab === 'Activity') {
        //     NavigateTab = 'Notice';
        // }

        // this.setTimeout(() => {
        //     NavigationService.navigate('MainDashboard');
        // }, 1500)

        //dispatch(getLeavesRequest(StudentId, ClassId));

        //dispatch(getActivities(SelectedStudent.Id,SelectedStudent.ClassId, "Activity",GLOABAL_PATH.ACTIVITY_IMAGES));
        //    alert(SelectedStudent.StudentName);

        // dispatch(stopLoading());
    }
}

export const forgotPassword = (MobileNo) => {
    return (dispatch, getState) => {
        dispatch(startLoading());
        let url = GLOABAL_PATH.API_URL + 'LoginApi/ForgotPassword?MobileNo=' + MobileNo;
        axios.get(url)
            .then((resp) => {
                if (resp.data.Message === Constants.ApiResponse.Success) {
                    dispatch(setForgotPasswordInfo(false, resp.data.LoginInfo));
                    alert(Constants.DisMsg.ForgotPasswordSuccesfull);
                }
                else {
                    alert(Constants.DisMsg.ForgotPasswordError);
                }
                dispatch(stopLoading());
            })
            .catch((err) => {
                console.log(err);
                dispatch(stopLoading());
            });
    }
}

export const setForgotPassword = (forgotPasswordModalVisible) => {
    return {
        type: FORGOT_PASSWORD,
        forgotPasswordModalVisible: forgotPasswordModalVisible
    }
}

export const setOTPModal = (isVisible) => {
    return {
        type: OTP_MODAL,
        OTPVisible: isVisible
    }
}


export const setRouteFromPushNotification = (PageRoute, PushNotificationClassIds, SubDashboardId,DashboardId) => {
    return {
        type: ONE_SIGNAL_ROUTE,
        PageRoute: PageRoute,
        PushNotificationClassIds: PushNotificationClassIds,
        PushNotificationSubDashboardId : SubDashboardId,
        PushNotificationDashboardId : DashboardId
    };
}



export const setForgotPasswordInfo = (forgotPasswordModalVisible, LoginInfo) => {
    return {
        type: FORGOT_PASSWORD_INFO,
        forgotPasswordModalVisible: forgotPasswordModalVisible,
        LoginInfo: LoginInfo
    }
}

// export const studentChangedDispatch = (StdId) => {
//     return (dispatch) => {
//         dispatch(startLoading());
//         let url = GLOABAL_PATH.API_URL + 'LoginApi/Login1';

//         axios.get(url)
//             .then(function (response, data) {

//                 dispatch(studentChangedDispatch1(StdId));
//                 dispatch(stopLoading());
//             })
//     }
// }

// export const UserSubscribedData = (PlyarId, UserId) => {
//     let url = GLOABAL_PATH.API_URL + 'LoginApi/SubscribeUsers?PlayerId=' + PlyarId + '&UserId=' + UserId+"&DeviceId=" + DeviceUniqueId();
//    axios.get(url)
//     .then(function (response, data) {
//         console.log(response.data.Message);
//     })
//     .catch(error => {
//         console.log(error);
//     });
// }

export const studentChangedDispatch = (StdId) => {

    return {
        type: STUDENT_CHANGED,
        StdId: StdId
    }
}

export const classChangedDispatch = (ClassId) => {

    return {
        type: CLASS_CHANGED,
        ClassId: ClassId
    }
} 
