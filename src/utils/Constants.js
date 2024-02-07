export default {
    Colors: {
        // headerBackColor : '#0D47A1',
        // headerColor : '#fff',
        // StatusBarColor: '#1A237E',

        headerBackColorBlue: '#29176d',
        whiteColor: '#fff',

        headerBackColor: '#7d1f7d',
        headerColor: '#EEFF41',
        StatusBarColor: '#1A237E',
        yellowColor: '#fff212',

        cardBlackColor: '#212121',
        CardGrayColor: "#757575",
        FullBlackColor: '#000',
        Attendance:{
            Present: 'green',
            Absent: 'red',
            Leave : 'blue',
            Late : 'orange'
        }
    },
    ApiResponse: {
        Success: 'Success',
        InvalidUserNamePassword: "Invalid Username OR Password",

    },

    

    DisMsg: {
        SomeThingWrong: "SomeThing Wrong. Please try again Later",
        ForgotPasswordSuccesfull: "OTP have been sent to your mobile pohone. Please Enter OTP for further processing!!!",
        ForgotPasswordError: "Please enter correct mobile no OR contact your school for credentials",
        InvalidOTP: 'Please enter valid OTP OR Click on Resend OTP',
        SavedSuccessfully: "Saved Successfully!!!",
        DeletedSuccessfully: "Deleted Successfully!!!",
    },
    ActivityType: {
        Activity: 'Activity',
        Notice: 'Notice',
        Homework: 'Homework',
        Attendance: 'Attendance'
    },

    LeavesType: {
        Sick: 'Sick',
        Urgent: 'Urgent',
        Causal: 'Causal',
        Other: 'Other'
    },

    Navigation: {
        Attendance: 'Attendance',
    },
    UserType: {
        Parent: 'Parent',
        Teacher: 'Teacher',
        Admin: 'A'
    },
    SendActivityType: {
        Class: 'Class',
        Student: 'Student',
        Teacher: 'Teacher',
    },
    ApiController: {
        ActivityApi: 'ActivityApi/',
        ParentTeacherMeetingApi: 'ParentTeacherMeetingApi/',
        ELearningVideosApi: 'ELearningVideosApi/',
        FeeApi: 'FeeApi/',
        ExamAssessmentApi : 'ExamAssessmentApi/',
        LoginApi : 'LoginApi/',
        MobileDashboardApi: 'MobileDashboardApi/',
        StudentAttendanceApi: 'StudentAttendanceApi/',
        CitrixApi : 'CitrixApi/',
        DiaryAttendanceApi : 'DiaryAttendanceApi/'
    },

    Actions: {
        ELearningVideosApi: {
            GetLectureNotes: 'GetLectureNotes',
            GetOnlineLectures: 'GetOnlineLectures',
            GetAssignments : 'GetAssignments',
            GetAssignmentFiles : 'GetAssignmentFiles',
            SubmitAssignmentFiles : 'SubmitAssignmentFiles',
            SubmitAssignmentStudents : 'SubmitAssignmentStudents'
        },
        FeeApi : {
            GetStudentFeeChallanInfo: 'GetStudentFeeChallanInfo',
            SaveFileFeeReceipt : 'SaveFileFeeReceipt',
            SaveFeeReceipt: 'SaveFeeReceipt',
        },
        ExamAssessmentApi: {
            GetExamAssessmentList : 'GetExamAssessmentList',
            
        },
        LoginApi :{
            ParentProfile : 'ParentProfile',
            ChangeMobileNoOTP: 'ChangeMobileNoOTP',
            SaveMobileNo: 'SaveMobileNo',
            ChangeEmailOTP: 'ChangeEmailOTP',
            SaveEmail: 'SaveEmail'
        },
        MobileDashboardApi :{
            RemoveDashboardCountMenu : 'RemoveDashboardCountMenu',
        },
        StudentAttendanceApi:{
            StudentAttendanceSelection : 'StudentAttendanceSelection',
            StudentAttendanceUpdation: 'StudentAttendanceUpdation',
            AttendanceStudentCalendarSelection : 'AttendanceStudentCalendarSelection' 
        },
        CitrixApi:{
            GetCitrixUrl : 'GetCitrixUrl',
        },
        DiaryAttendanceApi:{
            GetLeavesRequestComments : 'GetLeavesRequestComments',
            SaveLeavesRequestComments : 'SaveLeavesRequestComments'
        }
    },

    ActivityApiFunc: {
        SaveActivity: 'SaveActivity',
        SaveFile: 'SaveFile',
        DeleteActivity : 'DeleteActivity',

    },
    ParentTeacherMeetingApiFunc: {
        SavePTM: 'SavePTM',


    },

    Platform: {
        ios: 'ios',
        android: 'android',
    },

    SubRoute: {
        AddLeaves: 'AddLeaves',
        AddActivity: 'AddActivity',
        AddHomework: 'AddHomework',
        AddNotice: 'AddNotice',
        AddPTM: 'AddPTM'
    },

    PTMType: {
        Scheduled: 'Scheduled',
        Requested: 'Requested'
    },
    IconLibrary:{
        Icon: 'IonIcon',
        FontAwesome : 'FontAwesome',
        MaterialIcons : 'MaterialIcons',
        SimpleLineIcons : 'SimpleLineIcons',
        MaterialCommunityIcons : 'MaterialCommunityIcons',
        FontAwesome5 : 'FontAwesome5',
        Entypo : 'Entypo',

    },
}
