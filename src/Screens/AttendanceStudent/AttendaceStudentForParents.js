import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";

import Constants from '../../utils/Constants';
import { connect } from 'react-redux';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import GlobalPath from '../../utils/GlobalPath';
import { startLoading, stopLoading } from './../../store/actions/index';

import { PieChartWithCenteredLabels } from './PieChartWithCenteredLabels';

import { ScrollView } from 'react-native';
class AttendaceStudentForParents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SelectedDateObject: null,
            AttendanceSummary: []
        }
    }

    componentDidMount() {
        this.GetAttendanceCalendar(this.state.SelectedDateObject);
    }

    GetAttendanceCalendar(date) {
        this.props.OnStartLoading();
        let AttendanceDate = this.GetDateForApi(date);
        let url = GlobalPath.API_URL + Constants.ApiController.StudentAttendanceApi + Constants.Actions.StudentAttendanceApi.AttendanceStudentCalendarSelection + '?ClassId=0&StdId=' + this.props.SelectedUser.Id + '&Date=' + AttendanceDate;
        axios.get(url)
            .then((resp) => {
                // alert(JSON.stringify(response.data));
                this.SetAttendanceDataChart(resp.data.AttendanceStudentCalendar.lstStudentAttendanceRemarksSummary);
                //this.setState({ AttendanceSummary: resp.data.AttendanceStudentCalendar.lstStudentAttendanceRemarksSummary });
                let CalendarMarkedDates = [];
                CalendarMarkedDates = resp.data.AttendanceStudentCalendar.lstStudentAttendanceRemarks;

                console.log(JSON.stringify(CalendarMarkedDates));
                var obj = CalendarMarkedDates.reduce((c, v) => Object.assign(c, { [moment(v.AttendanceDate).format('YYYY-MM-DD')]: v.Remarks === 'P' ? { startingDay: true, textColor: 'white', color: Constants.Colors.Attendance.Present, endingDay: true } : v.Remarks === 'A' ? { startingDay: true, color: Constants.Colors.Attendance.Absent, textColor: 'white', endingDay: true } : v.Remarks === 'LE' ? { startingDay: true, color: Constants.Colors.Attendance.Leave, textColor: 'white', endingDay: true } : v.Remarks === 'LA' ? { startingDay: true, color: Constants.Colors.Attendance.Late, textColor: 'white', endingDay: true } : {} }), {});
                this.setState({ CalendarMarked: obj });
                //console.log(JSON.stringify(obj));
                this.props.OnStopLoading();
            })
            .catch((err) => {
                this.props.OnStopLoading();
            });
    }

    SetAttendanceDataChart(AttendanceSummaryRemarks) {
        
        let AttendanceSummary = [];
        for (let i = 0; i < AttendanceSummaryRemarks.length; i++) {
            let item = AttendanceSummaryRemarks[i];
            let obj = {
                Remarks: item.Remarks,
                RemarksCount: item.RemarksCount,
                svg: { fill: item.Remarks === 'P' ? Constants.Colors.Attendance.Present : item.Remarks === 'A' ? Constants.Colors.Attendance.Absent : item.Remarks === 'LE' ? Constants.Colors.Attendance.Leave : item.Remarks === 'LA' ? Constants.Colors.Attendance.Late : '' }
            }
            AttendanceSummary.push(obj);
        }
        console.log(JSON.stringify(AttendanceSummary));
        this.setState({ AttendanceSummary });
    }

    GetDateForApi(SelectedDateObject) {

        if (SelectedDateObject === null) {
            return moment(new Date()).format('MM/DD/YYYY');
        }
        return SelectedDateObject.month + '/' + SelectedDateObject.day + '/' + SelectedDateObject.year;
    }

    CalnedarMonthChange(month) {
        this.setState({ SelectedDateObject: month });
        this.GetAttendanceCalendar(month);
    }

    render() {
        const data = [
            {
                key: 1,
                RemarksCount: 50,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                RemarksCount: 50,
                svg: { fill: '#9900cc' }
            },
            {
                key: 3,
                RemarksCount: 40,
                svg: { fill: '#c61aff' }
            },
            {
                key: 4,
                RemarksCount: 95,
                svg: { fill: '#d966ff' }
            },
            {
                key: 5,
                RemarksCount: 35,
                svg: { fill: '#ecb3ff' }
            }
        ]
        return (
            <ScrollView>
                <View>
                    <Calendar
                        // Initially visible month. Default = Date()
                        current={new Date()}
                        //     // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                        //minDate={this.props.SelectedUser.UserType === Constants.UserType.Admin ? null : new Date()}
                        //     // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                        maxDate={new Date()}
                        //     // Handler which gets executed on day press. Default = undefined
                        //onDayPress={(day) => { this.OnSelectDate(day) }}
                        //     // Handler which gets executed on day long press. Default = undefined
                        //onDayLongPress={(day) => { this.OnSelectDate(day) }}
                        //     // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        //     monthFormat={'yyyy MM'}
                        //     // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(month) => { this.CalnedarMonthChange(month) }}
                        //     // Hide month navigation arrows. Default = false
                        //     //hideArrows={true}
                        //     // Replace default arrows with custom ones (direction can be 'left' or 'right')
                        //     //renderArrow={(direction) => (<Arrow />)}
                        //     // Do not show days of other months in month page. Default = false
                        //     hideExtraDays={true}
                        //     // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                        //     // day from another month that is visible in calendar page. Default = false
                        //     disableMonthChange={true}
                        //     // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                        //     firstDay={1}
                        //     // Hide day names. Default = false
                        //     hideDayNames={true}
                        //     // Show week numbers to the left. Default = false
                        //     showWeekNumbers={true}
                        //     // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        //     onPressArrowLeft={subtractMonth => subtractMonth()}
                        //     // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        //     onPressArrowRight={addMonth => addMonth()}
                        //     // Disable left arrow. Default = false
                        //     ///disableArrowLeft={true}
                        //     // Disable right arrow. Default = false
                        //    // disableArrowRight={true}
                        //     // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                        //     //disableAllTouchEventsForDisabledDays={true}
                        //     // Replace default month and year title with custom one. the function receive a date as parameter.
                        //     renderHeader={(date) => {/*Return JSX*/ }}
                        //     // Enable the option to swipe between months. Default = false
                        //     enableSwipeMonths={true}
                        markingType={'period'}
                        markedDates={this.state.CalendarMarked}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 25, justifyContent: 'center' }}>
                        <View style={{ ...styles.dot, backgroundColor: Constants.Colors.Attendance.Present }}>
                        </View>
                        <Text style={{ paddingLeft: 10 }}>Present</Text>
                        <View style={{ ...styles.dot, backgroundColor: Constants.Colors.Attendance.Absent }}>
                        </View>
                        <Text style={{ paddingLeft: 10 }}>Absent</Text>
                        <View style={{ ...styles.dot, backgroundColor: Constants.Colors.Attendance.Leave }}>
                        </View>
                        <Text style={{ paddingLeft: 10 }}>Leave</Text>
                        <View style={{ ...styles.dot, backgroundColor: Constants.Colors.Attendance.Late }}>
                        </View>
                        <Text style={{ paddingLeft: 10 }}>Late</Text>
                    </View>

                    <View style={{ marginTop: 15, marginLeft: 25 }}>
                        {/* <PieChartWithCenteredLabels AttendanceSummary={this.state.AttendanceSummary} /> */}
                    </View>
                </View>
            </ScrollView>
        )
    }



}

const styles = StyleSheet.create({

    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 15
    },

});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};
const mapsDispatchToProps = dispatch => {
    return {

        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    };
}


export default connect(mapStateToProps, mapsDispatchToProps)(AttendaceStudentForParents);