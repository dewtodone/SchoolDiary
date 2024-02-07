import { GET_ACTIVITY, GET_NOTICE, GET_HOMEWORK, GET_STUDENTS, SAVE_ACTIVITY } from '../actions/actionTypes';
import Constants from '../../utils/Constants';
const initilState = {
    ActivitiesList: [],
    NoticeList: [],
    HomeworkList: [],
    ActivitySelectedTab: 'Activity',
    StudentList: []
};

const reducer = (state = initilState, action) => {
    switch (action.type) {
        case GET_ACTIVITY:

            return {
                ...state,
                ActivitiesList: action.ActivitiesList.filter(type => type.ActivityType === Constants.ActivityType.Activity),
                NoticeList: action.ActivitiesList.filter(type => type.ActivityType === Constants.ActivityType.Notice),
                HomeworkList: action.ActivitiesList.filter(type => type.ActivityType === Constants.ActivityType.Homework),
                ActivitySelectedTab: action.ActivitySelectedTab
            };
        case GET_NOTICE:
            // alert('adasd');
            return {
                ...state,
                NoticeList: action.NoticeList,
                ActivitySelectedTab: action.ActivitySelectedTab
            };
        case GET_HOMEWORK:
            return {
                ...state,
                HomeworkList: action.HomeworkList,
                ActivitySelectedTab: action.ActivitySelectedTab
            };

        case GET_STUDENTS:
            return {
                ...state,
                StudentList: action.StudentList
            };
        default:
            return state;
    };
};

export default reducer;