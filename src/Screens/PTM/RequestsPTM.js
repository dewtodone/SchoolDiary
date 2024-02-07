import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList } from 'react-native';
import { Card } from 'native-base';

import { connect } from 'react-redux';
import { getLeavesRequest } from '../../store/actions/index';
import Constants from '../../utils/Constants';
import * as UserTypeFunc from '../../utils/UserTypeFunc';
import GLOABAL_PATH from '../../utils/GlobalPath';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';

class RequestsPTM extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };


    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            PTMList: [],
            isDatePickerVisible: false,
            PtmDateTime: '',
            MeetingDateTime: ''

        }
        // this.props.onGetLeavesRequest(this.props.SelectStudent.StdId, this.props.SelectStudent.ClassId);
    }

    componentDidMount() {
        this.GetPTMList();
        // this.props.onGetLeavesRequest(getStdId(this.props.SelectedUser), getClassIdIfTeacher(this.props.SelectedUser));
    }
    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        });

        this.GetPTMList();
        //this.props.onGetLeavesRequest(getStdId(this.props.SelectedUser), getClassIdIfTeacher(this.props.SelectedUser));

        this.setState({
            isRefreshing: false
        });

    };

    GetPTMList = () => {
        debugger;
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        let SelectedUser = this.props.SelectedUser;
        let url = GLOABAL_PATH.API_URL + 'ParentTeacherMeetingApi/GetPTM?StudentId=' + UserTypeFunc.getStdId(SelectedUser) + "&ClassId=" + UserTypeFunc.getClassId(SelectedUser) +
            "&UserType=" + SelectedUser.UserType + "&UserCode=" + SelectedUser.Id
            + "&BrId=" + SelectedUser.BrId + "&PTMType=" + Constants.PTMType.Requested;
        // axios.post(url,{data : LeaveRequest})
        axios({ method: 'get', url: url })
            .then((response, data) => {
                // dispatch(stopLoading());
                if (response.data.Message === Constants.ApiResponse.Success) {
                    this.setState({
                        PTMList: response.data.PTMScheduledList
                    });

                }
                else {
                    // dispatch(stopLoading());
                    alert(response.data.Message);
                }

            })
            .catch((error) => {

                alert('Something Wrong!!');

            });
    }
    DateChangeClick = (Id) => {
        let UserInfo = this.props.SelectedUser;
        if (UserInfo.UserType === Constants.UserType.Admin) {
            // alert(MeetingDateTime)
            let PTMList = this.state.PTMList;
            if (PTMList != undefined) {
                let index = this.GetIndexPTMList(PTMList, Id);
                PTMList[index].IsDatePickerVisible = true;
                this.setState({ PTMList });
            }
            // console.log(JSON.stringify(index));
            // if (PTMList != undefined) {
            //     PTMList[index].IsDatePickerVisible = true;
            //     this.setState({ PTMList });
            // }
        }
    }

    GetIndexPTMList = (PTMList, Id) => {
        let index = -1;
        index = PTMList.findIndex(item => {
            return item.Id === Id
        });
        return index;
    }

    hideDatePicker = (Id) => {
        let PTMList = this.state.PTMList;
        if (PTMList != undefined) {
            let index = this.GetIndexPTMList(PTMList, Id);
            PTMList[index].IsDatePickerVisible = false;
            this.setState({ PTMList });
        }
        // this.setState({ IsDatePickerVisible: false });
    };

    handleConfirm = (date, Id) => {
        let PTMList = this.state.PTMList;
        if (PTMList != undefined) {
            let index = this.GetIndexPTMList(PTMList, Id);
            PTMList[index].MeetingDateTime = moment(date).format('MM/DD/YYYY hh:mm A');
            PTMList[index].MeetingDateTimeString = moment(date).format('DD-MMM-YYYY hh:mm A');
            PTMList[index].IsDatePickerVisible = false;
            this.setState({ PTMList });
        }
        // this.setState({ PtmDateTime: moment(date).format('MM/DD/YYYY hh:mm A'), PtmDateTimeString: moment(date).format('DD-MMM-YYYY hh:mm A') });
        //this.hideDatePicker();
    };

    UpdatePTM = (IsApprove, Id) => {
        let PTMList = this.state.PTMList;
        let index = this.GetIndexPTMList(PTMList, Id);

        let SelectedUser = this.props.SelectedUser;
        let url = GLOABAL_PATH.API_URL + 'ParentTeacherMeetingApi/UpdatePTM?Id=' + Id + "&MeetingDateTime=" + PTMList[index].MeetingDateTime + "&IsApprove=" + IsApprove + "&UserId=" + SelectedUser.UserId;

        // axios.post(url,{data : LeaveRequest})
        axios({ method: 'get', url: url })
            .then((response, data) => {
                // dispatch(stopLoading());
                if (response.data.Message === Constants.ApiResponse.Success) {
                    this.GetPTMList();
                    alert('Updated Successfully!!');

                }
                else {
                    // dispatch(stopLoading());
                    alert(response.data.Message);
                }

            })
            .catch((error) => {

                alert('Something Wrong!!');

            });
    }
    render() {


        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.GetPTMList()} />
                <FlatList
                    data={this.state.PTMList}
                    keyExtractor={(item, index) => {
                        return item.Id;
                    }}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    // onRefresh={() => this.onRefresh()}
                    // refreshing={this.state.refreshing}
                    renderItem={(post, index) => {

                        const item = post.item;
                        let UserInfo = this.props.SelectedUser;
                        // const handleConfirm = this.handleConfirm.bind(this);
                        // const hideDatePicker = this.hideDatePicker.bind(this);
                        // const DateChangeClick = this.DateChangeClick.bind(this);

                        // let OtherData = <View style={styles.infoContainer}>
                        //     <View style={{ flex: 5, flexDirection: 'column'}}>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoMainText}>
                        //                 {item.Title}
                        //             </Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.MeetingDateTime}</Text>
                        //         </View>
                        //         <View style={styles.innerContaineThirdColumn}>
                        //             <Text style={styles.infoSubTextThirdColumn}>{item.StudentOrClass}</Text>
                        //         </View>
                        //     </View>
                        //     <View style={{ flex: 2, flexDirection: 'column'}}>
                        //         <Text>sdkjasjaskldaskd</Text>
                        //     </View>
                        // </View>


                        let OtherData = <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 90 }}>
                                <Image style={{ width: 90, height: 90, borderRadius: 20, borderColor: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.headerBackColor  : Constants.Colors.headerBackColorBlue , borderWidth: 3 }}
                                    source={{ uri: GLOABAL_PATH.USER_IMAGE_PATH + item.StudentImage }} />
                            </View>
                            <View style={{ flex: 5, flexDirection: 'column', paddingLeft: 10 }}>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoMainText}>
                                        {item.Title}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineThirdColumn}>
                                <Text style={styles.classStyle}>Class: {item.ClassName}</Text>
                                </View>
                                <View style={styles.innerContaineThirdColumn}>
                                    <Text style={styles.infoSubTextThirdColumn}>
                                        {item.Description}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineSecondColumn} >
                                    <TouchableOpacity onPress={() => this.DateChangeClick(item.Id)}>
                                        <Text style={styles.infoSubText}>{item.MeetingDateTimeString}</Text>
                                        <DateTimePickerModal
                                            isVisible={item.IsDatePickerVisible}
                                            mode="datetime"
                                            date={moment(item.MeetingDateTime).toDate()}
                                            onConfirm={(date) => this.handleConfirm(date, item.Id)}
                                            onCancel={() => this.hideDatePicker(item.Id)}
                                        />

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.innerContaineThirdColumn}>
                                    <Text style={styles.infoSubTextThirdColumn}>{item.StudentOrClass}</Text>
                                </View>
                            </View>
                            {UserInfo.UserType === Constants.UserType.Admin ?
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                    < Icon name="md-checkmark-circle" size={30} style={{ color: 'green' }} onPress={() => this.UpdatePTM(true, item.Id)} />
                                    <Icon name="md-close-circle" size={30} style={{ color: 'red', marginLeft: 20 }} onPress={() => this.UpdatePTM(false, item.Id)} />
                                </View> : <View></View>
                            }



                            {/*
                           

                            <View style={{ flex: 5, flexDirection: 'column' }}>
                                <View> <Text>sdaadasd</Text></View>
                                <View> <Text>sdaadasd</Text></View>

                            </View> */}

                        </View>




                        // if (this.props.SelectedUser.UserType === Constants.UserType.Teacher || this.props.SelectedUser.UserType === Constants.UserType.Admin) {


                        //     OtherData = <View style={styles.infoContainer}>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoMainText}>
                        //                 {item.StudentName}
                        //             </Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.Day} {item.Month}</Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.LeavesType}</Text>
                        //         </View>
                        //         <View style={styles.innerContaineThirdColumn}>
                        //             <Text style={styles.infoSubTextThirdColumn}>{item.Reason}</Text>
                        //         </View>

                        //     </View>
                        // }

                        return (
                            <Card style={styles.listItem}>

                                {OtherData}

                            </Card>
                            // </TouchableOpacity>
                        );
                    }}

                />
                {UserTypeFunc.plusButtonShowForParents(this.props.SelectedUser, this.props.navigation, Constants.SubRoute.AddPTM)}
                {/* <TouchableOpacity
                    style={styles.floatButton}
                    onPress={() => {
                        this.props.navigation.navigate("AddLeaves");
                    }}
                >
                    <Entypo name="plus" size={30} color={Constants.Colors.yellowColor} />
                </TouchableOpacity> */}


            </View>
            //   <View style={styles.MainContainer}>

            //     <Text style={styles.text}>Attendance</Text>
            // <Text style={styles.text}>{this.props.LeavesRequestList.length}</Text>
            //   </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6E6E6"
    },
    separator: {
        marginTop: 7,
    },
    listItem: {
        flexDirection: "row",
        padding: 12
    },
    iconContainer: {
        // width: 100,
        // height: 100,
        alignItems: "center",
        justifyContent: "center",
        flex: 1
        // backgroundColor: "#B83227",
        // borderRadius: 100
    },
    classStyle: {
        fontSize: 15,
        color: Constants.Colors.cardBlackColor,
        fontWeight: '600',
        marginTop: 4,
       
        marginBottom: 2
    },
    // contactIcon: {
    //     fontSize: 18,
    //     color: Constants.Colors.yellowColor,
    //     fontWeight: 'bold',
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    infoContainer: {
        flexDirection: "column",
    },
    infoMainText: {
        fontSize: 15,
        // fontWeight: "400",
        // paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.cardBlackColor,
        fontWeight: 'bold'
    },
    infoSubText: {
        fontSize: 16,
        // fontWeight: "400",
        // paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.CardGrayColor,

    },
    infoSubTextThirdColumn: {
        fontSize: 16,
        // fontWeight: "400",
        // paddingLeft: 10,
        paddingTop: 2,

    },
    innerContainerFirstColumn: {
        justifyContent: "center",
        alignItems: "center"
    },
    innerContaineSecondColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
        paddingRight: 10
    },

    innerContaineThirdColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
        paddingRight: 10,
    },




});

const mapStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        LeavesRequestList: state.reducerAttendance.LeavesRequestList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetLeavesRequest: (StdId, ClassId) => dispatch(getLeavesRequest(StdId, ClassId))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RequestsPTM);