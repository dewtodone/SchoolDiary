import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import axios from 'axios';
import { getOneSignalPlayerId } from '../components/General/LoginUserInfo';
import  GLOABAL_PATH  from '../utils/GlobalPath';

class Logout extends Component {


  constructor(props) {
    super(props);    
  //   this.state = {
  //     showProgress: false,
      
  // }
}

  componentDidMount() {
    
    
    getOneSignalPlayerId().then((response) => {
     let PlayerId = response;
      console.log(PlayerId);
      AsyncStorage.removeItem('NgsSd:LoginUserInfo');
      let url = GLOABAL_PATH.API_URL + 'LoginApi/Logout?PlayerId=' + PlayerId + '&UserId=' + this.props.SelectedUser.UserId;
      axios.get(url)
      .then(res => {
        console.log(res.data);
        this.props.navigation.navigate("AuthLoading");
      })
    }).catch((error) => {
      
      console.log('Promise is rejected with error: ' + error);
  });
  }


  render() {

    return (

      <View style={styles.MainContainer}>
        <Text style={styles.text}>Logout</Text>
      </View>
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

const mapStateToProps = state => {
  return {
    SelectedUser: state.reducerLogin.SelectedUser,
  }
}

export default connect(mapStateToProps, null)(Logout);