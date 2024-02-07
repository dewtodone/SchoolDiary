import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button } from 'react-native';
import Constants from  './../../utils/Constants';
import ScheduledPTM from './ScheduledPTM'



import { connect } from 'react-redux';

class TeacherPTM extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
        },
        headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
    }
};

componentDidMount(){
  this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
}



  render() {

    return (
      <ScheduledPTM />
      // <View style={styles.MainContainer}>

      //   <Text style={styles.text}>Teacher PTM</Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {

    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',

  },
});


const mapStateToProps = (state) => {
  return {
      SelectedUser: state.reducerLogin.SelectedUser
  };
};


export default connect(mapStateToProps, null)(TeacherPTM);
