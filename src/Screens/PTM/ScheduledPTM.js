import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList } from 'react-native';
import { Card } from 'native-base';

import { connect } from 'react-redux';
import { getLeavesRequest } from '../../store/actions/index';
import Constants from '../../utils/Constants';
import * as UserTypeFunc from '../../utils/UserTypeFunc';
import GLOABAL_PATH from '../../utils/GlobalPath';
import axios from 'axios';
import { NavigationEvents } from 'react-navigation';

class ScheduledPTM extends Component {
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
            PTMList: []
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

        let SelectedUser = this.props.SelectedUser;
        let url = GLOABAL_PATH.API_URL + 'ParentTeacherMeetingApi/GetPTM?StudentId=' + UserTypeFunc.getStdId(SelectedUser) + "&ClassId=" + UserTypeFunc.getClassId(SelectedUser) +
            "&UserType=" + SelectedUser.UserType + "&UserCode=" + SelectedUser.Id
            + "&BrId=" + SelectedUser.BrId + "&PTMType=" + Constants.PTMType.Scheduled;
        // axios.post(url,{data : LeaveRequest})
        try {
            this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        }
        catch{ }
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


    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.GetPTMList()} />
                <FlatList
                    data={this.state.PTMList}
                    keyExtractor={(item) => {
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


                        let OtherData = <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 90 }}>
                                <Image style={{ width: 90, height: 90, borderRadius: 20, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderWidth: 3 }}
                                    source={{ uri: GLOABAL_PATH.USER_IMAGE_PATH + item.StudentImage }} resizeMode="cover" />
                            </View>
                            <View style={{ flex: 5, flexDirection: 'column', paddingLeft: 10 }}>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoMainText}>
                                        {item.Title}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineThirdColumn}>
                                    <Text style={styles.infoSubTextThirdColumn}>
                                        {item.Description}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineSecondColumn} >
                                    <Text style={styles.infoSubText}>{item.MeetingDateTimeString}</Text>
                                </View>
                                <View style={styles.innerContaineThirdColumn}>
                                    <Text style={styles.infoSubTextThirdColumn}>{item.StudentOrClass}</Text>
                                </View>
                            </View>
                        </View>

                        // let OtherData = <View style={styles.infoContainer}>
                        //     <View style={styles.innerContaineSecondColumn}>
                        //         <Text style={styles.infoMainText}>
                        //             {item.Title}
                        //         </Text>
                        //     </View>
                        //     <View style={styles.innerContaineSecondColumn}>
                        //         <Text style={styles.infoSubText}>{item.MeetingDateTimeString}</Text>
                        //     </View>
                        //     <View style={styles.innerContaineThirdColumn}>
                        //         <Text style={styles.infoSubTextThirdColumn}>{item.StudentOrClass}</Text>
                        //     </View>
                        // </View>



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
                {UserTypeFunc.plusButtonShowForOnlyAdmins(this.props.SelectedUser, this.props.navigation, Constants.SubRoute.AddPTM)}
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


export default connect(mapStateToProps, mapDispatchToProps)(ScheduledPTM);