import React, {Component} from 'react';
import {View, Text,StyleSheet} from 'react-native';
import ActivityComponent from '../../components/Activity/ActivityComponent';
import Constants from '../../utils/Constants';
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

class AddHomework extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("Homework")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    componentDidMount() {
       
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
    }

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <View style={{ flex:1}} >
            <NavigationEvents onDidFocus={() => this.componentDidMount()} />
            <ActivityComponent  Type={Constants.ActivityType.Homework} Navigation={this.props}/>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};


export default connect(mapStateToProps, null)(AddHomework);

