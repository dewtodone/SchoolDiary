import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button } from 'react-native';

class About extends Component {

    static navigationOptions =
      {
        title: 'Home'
  
      };
  
 
  
    
  
    render() {
  
      return (
  
        <View style={styles.MainContainer}>
  
          <Text style={styles.text}>About</Text>
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

  export default About;