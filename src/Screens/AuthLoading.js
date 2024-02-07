import React, { Component } from "react";
import { View, Text,Alert } from "react-native";
import {} from "react-navigation";

class AuthLoading extends Component {
  static navigationOptions = {
    title: "Please sign in"
  };
  constructor(props){
      super(props);
  }
  componentDidMount() {
      let that =this;
      
    setTimeout(() => {
       
      that.props.navigation.navigate("App");
    }, 3000);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Loading</Text>
      </View>
    );
  }
}
export default AuthLoading;
