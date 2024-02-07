import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, Image, StatusBar, TouchableOpacity } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator, HeaderBackButton } from "react-navigation-stack";
import { createDrawerNavigator, DrawerRouter } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AuthLoading from "../../Screens/AuthLoading";
import Login from "../../Screens/Login";
import Feed from '../../Screens/Feeds';
import ParentTeacherMeeting from '../../Screens/ParentTeacherMeeting';
// import Academic from '../../Screens/Academic';
// import Notice from '../../Screens/Notice';
// import Homework from '../../Screens/Homework';
import ApplyForLeave from '../../Screens/DiaryActivities/Attendance';
import LectureNotes from '../../Screens/eLearning/LectureNotes';
import OnlineLectures from '../../Screens/eLearning/OnlineLectures';
import Assignments from '../../Screens/eLearning/Assignments';
import eLearningHomeWork from '../../Screens/eLearning/eLearningHomeWork';

import FeePayment from '../../Screens/Fee/FeePayment';
import Profile from '../../Screens/UserSetting/Profile';
import UploadFeePaymentReceipt from '../../Screens/Fee/UploadFeePaymentReceipt';
//import FeeChallan from '../../Screens/FeeChallan';
import Events from '../../Screens/Events';
import About from '../../Screens/About';
// import Feedback from '../../Screens/Feedback';
import TeacherPTM from '../../Screens/PTM/TeacherPTM';
import Logout from '../../Screens/Logout';
import Activity from '../../Screens/DiaryActivities/Activity';
import Notice from '../../Screens/DiaryActivities/Notice';
import Homework from '../../Screens/DiaryActivities/Homework';
import Academic from '../../Screens/DiaryActivities/Academic';
import AddLeaves from '../../Screens/DiaryActivities/AddLeaves';
import AddActivity from '../../Screens/DiaryActivities/AddActivity';
import AddHomework from '../../Screens/DiaryActivities/AddHomework';
import AddNotice from '../../Screens/DiaryActivities/AddNotice';
import AddPTM from '../../Screens/PTM/AddPTM';
import test from '../../Screens/DiaryActivities/test';
import ScheduledPTM from '../../Screens/PTM/ScheduledPTM';
import ForNavigationTest from '../../Screens/test';
import CustomSideMenu from "./CustomSideMenu"; //Class Compoenetns so no backets
import MainBottomTabNavigation from "./MainBottomTabNavigation"; // this is function so brackets is necessary
import SubDashboard from "./../../Screens/General/SubDashboard";
// import MainBottomTabFunctionComponent from './MainBottomTabFunctionComponent'; 
import { ParentTeacherMeetingNavigation } from "./ParentTeacherMeetingNavigation";
import HamburgerIcon from './HamburgerIcon';
import CustomHeader from './CustomHeader';
import MainDashoboard from './../../Screens/General/MainDashboard';
import Constants from '../../utils/Constants';
import LeavesComments from '../../Screens/DiaryActivities/LeavesComments'
// class HamburgerIcon extends Component {

//   toggleDrawer = () => {

//     console.log(this.props.navigationProps);

//     this.props.navigationProps.toggleDrawer();

//   }

//   render() {

//     return (

//       <View style={{ flexDirection: 'row' }}>

//         <TouchableOpacity onPress={this.toggleDrawer.bind(this)} >

//           <Icon
//             style={{ paddingLeft: 10 }}
//             color='#fff'
//             name="md-menu"
//             size={30}
//           />

//         </TouchableOpacity>

//       </View>

//     );


//   }
// }


// const CustomHeader = ({ title, subtitle }) => (
//   <View style={styles.header}>
//     <Text style={styles.title}>{title}</Text>
//     <Text style={styles.subtitle}>{subtitle}</Text>
//   </View>
// );



const AppStack = createStackNavigator({
  // First: {
  //   screen: MainBottomTabNavigation,
  //   navigationOptions: ({ navigation }) => ({



  //     headerTitle: <CustomHeader  title="Student Name" subtitle="Activity1" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: '#0D47A1'
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },
  // ParentTeacherMeeting: {
  //   screen: ParentTeacherMeeting,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle={"Parent Teacher Meeting"} />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: Constants.Colors.headerBackColor
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },
  // FeeChallan: {
  //   screen: FeeChallan,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Fee Challan" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: Constants.Colors.headerBackColor
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },
  // Events: {
  //   screen: Events,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Events" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: Constants.Colors.headerBackColor
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },
  // About: {
  //   screen: About,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="About" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: Constants.Colors.headerBackColor
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },
  // Feedback: {
  //   screen: Feedback,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Feedback" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     headerStyle: {
  //       backgroundColor: Constants.Colors.headerBackColor
  //     },
  //     headerTintColor: '#fff',
  //   })
  // },

  // TeacherPTM: {
  //   screen: TeacherPTM,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Parent Teacher Meeting" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     // headerStyle: {
  //     //   backgroundColor: Constants.Colors.headerBackColor
  //     // },
  //     // headerTintColor: '#fff',
  //   })
  // },
  // ApplyForLeave: {
  //   screen: ApplyForLeave,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Apply For Leave" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     // headerStyle: {
  //     //   backgroundColor: Constants.Colors.headerBackColor
  //     // },
  //     // headerTintColor: '#fff',
  //   })
  // },
  // LectureNotes: {
  //   screen: LectureNotes,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="Student Name" subtitle="Class Material" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     // headerStyle: {
  //     //   backgroundColor: Constants.Colors.headerBackColor
  //     // },
  //     // headerTintColor: '#fff',
  //   })
  // },
  // Activity: {
  //   screen: Activity,
  // },
  // Notice: {
  //   screen: Notice,
  // },
  // Homework: {
  //   screen: Homework,
  // },
  // OnlineLectures: {
  //   screen: OnlineLectures,
  // },
  // Assignments: {
  //   screen: Assignments,
  // },
  // eLearningHomeWork: {
  //   screen: eLearningHomeWork,
  // },
  // FeePayment: {
  //   screen: FeePayment,
  // },
  // Academic: {
  //   screen: Academic,
  // },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <CustomHeader title="Student Name" subtitle="Profile" />,

      headerLeft: <HamburgerIcon navigationProps={navigation} />,

      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: '#fff',
    })
  },
  // ScheduledPTM: {
  //   screen: ScheduledPTM,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: <CustomHeader title="" subtitle="Parent Teacher Meeting" />,

  //     headerLeft: <HamburgerIcon navigationProps={navigation} />,

  //     // headerStyle: {
  //     //   backgroundColor: Constants.Colors.headerBackColor
  //     // },
  //     // headerTintColor: '#fff',
  //   })
  // },
  Logout: {
    screen: Logout,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <CustomHeader title="Student Name" subtitle="Logout" />,

      headerLeft: <HamburgerIcon navigationProps={navigation} />,

      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: '#fff',
    })
  },
  AddLeaves: {
    screen: AddLeaves,
    navigationOptions: ({ navigation }) => ({

      title: "Add Leave",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    }),
  },
  AddActivity: {
    screen: AddActivity,
    navigationOptions: ({ navigation }) => ({

      title: "Add Activity",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  AddHomework: {
    screen: AddHomework,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("Homework")} />),
      title: "Add Homework",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  AddNotice: {
    screen: AddNotice,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("Notice")} />),
      title: "Add Notice",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  LeavesComments: {
    screen: LeavesComments,
    navigationOptions: ({ navigation }) => ({
      //  headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("Attendance")} />),
      title: "Leaves Details",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  AddPTM: {
    screen: AddPTM,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("ParentTeacherMeeting")} />),
      title: "Create PTM",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },

  UploadFeePaymentReceipt :
  {
    screen: UploadFeePaymentReceipt,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("ParentTeacherMeeting")} />),
      headerTitle: <CustomHeader title="Student Name" subtitle="Upload Fee Payment Receipt" />,
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  MainDashoboard: {
    screen: MainDashoboard,
    navigationOptions: ({ navigation }) => ({
      headerTitle: <CustomHeader title="Student Name" subtitle="Main Dashoboard" />,

      headerLeft: <HamburgerIcon navigationProps={navigation} />,

      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: '#fff',
    })
  },
  SubDashboard: {
    screen: SubDashboard,
  },
  
  test: {
    screen: test,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("ParentTeacherMeeting")} />),
      title: "Test Accordin",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  },
  ForNavigationTest: {
    screen: ForNavigationTest,
    navigationOptions: ({ navigation }) => ({
      // headerLeft: (<HeaderBackButton tintColor={Constants.Colors.yellowColor} onPress={_ => navigation.navigate("ParentTeacherMeeting")} />),
      title: "",
      // headerStyle: {
      //   backgroundColor: Constants.Colors.headerBackColor
      // },
      // headerTintColor: Constants.Colors.yellowColor,
    })
  }
  

});



const MyDrawerNavigator = createDrawerNavigator({

  MainStack: {
    screen: MainBottomTabNavigation
  },
  ParentTeacherMeeting: {
    screen: ParentTeacherMeetingNavigation
  },
  SecondStack: {
    screen: AppStack
  },
},
  {
    contentComponent: CustomSideMenu,
    drawerWidth: Dimensions.get('window').width - 90,
  },
  { initialRouteName: "MainStack" }
);



const AuthStack = createStackNavigator({
  Login: Login
});

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: Login,
    Auth: AuthStack,
    App: MyDrawerNavigator,
    Demo: LeavesComments

    //Main: MainBottomTabNavigation
  },
  { initialRouteName: "AuthLoading" }
  // { initialRouteName: "Demo" }

);


// const styles = StyleSheet.create({

//   MainContainer: {

//     flex: 1,
//     paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
//     alignItems: 'center',
//     justifyContent: 'center',

//   },
//   header: {

//     flex: 1,
//     alignSelf: 'stretch',
//   },
//   title: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });
export default createAppContainer(AppNavigator);

