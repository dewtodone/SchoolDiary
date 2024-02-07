import React, { Component } from 'react';

import { View, Text } from 'react-native';
import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import AttendaceStudentForParents from './AttendaceStudentForParents';
import AttendanceStudentForStaff from './AttendanceStudentForStaff';
class StudentAttendance extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };




    componentDidMount() {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });


    }


    render() {
        return (
            <View style={{ flex: 1,  }}>
                {/* <NavigationEvents onDidFocus={() => this.componentDidMount()} /> */}
                
                {this.props.SelectedUser.UserType === Constants.UserType.Parent? <AttendaceStudentForParents />:<AttendanceStudentForStaff />}
            </View>




        );
    }
}

const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};



export default connect(mapStateToProps, null)(StudentAttendance);
