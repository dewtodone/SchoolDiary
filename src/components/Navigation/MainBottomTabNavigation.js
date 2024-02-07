import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Academic from '../../Screens/DiaryActivities/Academic';
import Notice from '../../Screens/DiaryActivities/Notice';
import Homework from '../../Screens/DiaryActivities/Homework';
import Activity from '../../Screens/DiaryActivities/Activity';

import { ParentTeacherMeetingNavigation } from "./ParentTeacherMeetingNavigation";
import TeacherPTM from '../../Screens/PTM/TeacherPTM';
import ScreenMainDashboard from '../../Screens/General/MainDashboard';
import ScreenSubDashboard from '../../Screens/General/SubDashboard';
import ScreenProfile from './../../Screens/UserSetting/Profile';
import ScreenLogout from './../../Screens/Logout';
import FakeScreen from './../../Screens/FakeScreen';

import LectureNotes from '../../Screens/eLearning/LectureNotes';
import OnlineLectures from '../../Screens/eLearning/OnlineLectures';
import Assignments from '../../Screens/eLearning/Assignments';
import eLearningHomeWork from '../../Screens/eLearning/eLearningHomeWork';
import FeePayment from '../../Screens/Fee/FeePayment';
import Citrix from '../../Screens/Citrix/Citrix';
import ApplyForLeave from '../../Screens/DiaryActivities/Attendance';
import AddLeaves from '../../Screens/DiaryActivities/AddLeaves';
import StudentAttendance from '../../Screens/AttendanceStudent/StudentAttendance';
// import ScreenProfile from ..
import { createStackNavigator } from 'react-navigation-stack';
import HamburgerIcon from './HamburgerIcon';
import { HeaderBackButton } from "react-navigation-stack";
import Constants from '../../utils/Constants';

import CustomHeader from './CustomHeader';
import { connect } from 'react-redux';

// const CustomHeader = ({ title, subtitle }) => (
//     <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.subtitle}>{subtitle}</Text>
//     </View>
// );




// const ActivityStatck = (props) = createStackNavigator(
//     {
//         Activity: ScreenActivity
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({
//             headerTitle: <CustomHeader subtitle='Activity' />,
//             headerLeft: <HamburgerIcon navigationProps={navigation} />,
//             // headerStyle: {
//             //     backgroundColor: Constants.Colors.headerBackColorBlue
//             // },
//             // headerTintColor: Constants.Colors.headerBackColor,

//         })
//     }
// );



// const AcademicStatck = createStackNavigator(
//     {
//         Academic: ScreenAcademic
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({

//             headerTitle: <CustomHeader subtitle="Academic" />,
//             headerLeft: <HamburgerIcon navigationProps={navigation} />,
//             headerStyle: {
//                 backgroundColor: Constants.Colors.headerBackColor
//             },
//             headerTintColor: Constants.Colors.headerColor,
//         })
//     }
// );

// const NoticeStatck = createStackNavigator(
//     {
//         Notice: ScreenNotice
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({
//             headerTitle: <CustomHeader subtitle="Notice" />,
//             headerLeft: <HamburgerIcon navigationProps={navigation} />,
//             // headerStyle: {
//             //     backgroundColor: Constants.Colors.headerBackColor
//             // },
//             // headerTintColor: Constants.Colors.headerColor,
//         })
//     }
// );

// const HomeworkStatck = createStackNavigator(
//     {
//         Homework: ScreenHomework
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({
//             headerTitle: <CustomHeader subtitle="Homework" />,
//             headerLeft: <HamburgerIcon navigationProps={navigation} />,
//             // headerStyle: {
//             //     backgroundColor: Constants.Colors.headerBackColor
//             // },
//             // headerTintColor: Constants.Colors.headerColor,
//         })
//     }
// );

const MainDashboardStack = (props) = createStackNavigator({
    MainDashboard: {
        screen: ScreenMainDashboard,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle='Main Dashboard' />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
    
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      SubDashboard: {
        screen: ScreenSubDashboard,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle='SubDashboardReplace' />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("MainDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      Activity: {
        screen: Activity,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle='Activity' />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      Notice: {
        screen: Notice,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle='Notice' />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      Homework: {
        screen: Homework,
        navigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle='Homework' />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      // ParentTeacherMeeting: {
      //   screen: ParentTeacherMeetingNavigation
      // },
      OnlineLectures: {
        screen: OnlineLectures,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Online Lectures" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      Assignments: {
        screen: Assignments,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Assignments" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      eLearningHomeWork: {
        screen: eLearningHomeWork,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Homework" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      LectureNotes: {
        screen: LectureNotes,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Class Material" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
    
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      FeePayment: {
        screen: FeePayment,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Fee Payment" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },

      Citrix:{
        screen: Citrix,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Citrix" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      Academic: {
        screen: Academic,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Academic" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      ApplyForLeave: {
        screen: ApplyForLeave,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Apply For Leave" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      StudentAttendance: {
        screen: StudentAttendance,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Student Attendance" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      TeacherPTM: {
        screen: TeacherPTM,
        navigationOptions: ({ navigation }) => ({
          headerTitle: <CustomHeader title="Student Name" subtitle="Parant Teacher Meeting" />,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },






      FakeScreen: {
        screen: FakeScreen,
        navigationOptions: ({ navigation }) => ({
          headerTitle: null,
    
          headerLeft: <HamburgerIcon navigationProps={navigation} />,
          //headerRight: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("SubDashboard")} />),
          // headerStyle: {
          //   backgroundColor: Constants.Colors.headerBackColor
          // },
          // headerTintColor: '#fff',
        })
      },
      // AddLeaves: {
      //   screen: AddLeaves,
      //   navigationOptions: ({ navigation }) => ({
    
      //     title: "Add Leave",
      //     // headerStyle: {
      //     //   backgroundColor: Constants.Colors.headerBackColor
      //     // },
      //     // headerTintColor: Constants.Colors.yellowColor,
      //   }),
      // },
    // ApplyForLeave: { 
    //     MainDashboard: ScreenMainDashboard,
    //     navigationOptions: ({ navigation }) => ({
    //         headerTitle: <CustomHeader subtitle='MainDashboard' />,
    //         headerLeft: <HamburgerIcon navigationProps={navigation} />,
      
    //         // headerStyle: {
    //         //   backgroundColor: Constants.Colors.headerBackColor
    //         // },
    //         // headerTintColor: '#fff',
    //       })
    // },
    // ApplyForLeave: {
    //     screen: ApplyForLeave,
    //     navigationOptions: ({ navigation }) => ({
    //       headerTitle: <CustomHeader title="Student Name" subtitle="Apply For Leave" />,
    
    //       headerLeft: <HamburgerIcon navigationProps={navigation} />,
    
    //       // headerStyle: {
    //       //   backgroundColor: Constants.Colors.headerBackColor
    //       // },
    //       // headerTintColor: '#fff',
    //     })
    //   },
    
    });
const ProfileStatck = createStackNavigator(
    {
        Profile: ScreenProfile
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Profile" />,
            headerLeft: <HamburgerIcon navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: Constants.Colors.headerBackColor
            },
            headerTintColor: Constants.Colors.headerColor,
        })
    }
);

const LogoutStatck = createStackNavigator(
    {
        Logout: ScreenLogout
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: <CustomHeader subtitle="Logout" />,
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

const MainBottomTabNavigation = (props) = createBottomTabNavigator(
    {
        Home: MainDashboardStack,
        Profile: ProfileStatck,
        Logout: LogoutStatck,
        // Academic: AcademicStatck,
        // Notice: NoticeStatck,
        // Homework: HomeworkStatck,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName, params } = navigation.state;

              
                if (routeName === 'Home') {
                    return (
                        <Icon
                            name="md-home"
                            //color={tintColor}
                            // activeTintColor={focused}
                            size={30}
                        />
                    );
                } 
                else if (routeName == 'Profile') {
                    return (
                        <Icon
                            name="md-person"
                            //color={tintColor}
                            // activeTintColor={focused}
                            size={30}
                        />
                    );
                }
                else if (routeName == 'Logout') {
                    return (
                        <Icon
                            name="ios-log-out"
                            //color={tintColor}
                            // activeTintColor={focused}
                            size={30}
                        />
                    );
                }
                
                // else if (routeName == 'Homework') {
                //     return (
                //         <SimpleLineIcons
                //             name="note"
                //             color={tintColor}
                //             activeTintColor={focused}
                //             size={30}
                //         />
                //     );
                // }
            },
        }),
        tabBarOptions: {
            inactiveTintColor: '#263238',
        },
    }
);

// const MainBottomTabNavigation = (props) = createBottomTabNavigator(
//     {
//         Activity: ActivityStatck,
//         Academic: AcademicStatck,
//         Notice: NoticeStatck,
//         Homework: HomeworkStatck,
//     },
//     {
//         defaultNavigationOptions: ({ navigation }) => ({
//             tabBarIcon: ({ focused, horizontal, tintColor }) => {
//                 const { routeName, params } = navigation.state;

              
//                 if (routeName === 'Activity') {
//                     return (
//                         <Icon
//                             name="ios-basket"
//                             color={tintColor}
//                             activeTintColor={focused}
//                             size={30}
//                         />
//                     );
//                 } else if (routeName == 'Academic') {
//                     return (
//                         <MaterialCommunityIcons
//                             name="book-open-outline"
//                             color={tintColor}
//                             activeTintColor={focused}
//                             size={30}
//                         />
//                     );
//                 }
//                 else if (routeName == 'Notice') {
//                     return (
//                         <Icon
//                             name="ios-notifications"
//                             color={tintColor}
//                             activeTintColor={focused}
//                             size={30}
//                         />
//                     );
//                 }
//                 else if (routeName == 'Homework') {
//                     return (
//                         <SimpleLineIcons
//                             name="note"
//                             color={tintColor}
//                             activeTintColor={focused}
//                             size={30}
//                         />
//                     );
//                 }
//             },
//         }),
//         tabBarOptions: {
//             inactiveTintColor: '#263238',
//         },
//     }
// );

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


const mapStateToProp = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};


export default connect(mapStateToProp, null)(MainBottomTabNavigation);