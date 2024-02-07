import React, { Component } from 'react';

import AttendanceParent from './AttendanceParent';
import AttendanceTeacher from './AttendanceTeacher';
import { View, Text } from 'react-native';
//import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList } from 'react-native';
// import { Card } from 'native-base';
// import Entypo from 'react-native-vector-icons/Entypo'
import { connect } from 'react-redux';
import Constants from '../../utils/Constants';
import { NavigationEvents } from 'react-navigation';
// import { View } from 'native-base';
// import { getLeavesRequest } from '../../store/actions/index';
// import Constants from '../../Utilies/Constants';
class Attendance extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
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
    let attendanceScreen = <AttendanceParent navigation={this.props.navigation}/>

    if (this.props.SelectedUser.UserType === Constants.UserType.Parent) {
      attendanceScreen = <AttendanceParent navigation={this.props.navigation} />
    }

    return (
      <View style={{ flex: 1 }}>
         <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        {attendanceScreen}
      </View>
      // <View>
      //   <Text>afsad</Text>
      // </View>

      //   <View style={styles.container}>
      //     <FlatList
      //       data={this.props.LeavesRequestList}
      //       keyExtractor={(item) => {
      //         return item.Id;
      //       }}

      //       ItemSeparatorComponent={() => {
      //         return (
      //           <View style={styles.separator} />
      //         )
      //       }}
      //       // onRefresh={() => this.onRefresh()}
      //       // refreshing={this.state.refreshing}
      //       renderItem={(post, index) => {
      //         const item = post.item;

      //         return (
      //           // <TouchableOpacity
      //           //   onPress={() => {
      //           //     this.props.navigation.navigate("AddLeaves");
      //           //   }}
      //           // >
      //             <Card style={styles.listItem}>
      //               <View style={styles.infoContainer} style={{ width:75,height:75, borderRadius:50, backgroundColor:Constants.Colors.headerBackColor,alignItems: "center",
      // justifyContent: "center"}}>
      //                 <View style={styles.innerContainerFirstColumn} >
      //                   <Text style={styles.contactIcon}>
      //                     {item.Day}
      //                   </Text>
      //                 </View>
      //                 <View style={styles.innerContainerFirstColumn}>
      //                   <Text style={styles.contactIcon}>
      //                     {item.Month}
      //                   </Text>
      //                 </View>
      //               </View>
      //               <View style={styles.infoContainer}>
      //                 <View style={styles.innerContaineSecondColumn}>
      //                   <Text style={styles.infoMainText}>
      //                     {item.LeavesType}
      //                   </Text>
      //                 </View>
      //                 <View style={styles.innerContaineSecondColumn}>
      //                   <Text style={styles.infoSubText}>{item.Reason}</Text>
      //                 </View>
      //               </View>
      //             </Card>
      //           // </TouchableOpacity>
      //         );
      //       }}

      //     />

      //     <TouchableOpacity
      //       style={styles.floatButton}
      //       onPress={() => {
      //         this.props.navigation.navigate("AddLeaves");
      //       }}
      //     >
      //       <Entypo name="plus" size={30} color={Constants.Colors.yellowColor} />
      //     </TouchableOpacity>


      //   </View>
      //   <View style={styles.MainContainer}>

      //     <Text style={styles.text}>Attendance</Text>
      // <Text style={styles.text}>{this.props.LeavesRequestList.length}</Text>
      //   </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    SelectedUser: state.reducerLogin.SelectedUser
  }
}

export default connect(mapStateToProps, null)(Attendance);