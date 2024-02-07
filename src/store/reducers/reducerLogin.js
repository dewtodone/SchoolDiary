import { LOGIN, STUDENT_CHANGED, CLASS_CHANGED, APP_VERSION, FORGOT_PASSWORD,FORGOT_PASSWORD_INFO,OTP_MODAL ,ONE_SIGNAL_ROUTE} from '../actions/actionTypes';
import { getClassOrStdId } from '../../utils/UserTypeFunc';

const initialState = {
    //StudentName: 'STudent Name intial',
    //ClassName: '',
    StudentOrClassList: [],
    UserType: '',
    SelectedUser: null,
    appVersionModalVisible: false,
    forgotPasswordModalVisible: false,
    OTPVisible: false,
    AppVersionInfo: [],
    LoginInfo: [],
    PageRoute: null,
    PushNotificationClassIds : null,
    PushNotificationSubDashboardId : null,
    PushNotificationDashboardId : null
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                SelectedUser: action.StudentOrClassList[action.StdIndex],
                // StudentName: action.StudentOrClassList[0].StudentName,
                StudentOrClassList: action.StudentOrClassList,
                UserType: action.UserType,
                appVersionModalVisible: false
                //ClassName : action.StudentOrClassList[0].ClassName
            };
        case STUDENT_CHANGED:
            return {
                ...state,
                SelectedUser: state.StudentOrClassList.find(std => {
                    return std.Id === action.StdId;
                })
            };
        case APP_VERSION:
            return {
                ...state,
                appVersionModalVisible: action.appVersionModalVisible,
                AppVersionInfo: action.AppVersionInfo
            };

        case FORGOT_PASSWORD: 
        return {
            ...state,
            forgotPasswordModalVisible : action.forgotPasswordModalVisible,
            OTPVisible: action.forgotPasswordModalVisible === true ? false: true
        };
        case FORGOT_PASSWORD_INFO: 
        return {
            ...state,
            // forgotPasswordModalVisible : action.forgotPasswordModalVisible,
            LoginInfo: action.LoginInfo,
            OTPVisible : true,
        };
        case OTP_MODAL: 
        return {
            ...state,
            OTPVisible : action.isVisible,
            
        };
        case CLASS_CHANGED:
            return {
                ...state,
                SelectedUser: state.StudentOrClassList.find(clas => {
                    return clas.ClassId === action.ClassId;
                })
            };
            case ONE_SIGNAL_ROUTE:
                return{
                    ...state,
                    PageRoute: action.PageRoute,
                    PushNotificationClassIds : action.PushNotificationClassIds,
                    PushNotificationSubDashboardId : action.PushNotificationSubDashboardId,
                    PushNotificationDashboardId : action.PushNotificationDashboardId
                }
        default:
            return state;
    }
}

export default reducer;