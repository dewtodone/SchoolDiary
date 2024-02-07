import React, {Componentm, Component} from 'react';
import {View, Text,StyleSheet} from 'react-native';
import ActivityComponent from '../../components/Activity/ActivityComponent';
import Constants from '../../utils/Constants';
import { connect } from 'react-redux';
import { HeaderBackButton } from "react-navigation-stack";

import { NavigationEvents } from 'react-navigation';

class AddNotice extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("Notice")} />),
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
            <View style={{ flex:1}}>
            <NavigationEvents onDidFocus={() => this.componentDidMount()} />
            <ActivityComponent  Type={Constants.ActivityType.Notice} Navigation={this.props}/>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};


export default connect(mapStateToProps, null)(AddNotice);

// export default AddNotice;