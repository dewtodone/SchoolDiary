import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { DeviceUniqueId,getUserId } from '../../utils/UserTypeFunc';
import { setOneSignalPlayerId, OneSignalInitialized } from './LoginUserInfo';
// import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';
import { setRouteFromPushNotification,studentChanged,getSubDashboardMenu,getDashboardMenu, removeNotificationCount } from '../../store/actions/index';
import NavigationService from './../Navigation/NavigationService';
import Constants from '../../utils/Constants';
import GLOBAL_PATH from '../../utils/GlobalPath';
import axios from 'axios';
import SubDashboard from '../../Screens/General/SubDashboard';
let OneSignal = OneSignalInitialized();
class OneSignalPushNotication extends React.Component {
    constructor(properties) {
        super(properties);

        let requiresConsent = false;

        this.state = {
            emailEnabled: false,
            animatingEmailButton: false,
            initialOpenFromPush: 'Did NOT open from push',
            activityWidth: 0,
            width: 0,
            activityMargin: 0,
            buttonColor: Platform.OS == 'ios' ? '#ffffff' : '#d45653',
            jsonDebugText: '',
            privacyButtonTitle: 'Privacy Consent: Not Granted',
            inAppIsPaused: true,
            requirePrivacyConsent: requiresConsent,

        };

        // OneSignal.init(' 352bacb9-bac2-4942-9c70-432d4b7d8709', {
        //     kOSSettingsKeyAutoPrompt: true,
        // });
        //OneSignal.setRequiresUserPrivacyConsent(requiresConsent);
        // OneSignal.init('77218782-8c69-437e-805f-240623ce8198', {
        //     kOSSettingsKeyAutoPrompt: true,
        // });

        OneSignal.setLogLevel(6, 0);

        // Examples for using native IAM public methods
        // this.oneSignalInAppMessagingExamples();

        // Examples for using native Outcome Event public methods
        // this.oneSignalOutcomeEventsExamples();

    }

    async componentDidMount() {
        var providedConsent = await OneSignal.userProvidedPrivacyConsent();

        this.setState({
            privacyButtonTitle: `Privacy Consent: ${providedConsent ? 'Granted' : 'Not Granted'
                }`,
            privacyGranted: providedConsent,
        });

        OneSignal.setLocationShared(true);

        OneSignal.inFocusDisplaying(2);

        this.onReceived = this.onReceived.bind(this);
        this.onOpened = this.onOpened.bind(this);
        this.onIds = this.onIds.bind(this);
        this.onEmailRegistrationChange = this.onEmailRegistrationChange.bind(this);
        this.onInAppMessageClicked = this.onInAppMessageClicked.bind(this);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.addEventListener(
            'emailSubscription',
            this.onEmailRegistrationChange,
        );
        OneSignal.addEventListener(
            'inAppMessageClicked',
            this.onInAppMessageClicked,
        );


    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        OneSignal.removeEventListener(
            'emailSubscription',
            this.onEmailRegistrationChange,
        );
        OneSignal.removeEventListener(
            'inAppMessageClicked',
            this.onInAppMessageClicked,
        );
    }


    onEmailRegistrationChange(registration) {
        console.log('onEmailRegistrationChange: ', registration);
    }

    onReceived(notification) {
        console.log('Notification received: ', notification);

        // this.setState({
        //     jsonDebugText: 'RECEIVED: \n' + JSON.stringify(notification, null, 2),
        // });
        // console.log('Data: ', openResult.notification.payload.additionalData);
        let DashboardId = notification.payload.additionalData.DashboardId;
        let UserId = getUserId(this.props.SelectedUser);
        this.props.OnGetDashboardMenu(UserId);
        this.props.OnGetSubDashboardMenu(UserId, DashboardId);
        
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);

        this.setState({
            jsonDebugText:
                'OPENED: \n' + JSON.stringify(openResult.notification, null, 2),
        });
        let ActivityType = openResult.notification.payload.additionalData.Type;
        let SubDashboardId = openResult.notification.payload.additionalData.SubDashboardId;
        let DashboardId = openResult.notification.payload.additionalData.DashboardId;
        let PushNotificationClassIds = openResult.notification.payload.additionalData.ClassIds;
        console.log(JSON.stringify(this.props.SelectedUser));
        if (this.props.SelectedUser != null) {
            this.RemoveNotificationCount(SubDashboardId);
            if (this.props.SelectedUser.UserType === Constants.UserType.Parent) {
                let StudentId = 0;
                let ClassIdsList = PushNotificationClassIds.split(',');
                for (let i = 0; i < this.props.StudentOrClassList.length; i++) {
                    for (let j = 0; j < ClassIdsList.length; j++) {
                        if (parseInt(ClassIdsList[j]) === parseInt(this.props.StudentOrClassList[i].ClassId)) {
                            StudentId = this.props.StudentOrClassList[i].Id;
                            break;
                        }
                    }
                    if (StudentId > 0) {
                        break;
                    }
                }

                //if (StudentId > 0)
                if (StudentId != this.props.SelectedUser.Id)
                {
                    setTimeout(() => {
                        this.props.onStudentChanged(StudentId);
                    }, 2000);
                   
                }
            }
            // else {
            // //if (this.props.SelectedUser.UserType === Constants.UserType.Admin){
            //     let ClassId = 0;
            //     let ClassIdsList = PushNotificationClassIds.split(',');
            //     for (let i = 0; i < this.props.StudentOrClassList.length; i++) {
            //         for (let j = 0; j < ClassIdsList.length; j++) {
            //             if (parseInt(ClassIdsList[j]) === parseInt(this.props.StudentOrClassList[i].ClassId)) {
            //                 ClassId = ClassIdsList[j];
            //                 break;
            //             }
            //         }
            //         if (ClassId > 0) {
            //             break;
            //         }
            //     }

            //     //if (StudentId > 0)
            //     if (ClassId != this.props.SelectedUser.ClassId)
            //     {
            //         try
            //         {
            //         this.props.onStudentChanged(ClassId);
            //         }catch{}
            //         // setTimeout(() => {
                        
            //         // }, 2000);
                   
            //     }
            // }
            // alert('hey NavigationService');
            //NavigationService.navigate('ForNavigationTest');
            NavigationService.navigate(ActivityType);
        }
        else {
            // alert('hey props naviagate');
            this.props.onSetRouteFromPushNotification(ActivityType, PushNotificationClassIds,SubDashboardId,DashboardId);
        }
    }

    RemoveNotificationCount(SubDashboardId) {
        let UserId = getUserId(this.props.SelectedUser);
        // this.props.OnRemoveNotificationCount(SubDashboardId,UserId);

        let url = GLOBAL_PATH.API_URL + Constants.ApiController.MobileDashboardApi + Constants.Actions.MobileDashboardApi.RemoveDashboardCountMenu + '?UserId=' + UserId+ '&DashboardId=' + SubDashboardId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            });
    }

    onIds(device) {
        var id = DeviceUniqueId();
        setOneSignalPlayerId(device.userId);
        OneSignal.sendTags({ "DeviceUniqueId": id });
        // console.log("Device Unique Id:" + id);
        // console.log('Device info: ', device);
    }

    onInAppMessageClicked(actionResult) {
        console.log('actionResult: ', actionResult);
        this.setState({
            jsonDebugText: 'CLICKED: \n' + JSON.stringify(actionResult, null, 2),
        });
    }
    render() {
        return (
            <View />
        );
    }
}




const mapStateToProp = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        StudentOrClassList: state.reducerLogin.StudentOrClassList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetRouteFromPushNotification: (PageRoute,PushNotificationClassIds,SubDashboardId,DashboardId) => dispatch(setRouteFromPushNotification(PageRoute,PushNotificationClassIds,SubDashboardId,DashboardId)),
        onStudentChanged: (StdId) => dispatch(studentChanged(StdId)),
        OnGetSubDashboardMenu: (UserId, DashboardId) => dispatch(getSubDashboardMenu(UserId, DashboardId)),
        OnGetDashboardMenu: (UserId) => dispatch(getDashboardMenu(UserId)),
        //OnRemoveNotificationCount: (SubDashboardId,UserId) => dispatch(removeNotificationCount(SubDashboardId,UserId )),
    };
}

export default connect(mapStateToProp, mapDispatchToProps)(OneSignalPushNotication);