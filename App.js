/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import AppNavigator from './src/components/Navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from './src/utils/Constants';
import OneSignalPushNotication from './src/components/General/OneSignalPushNotification';
import NavigationService from './src/components/Navigation/NavigationService';
// import axios from 'axios';
console.disableYellowBox = true; //make to true to ignore warnings
export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <OneSignalPushNotication />
        <AppNavigator ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={Constants.Colors.StatusBarColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center'

  }
})