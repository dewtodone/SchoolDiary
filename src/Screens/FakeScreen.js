import React, { Component } from 'react';

import { View, StyleSheet, Text, Dimensions, TouchableOpacity, FlatList,Image, Platform } from 'react-native';
// import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
// import { NavigationEvents } from 'react-navigation';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { Badge } from "native-base";
// import { getDashboardMenu } from './../../store/actions/index';
// import {getUserId} from './../../utils/UserTypeFunc'

class FakeScreen extends Component {

  

    componentDidMount() {
        // setTimeout(() => {
        //     this.props.navigation.navigate('MainDashboard');
        // }, 2000);
        
        this.props.navigation.navigate('MainDashboard');
       
    }



    render() {
        
        return (
            // <View >
            <View style={{ flex: 1 }}>
                
            </View>

        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: '50%' // is 50% of container width
    },
   
});




export default connect(null, null)(FakeScreen);