
import React , {Component} from 'react';
import {View,Text} from 'react-native';
import {connect} from 'react-redux';

import { ProgressDialog } from "react-native-simple-dialogs";
import { statement } from '@babel/template';

class ProgressBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <ProgressDialog
        title="Loading"
        activityIndicatorColor="cyne"
        activityIndicatorSize="large"
        animationType="slide"
        message="Please, wait..."
        visible={this.props.isLoading}
    />
        );
    }
}

const mapStateToProps = state =>{
    return{
        isLoading: state.reducerUi.isLoading
    }
}

export default  connect(mapStateToProps,null)(ProgressBar)
    