
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, SafeAreaView, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import { studentChanged, getActivities } from '../../store/actions/index';

import GLOABAL_PATH from '../../utils/GlobalPath';
import ProgressBar from '../General/ProgressBar';

import Constants from '../../utils/Constants';
import { getStudentOrClassList, getStudentOrTeacherName, getClassName, getClassOrStdId } from '../../utils/UserTypeFunc';
import { TouchableOpacity } from 'react-native-gesture-handler';

class CustomSideMenu extends React.Component {
    constructor(props) {
        super(props);

        // this.inputRefs = {
        //     firstTextInput: null,
        //     favSport0: null,
        //     favSport1: null,
        //     lastTextInput: null,
        //     favSport5: null,
        // };
        // this.state = {
        //     numbers: [
        //         {
        //             label: '1',
        //             value: 1,
        //             color: 'orange',
        //         },
        //         {
        //             label: '2',
        //             value: 2,
        //             color: 'green',
        //         },
        //     ],
        //     favSport0: undefined,
        //     favSport1: undefined,
        //     favSport2: undefined,
        //     favSport3: undefined,
        //     favSport4: 'baseball',
        //     previousFavSport5: undefined,
        //     favSport5: null,
        //     favNumber: undefined,
        // };

    }
    // componentDidMount()
    // {
    //     alert(this.props.selectedStudent);
    // }

    StudentOrClassChangedHandler = (val) => {
        //alert(val);

        this.props.onStudentChanged(val);
        //         this.props.navigation.navigate('Academic');
        // this.props.navigation.navigate('Activity');

    }
    toggleDrawer = () => {

        //console.log(this.props.navigationProps);

        this.props.navigationProps.toggleDrawer();

    }


    render() {
        // let ApplyForLeave = <View></View>;
        // let SelectedUser = this.props.SelectedUser;

        // if (SelectedUser.UserType === Constants.UserType.Parent || SelectedUser.UserType === Constants.UserType.Admin) {
        //     FeedBack = <View style={styles.menuParentView}>
        //         <View style={styles.column} style={{ paddingLeft: 20 }}>
        //             <Icon name="md-copy" size={32} color={Constants.Colors.headerBackColor} />
        //         </View>
        //         <View style={styles.column}>
        //             <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('Feedback') }} > Feedback </Text>
        //         </View>
        //     </View>
        // }

        if (this.props.StudentOrClassList.length > 0) {
           
            let lst = getStudentOrClassList(this.props.StudentOrClassList);
            // if (lst.length > 1)
            // {
            // if (this.props.SelectedUser.UserType === Constants.UserType.Teacher || this.props.SelectedUser.UserType === Constants.UserType.Admin){
            //     let objAllClass = {
            //         label: "All Class",
            //         value:"-1"
            //     }
            //     lst.splice
            // }
            // }
            console.log(lst);
            // this.props.StudentOrClassist.forEach(function (entry) {
            //     var studentOrClass = {}
            //     studentOrClass['label'] = entry.UserType === Constants.UserType.Parent? entry.StudentName + ' (' + entry.ClassName + ')': entry.ClassName ;
            //     studentOrClass['value'] = entry.UserType === Constants.UserType.Parent? entry.Id : entry.ClassId;
            //     lst.push(studentOrClass);
            // });
            return (

                <ScrollView >
                    <View style={styles.sideMenuContainer}>
                        <ProgressBar />
                        <View style={{ backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '100%', height: 240 }}>
                            <View style={{ paddingLeft: 10, paddingTop: Platform.OS === 'ios' ? 35 : 10 }}>
                                <Image source={{ uri: GLOABAL_PATH.USER_IMAGE_PATH + this.props.SelectedUser.StudentImage }} style={styles.sideMenuProfileIcon} />
                                {/* <Text>{this.props.SelectedStudent.StudentImage} </Text> */}

                                <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: "bold", paddingLeft: 10, paddingTop: 10 }} >{getStudentOrTeacherName(this.props.SelectedUser)}</Text>
                                <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, paddingLeft: 10 }} >{getClassName(this.props.SelectedUser)} </Text>

                            </View>
                            <View>
                                <View paddingVertical={5} marginLeft={15} />
                                <RNPickerSelect
                                    placeholder={{}}
                                    items={lst}
                                    onValueChange={this.StudentOrClassChangedHandler}
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
                                            borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                            borderRadius: 4,
                                            color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
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
                                            borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                            borderRadius: 8,
                                            color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor,
                                            paddingRight: 30, // to ensure the text is never behind the icon

                                        },

                                        // borderColor: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor,
                                        // color: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor,
                                    }}
                                    value={getClassOrStdId(this.props.SelectedUser)}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{ underlineColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, }}
                                    Icon={() => {
                                        return <Icon name="md-arrow-dropdown" style={{ paddingTop: 16, paddingRight: 20 }} size={30} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />;
                                    }}
                                />

                            </View>

                        </View>
                        {/* <View style={{ width: '100%', height: 1, backgroundColor: '#e2e2e2', marginTop: 15 }} /> */}
                        {/* <TouchableOpacity onPress={() => {this.toggleDrawer()}}> */}
                        <View style={{ width: '100%' }}>

                            <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-home" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('MainDashboard') }} > Home </Text>
                                </View>
                            </View>

                            {/* <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-alarm" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.SelectedUser.UserType === Constants.UserType.Teacher ? this.props.navigation.navigate('TeacherPTM') : this.props.navigation.navigate('ParentTeacherMeeting') }} > Parent Teacher Meeting </Text>
                                </View>
                            </View> */}

                            {/* <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft:20}}>
                                    <Icon name="md-paper" size={32} color={Constants.Colors.headerBackColor} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('FeeChallan') }} > Fee Challan </Text>
                                </View>
                            </View>

                            <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft:20}}>
                                    <Icon name="md-calendar" size={32} color={Constants.Colors.headerBackColor} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('Events') }} > Events </Text>
                                </View>
                            </View>

                            <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft:20}}>
                                   <Icon name="md-document" size={32} color={Constants.Colors.headerBackColor} />
                                </View>
                                <View style={styles.column}  >
                                    <Text style={styles.menuText}  onPress={() => { this.props.navigation.navigate('About') }} > About </Text>
                                </View>
                            </View>*/}

                            {/* <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-copy" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('ApplyForLeave') }} > Apply For Leave </Text>
                                </View>
                            </View>
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-book" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('LectureNotes') }} > eLearning - Class Material </Text>
                                </View>
                            </View>}
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="ios-globe" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('OnlineLectures') }} > eLearning - Online Lectures </Text>
                                </View>
                            </View>}
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="ios-book" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('Assignments') }} > eLearning - Assignments </Text>
                                </View>
                            </View>}
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="ios-document" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('eLearningHomeWork') }} > eLearning - Homework </Text>
                                </View>
                            </View>}
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <MaterialIcons name="payment" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('FeePayment') }} > Fee </Text>
                                </View>
                            </View>} */}
                            {this.props.SelectedUser.UserType != Constants.UserType.Parent ? <View /> : <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-person" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('Profile') }} > Profile </Text>
                                </View>
                            </View>}
                            {/* <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="md-book" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('test') }} > Test </Text>
                                </View>
                            </View> */}

                            <View style={styles.menuParentView}>
                                <View style={styles.column} style={{ paddingLeft: 20 }}>
                                    <Icon name="ios-log-out" size={32} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.menuText} onPress={() => { this.props.navigation.navigate('Logout') }} > Logout </Text>
                                </View>
                            </View>



                        </View>
                        {/* </TouchableOpacity> */}
                        {/* <View style={{ width: '100%', height: 1, backgroundColor: '#e2e2e2', marginTop: 15 }} /> */}


                    </View>

                </ScrollView >
            );
        }
        else {
            return (
                <View></View>
            );
        }
    }
}

const styles = StyleSheet.create({
    sideMenuContainer: {

        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',

        // paddingTop: 20
    },

    column: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',

    },

    sideMenuProfileIcon:
    {

        height: 80,
        width: 80,
        borderRadius: 12,
        // borderColor : Constants.Colors.StatusBarColor,
        // borderWidth:4
    },

    //   sideMenuIcon:
    //   {
    //     resizeMode: 'center',
    //     width: 28,
    //     height: 28,
    //     marginRight: 10,
    //     marginLeft: 20

    //   },
    menuText: {

        fontSize: 15,
        fontWeight: "bold",
        color: '#222222',
        marginLeft: 30,
        width: '100%'

    },

    menuParentView: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        // alignItems: 'flex-start',
        // alignSelf:'flex-start',
        // justifyContent:'flex-start',
        marginTop: 10,

        marginLeft: 20,


    },
});

// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {

//     },

// });

const maspStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        StudentOrClassList: state.reducerLogin.StudentOrClassList,
        ClassList: state.reducerLogin.ClassList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onStudentChanged: (StdId) => dispatch(studentChanged(StdId))

    };
}

export default connect(maspStateToProps, mapDispatchToProps)(CustomSideMenu);