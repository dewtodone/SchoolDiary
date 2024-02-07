import React, { Component } from 'react';

import { StyleSheet, LayoutAnimation, UIManager, Alert, KeyboardAvoidingView, TextInput, TouchableHighlight, ImageBackground, Platform, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, Linking, Form } from 'react-native';
import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import AssignmentComponent from './AssignmentComponent';

class Assignments extends Component {

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
            <View style={{ flex:1}}>
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                <AssignmentComponent Type='Assignment'/>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};

export default connect(mapStateToProps, null)(Assignments);


