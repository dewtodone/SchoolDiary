import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard, FlatList, TouchableOpacity, Image } from 'react-native';
import ActivityComponent from '../../components/Activity/ActivityComponent';
import Constants from '../../utils/Constants';
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

class AddActivity extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("Activity")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
       
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
    }

    render() {
        // let lst = getStudentOrClassList(this.props.StudentOrClassList);
        return (

            //  
            <View style={{ flex:1}}>
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                <ActivityComponent Type={Constants.ActivityType.Activity} Navigation={this.props} />
            </View>
        );
    }
};


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};


export default connect(mapStateToProps, null)(AddActivity);


