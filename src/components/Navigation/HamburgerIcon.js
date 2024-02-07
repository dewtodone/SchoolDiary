
import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utils/Constants';
import { connect } from 'react-redux';

class HamburgerIcon extends Component {
    constructor(props){
        super(props);
    }


    toggleDrawer = () => {
  
      //console.log(this.props.navigationProps);
  
      this.props.navigationProps.toggleDrawer();
  
    }
  
    render() {
  
      return (
  
        <View style={{ flexDirection: 'row' }}>
  
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)} >
  
            <Icon
              style={{ paddingLeft: 10 }}
              color={this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor}
              name="md-menu"
              size={30}
            />
  
          </TouchableOpacity>
  
        </View>
  
      );
  
  
    }
  }

  const maspStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser   
    };
}

  
export default connect(maspStateToProps, null)(HamburgerIcon);