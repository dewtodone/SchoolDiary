import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import  Constants from '../../utils/Constants';
import { getStudentOrClassName} from  '../../utils/UserTypeFunc';


class CustomHeader extends Component {
    constructor(props) {
        super(props);       
    }

    render() {
        // if (!this.props.SelectedUser) {
            return (
                <View style={styles.header}>                  
                    <Text style={{...styles.title, color: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor }}>{getStudentOrClassName(this.props.SelectedUser)}</Text>
                    {<Text style={{...styles.subtitle, color: this.props.SelectedUser.ClassLevel === 1? Constants.Colors.yellowColor  : Constants.Colors.whiteColor }}>{this.props.subtitle === 'SubDashboardReplace' ?this.props.ListSubDashboardMenu.length > 0 ?this.props.ListSubDashboardMenu[0].ParentDashboardName.replace('   ',' '): '' : this.props.subtitle}</Text>}
                </View>
            );
        // }
    }
}


const styles = StyleSheet.create({
    header: {

        flex: 1,
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 20,
         // color: Constants.Colors.yellowColor,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        // color: Constants.Colors.yellowColor,
        fontWeight: 'bold',
    },
});

const mapStateToProp = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser    ,
        ListSubDashboardMenu: state.reducerDashboard.lstSubDashboardMenu  
    };
};


export default connect(mapStateToProp, null)(CustomHeader);
// this.props.StudentName
// export default CustomHeader;