import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager, ScrollView, Keyboard, FlatList, Image, TouchableWithoutFeedback } from "react-native";


import { connect } from 'react-redux';
import Constants from '../../utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { getStudentOrClassList, getClassOrStdId,RemoveAllClasses } from '../../utils/UserTypeFunc';
import { Item, Right, Card, Radio, Button } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import GlobalPath from '../../utils/GlobalPath';
import moment from 'moment';
import axios from 'axios';
import { startLoading, stopLoading } from './../../store/actions/index';
import { castArray } from 'lodash';
class AttendanceStudentForStaff extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SlectedDate: 'select date',
            SelectedDateObject: null,
            StudentAttendanceList: [],
            CalendarList: [],
            ClassId: 0,
            CalendarMarked: []
        }

    }
    componentDidMount() {
        this.setState({ SlectedDate: moment(new Date()).format('DD/MM/YYYY') });
        // let Obj = { '2021-06-19': {startingDay: true, color: 'green', endingDay: true, textColor: 'white'}}
        //this.GetAttendanceCalendar();

    }

    StudentOrClassChangedHandler = (val) => {
        this.setState({ ClassId: val })
        this.GetAttendanceList(val, this.state.SelectedDateObject);
        this.GetAttendanceCalendar(val, this.state.SelectedDateObject);

    }

    OnSelectDate = (date) => {
        this.setState({
            modalVisible: false,
            SlectedDate: date.day + '/' + date.month + '/' + date.year,
            SelectedDateObject: date
        });
        // alert(JSON.stringify(date))
        this.GetAttendanceList(this.state.ClassId, date);
        this.GetAttendanceCalendar(this.state.ClassId, date);

    }

    onPressOkButton = async () => {
        this.setState({
            modalVisible: false
        });
    };

    GetAttendanceCalendar(ClassId, date) {
        let ClassIdParam = ClassId;

        if (this.state.ClassId === 0) {
            ClassIdParam = ClassId;
        }
        //alert(JSON.stringify(parseInt(ClassIdParam)));
        //if ()
        if (parseInt(ClassIdParam) > 0) {
            let AttendanceDate = this.GetDateForApi(date);
            let url = GlobalPath.API_URL + Constants.ApiController.StudentAttendanceApi + Constants.Actions.StudentAttendanceApi.AttendanceStudentCalendarSelection + '?ClassId=' + ClassIdParam + '&StdId=0&Date=' + AttendanceDate;
            axios.get(url)
                .then((response) => {
                    // alert(JSON.stringify(response.data));
                    this.setState({ CalendarList: response.data.AttendanceStudentCalendar });
                    let CalendarMarkedDates = [];
                    CalendarMarkedDates = response.data.AttendanceStudentCalendar.lstStudentAttendanceRemarks;
                    console.log(JSON.stringify(CalendarMarkedDates));
                    var obj = CalendarMarkedDates.reduce((c, v) => Object.assign(c, { [moment(v.AttendanceDate).format('YYYY-MM-DD')]: { marked: true } }), {});
                    this.setState({ CalendarMarked: obj });
                    console.log(JSON.stringify(obj));
                })
                .catch(function (error) {
                });
        }
    }

    GetAttendanceList(ClassId, SelectedDateObject) {
        this.props.OnStartLoading();
        let AttendanceDate = this.GetDateForApi(SelectedDateObject);
        let url = GlobalPath.API_URL + Constants.ApiController.StudentAttendanceApi + Constants.Actions.StudentAttendanceApi.StudentAttendanceSelection + '?ClassId=' + ClassId + '&Date=' + AttendanceDate;
        axios.get(url)
            .then((response) => {
                // alert(JSON.stringify(response.data));
                this.setState({ StudentAttendanceList: response.data.AttendanceStudent });
                this.props.OnStopLoading();
            })
            .catch(function (error) {

                this.props.OnStopLoading();
            });
    }

    SetRemarks(index, Remarks) {
        let StudentAttendanceList = this.state.StudentAttendanceList;
        StudentAttendanceList[index].Remarks = Remarks;
        this.setState({ StudentAttendanceList });
    }

    GetDateForApi(SelectedDateObject) {

        if (SelectedDateObject === null) {
            return moment(new Date()).format('MM/DD/YYYY');
        }
        return SelectedDateObject.month + '/' + SelectedDateObject.day + '/' + SelectedDateObject.year;
    }

    SaveStudentAttendance = () => {
        if (this.state.ClassId === 0)
        {
            alert('Please select class');
        }
        else
        {
        this.props.OnStartLoading();
        let StudentAttendance = {
            BrId: this.props.SelectedUser.BrId,
            ClassId: this.state.ClassId,
            AttendanceDate: this.GetDateForApi(this.state.SelectedDateObject),
            CreatedBy: this.props.SelectedUser.UserId,
            lstStudentAttendanceRemarksInsertion: this.state.StudentAttendanceList
        }
        let url = GlobalPath.API_URL + Constants.ApiController.StudentAttendanceApi + Constants.Actions.StudentAttendanceApi.StudentAttendanceUpdation;


        // axios.post(url,{data : LeaveRequest})
        axios({ method: 'post', url: url, data: StudentAttendance })
            .then((resp) => {
                //console.log(response.data);
                //let aa = resp.data.adasda[121];
                if (resp.data.Message === Constants.ApiResponse.Success) {
                    alert('Saved Successfully');
                }
                else {
                    // dispatch(stopLoading());
                    alert(resp.data.Message);
                }
                this.props.OnStopLoading();
            })
            .catch((err) => {
                console.log(err);/*  */

                alert('Something Wrong!!. Please Again Later');
                this.props.OnStopLoading();
                // dispatch(stopLoading());
            });
        }
    }
    MarkedDates() {
        let Obj = {
            '2021-06-17': { marked: true },
        }
        return Obj;
    }
    render() {
        debugger;
        let lst = getStudentOrClassList(this.props.StudentOrClassList);

        lst = RemoveAllClasses(lst,this.props.SelectedUser.UserType);

        //lst.splice(0,0, {label: 'Select Class', value: null})
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', height: 100 }} paddingVertical={10} marginLeft={15} marginRight={15}>
                    <View style={{ width: '50%' }} >
                        <RNPickerSelect
                            placeholder={{
                                label: 'Select class...',
                                value: null,
                                color: '#9EA0A4',
                            }}
                            items={lst}
                            onValueChange={this.StudentOrClassChangedHandler}
                            //value={getClassOrStdId(this.props.SelectedUser)}
                            style={{
                                iconContainer: {
                                    top: -8,
                                    right: 0
                                },
                                inputIOS: {
                                    fontSize: 16,
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    borderWidth: 2,
                                    //borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                    borderRadius: 4,
                                    //color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    paddingRight: 30, // to ensure the text is never behind the icon
                                },
                                inputAndroid: {
                                    fontSize: 15,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    borderWidth: 2,
                                    //borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                    borderRadius: 8,
                                    color: Constants.Colors.cardBlackColor,
                                    paddingRight: 30, // to ensure the text is never behind the icon
                                },
                                // borderColor: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor,
                                // color: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor,
                            }}
                            //value={}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, }}
                            Icon={() => {
                                return <Icon name="md-arrow-dropdown" style={{ paddingTop: 16, paddingRight: 20 }} size={30} />;
                            }}
                        />

                    </View>
                    <View style={{ width: '50%' }}>

                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }}>
                            <Text style={{ borderWidth: 2, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderRadius: 8, height: 'auto', marginLeft: 10, width: '90%', fontSize: 16 }}>{this.state.SlectedDate} </Text>
                            <View style={{ top: 10, right: 25, position: 'absolute' }}>
                                <Icon size={30} name='md-arrow-dropdown'></Icon>
                            </View>
                        </TouchableOpacity>
                        <Modal
                            visible={this.state.modalVisible}
                            modalTitle={<ModalTitle title='Select Date' />}
                            maxHeight={100}

                            width={0.9}
                            footer={
                                <ModalFooter style={{ height: 60 }}>
                                    <Right>
                                        <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                            <ModalButton
                                                text="    OK     "
                                                onPress={this.onPressOkButton}
                                            />
                                        </View>
                                    </Right>


                                </ModalFooter>
                            }
                            modalAnimation={new SlideAnimation({
                                slideFrom: 'left',
                            })}
                            onTouchOutside={() => {
                                this.setState({ modalVisible: false });
                            }}>
                            <ModalContent style={{ height: 350 }}>
                                <ScrollView  >
                                    <Calendar
                                        // Initially visible month. Default = Date()
                                        current={new Date()}
                                        //     // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                                        minDate={this.props.SelectedUser.UserType === Constants.UserType.Admin ? null : new Date()}
                                        //     // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                                        maxDate={new Date()}
                                        //     // Handler which gets executed on day press. Default = undefined
                                        onDayPress={(day) => { this.OnSelectDate(day) }}
                                        //     // Handler which gets executed on day long press. Default = undefined
                                        onDayLongPress={(day) => { this.OnSelectDate(day) }}
                                        //     // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                                        //     monthFormat={'yyyy MM'}
                                        //     // Handler which gets executed when visible month changes in calendar. Default = undefined
                                        //onMonthChange={(month) => { console.log('month changed', month) }}
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
                                </ScrollView>
                            </ModalContent>
                        </Modal>

                    </View>

                </View>
                <View style={{ marginTop: -25, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                        onPress={this.SaveStudentAttendance}
                    >
                        {/* <Icon name='save' style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }} /> */}
                        <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold' }}>Save</Text>
                    </Button>
                </View>
                <View style={{ flexDirection: 'column', marginTop: 10, }} >

                    <FlatList
                        data={this.state.StudentAttendanceList}
                        keyExtractor={(item) => {
                            return item.StdId;
                        }}
                        // onRefresh={this.onRefresh}
                        // refreshing={this.state.isRefreshing}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={styles.separator} />
                            )
                        }}

                        renderItem={({ item, index }) => {


                            let imageOrDates = <View  >
                                <Image source={{ uri: GlobalPath.USER_IMAGE_PATH + item.StudentImage }} style={{ ...styles.sideMenuProfileIcon, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }} />

                                {/* <View style={styles.innerContainerFirstColumn} >
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.Date).format('DD')}
                                </Text>
                            </View>
                            <View style={styles.innerContainerFirstColumn}>
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.Date).format('MMM')}
                                </Text>
                            </View> */}
                            </View>
                            let OtherData = <View style={{ ...styles.infoContainer, width: '100%' }}>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoMainText}>
                                        {item.StudentName}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoSubText}>
                                        {item.StudentNo}
                                    </Text>
                                </View>
                                {/* <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoSubText}>
                                        {item.StudentImage}
                                    </Text>
                                </View> */}

                                <View style={{ ...styles.innerContaineSecondColumn, marginTop: 5 }}>
                                    {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                                    
                                       
                                    </View> */}
                                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center', paddingTop: 5 }}>
                                        <TouchableWithoutFeedback onPress={() => this.SetRemarks(index, 'P')}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                                <View>
                                                    <Radio onPress={() => this.SetRemarks(index, 'P')}
                                                        selected={item.Remarks == 'P'} />
                                                </View>
                                                <View style={{ paddingLeft: 10, paddingTop: 2 }}>
                                                    <Text >P</Text>
                                                </View>

                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.SetRemarks(index, 'A')}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View>
                                                    <Radio onPress={() => this.SetRemarks(index, 'A')}
                                                        selected={item.Remarks == 'A'} />
                                                </View>
                                                <View style={{ paddingLeft: 10, paddingTop: 2 }}>
                                                    <Text >A</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.SetRemarks(index, 'LE')}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View>
                                                    <Radio onPress={() => this.SetRemarks(index, 'LE')}
                                                        selected={item.Remarks == 'LE'} />
                                                </View>
                                                <View style={{ paddingLeft: 10, paddingTop: 2 }}>
                                                    <Text >LE</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.SetRemarks(index, 'LA')}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View>
                                                    <Radio onPress={() => this.SetRemarks(index, 'LA')}
                                                        selected={item.Remarks == 'LA'} />
                                                </View>
                                                <View style={{ paddingLeft: 10, paddingTop: 2 }}>
                                                    <Text >LA</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>


                            </View>


                            return (

                                <Card style={styles.listItem}>
                                    {imageOrDates}
                                    {OtherData}

                                </Card>

                            );
                        }}
                    />


                </View>

            </View>

        )
    }



}

const styles = StyleSheet.create({

    sideMenuProfileIcon:
    {
        height: 80,
        width: 80,
        borderRadius: 12,
        borderWidth: 3,

    },
    separator: {
        marginTop: 4,
    },
    infoContainer: {
        flexDirection: "column",
        flex: 1
        //backgroundColor:'red'

    },
    infoMainText: {
        fontSize: 16,
        // fontWeight: "400",
        paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.cardBlackColor,
        fontWeight: 'bold'
    },
    infoSubText: {
        fontSize: 16,
        fontWeight: "600",
        paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.CardGrayColor,

    },
    innerContainerFirstColumn: {
        justifyContent: "center",
        alignItems: "center"
    },
    innerContaineSecondColumn: {
        justifyContent: "center",
        // alignItems: "flex-start",
        paddingLeft: 20,
        marginRight: 30,
    },
    listItem: {
        flexDirection: "row",
        padding: 10
    },
});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        StudentOrClassList: state.reducerLogin.StudentOrClassList,
    };
};

const mapsDispatchToProps = dispatch => {
    return {

        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    };
}

export default connect(mapStateToProps, mapsDispatchToProps)(AttendanceStudentForStaff);