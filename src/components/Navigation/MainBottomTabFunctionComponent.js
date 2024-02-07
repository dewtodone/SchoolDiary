import React, { Component } from 'react';
import {View,Text, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ScreenAcademic from '../../Screens/Academic';
import ScreenNotice from '../../Screens/DiaryActivities/Notice';
import ScreenHomework from '../../Screens/DiaryActivities/Homework';

import ScreenActivity from '../../Screens/DiaryActivities/Activity';

import { createStackNavigator } from 'react-navigation-stack';
import HamburgerIcon from './HamburgerIcon';

import Constants from '../../utils/Constants';

import CustomHeader from './CustomHeader';
import { connect } from 'react-redux';

const ActivityStatck = createStackNavigator(
    {
        Activity: ScreenActivity
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Activity" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: Constants.Colors.headerBackColorBlue
            },
            headerTintColor: Constants.Colors.headerBackColor,
            
        })
    }
);

const AcademicStatck = createStackNavigator(
    {
        Academic: ScreenAcademic
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Academic" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: Constants.Colors.headerBackColor
            },
            headerTintColor: Constants.Colors.headerColor,
        })
    }
);

const NoticeStatck = createStackNavigator(
    {
        Notice: ScreenNotice
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Notice" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: Constants.Colors.headerBackColor
            },
            headerTintColor: Constants.Colors.headerColor,
        })
    }
);

const HomeworkStatck = createStackNavigator(
    {
        Homework: ScreenHomework
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Homework" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: Constants.Colors.headerBackColor
            },
            headerTintColor: Constants.Colors.headerColor,
        })
    }
);

// const AttendanceStatck = createStackNavigator(
//     {
//         Attendance: ScreenAttendance
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({
//             headerTitle: <CustomHeader subtitle="Attendance" />,
//             headerLeft: <HamburgerIcon navigationProps={navigation} />,
//             headerStyle: {
//                 backgroundColor: Constants.Colors.headerBackColor
//             },
//             headerTintColor: Constants.Colors.headerColor,
//         })
//     }
// );



export const MainBottomTabNavigation = createBottomTabNavigator(
    {
        Activity: ActivityStatck,
        Academic: AcademicStatck,
        Notice: NoticeStatck,
        Homework: HomeworkStatck,
        // Attendance: AttendanceStatck,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({         
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                

                if (routeName === 'Activity') {
                    return (
                        <Icon
                            name="ios-basket"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                } else if (routeName == 'Academic') {
                    return (
                        <MaterialCommunityIcons
                            name="book-open-outline"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                }
                else if (routeName == 'Notice') {
                    return (
                        <Icon
                            name="ios-notifications"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                }
                else if (routeName == 'Homework') {
                    return (
                        <SimpleLineIcons
                            name="note"
                            color={tintColor}
                            activeTintColor={focused}
                            size={30}
                        />
                    );
                }
                // else if (routeName == 'Attendance') {
                //     return (
                //         <SimpleLineIcons
                //             name="calendar"
                //             color={tintColor}
                //             activeTintColor={focused}
                //             size={30}
                //         />
                //     );
                // }
            },

           
        }),
        tabBarOptions: {
            activeTintColor:  Constants.Colors.headerBackColor ,//'#0D47A1',
            inactiveTintColor: '#263238',
        },

     
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
const  MainBottomTabFunctionComponent = (props) => {
   return(
   myName
   ) 
}

const mapStateToProp = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser      
    };
};


export default connect(mapStateToProp, null)(MainBottomTabFunctionComponent);
// export default MainBottomTabFunctionComponent;