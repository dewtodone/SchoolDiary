
import React, { Component } from 'react';
import {View,Text, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ScreenScheduledPTM from '../../Screens/PTM/ScheduledPTM';
import ScreenRequestsPTM from '../../Screens/PTM/RequestsPTM';


import { createStackNavigator } from 'react-navigation-stack';
import HamburgerIcon from './HamburgerIcon';

import Constants from '../../utils/Constants';

import CustomHeader from './CustomHeader';
import { HeaderBackButton } from "react-navigation-stack";

// const CustomHeader = ({ title, subtitle }) => (
//     <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.subtitle}>{subtitle}</Text>
//     </View>
// );

  
const ActivityScheduledPTM = createStackNavigator(
    {
        ScheduledPTM: ScreenScheduledPTM
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Parent Teacher Meeting" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
            // headerStyle: {
            //     backgroundColor: Constants.Colors.headerBackColor
            // },
            // headerTintColor: Constants.Colors.headerColor,
        })
    }
);


const ActivityRequestsPTM = createStackNavigator(
    {
        RequestsPTM: ScreenRequestsPTM
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Parent Teacher Meeting" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
            // headerStyle: {
            //     backgroundColor: Constants.Colors.headerBackColor
            // },
            // headerTintColor: Constants.Colors.headerBackColor,
            
        })
    }
);



export const ParentTeacherMeetingNavigation = createBottomTabNavigator(
    {
        ScheduledPTM: {screen:ActivityScheduledPTM,navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'Scheduled PTM'
           })},
           RequestsPTM: {screen:ActivityRequestsPTM,navigationOptions: ({ navigation }) => ({
             tabBarLabel: 'Requested PTM'
            })},
       
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({         
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                

                if (routeName === 'RequestsPTM') {
                    return (
                        <Icon
                            name="ios-basket"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                } else if (routeName == 'ScheduledPTM') {
                    return (
                        <MaterialCommunityIcons
                            name="book-open-outline"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                }
               
            },

           
        }),
        // tabBarOptions: {
        //     activeTintColor:  Constants.Colors.headerBackColor ,//'#0D47A1',
        //     inactiveTintColor: '#263238',
        // },

     
    }
);

const styles = StyleSheet.create({
    header: {

        flex: 1,
        alignSelf: 'stretch',
      },
      title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
      },
});