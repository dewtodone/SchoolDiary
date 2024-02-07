import React, { Component } from 'react';

import { View, StyleSheet, Text, Dimensions, TouchableOpacity, FlatList,Image, Platform } from 'react-native';
import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Badge } from "native-base";
import { getDashboardMenu } from './../../store/actions/index';
import {getUserId} from './../../utils/UserTypeFunc';
import 'react-native-gesture-handler';
class MainDashoboard extends Component {

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
        this.state = {
            isRefreshing: false
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        let UserId = getUserId(this.props.SelectedUser);
        this.props.OnGetDashboardMenu(UserId);

        // const { navigation } = this.props;
        // alert(JSON.stringify(navigation.getParam('itemId', 'NO-ID')));
    }


    onRefresh = () => {
        this.setState({
            isRefreshing: true
        });

        let UserId = getUserId(this.props.SelectedUser);
        this.props.OnGetDashboardMenu(UserId);

        this.setState({
            isRefreshing: false
        });

    };


    render() {
        //const { navigation } = this.props;
        //const dataItems = ["Activities & Updates", "eLearning", "Fees & Updates", "Settings & Updates", "Academic & Updates","Attendance & Updates"]
        const IconSize = 70;
        return (
            // <View >
            <View style={{ flex: 1 }}>
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                <Image style={styles.bgImage} source={require('./../../assets/images/bg-dashboard.png')} />
                <FlatList
                    data={this.props.ListDashboardMenu}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}

                    renderItem={(post, index) => {
                        const item = post.item;
                        return (
                            <View style={{ flexDirection: "column" }} style={{
                                borderRadius: 0, alignItems: "center",
                                justifyContent: "center", width: '50%'
                            }}>
                                {/* <View style={{ flex: 1, flexDirection: "column", marginBottom:10 }}> */}
                                <TouchableOpacity style={styles.box} onPress={() => { this.props.navigation.navigate('SubDashboard', { DashboardId: item.Id }) }}>
                                    { item.TotalCount != 0 && <Badge style={{  width: item.TotalCount.toString().length === 1? 26: null ,top: 0, position: 'absolute', fontSize: 15, right: '-3%' }}><Text style={{ marginLeft:item.TotalCount.toString().length === 1? Platform.OS === 'ios'? 1:2 : null,fontSize: 18, fontWeight: 'bold', color: 'white' }}>{item.TotalCount}</Text></Badge>}
                                    <View style={{ margin: '15%', justifyContent: 'center', alignItems: 'center', marginBottom: '30%' }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            {item.IconLibrary === Constants.IconLibrary.Icon && <Icon name={item.Icon} size={IconSize} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />}
                                            {item.IconLibrary === Constants.IconLibrary.FontAwesome && <FontAwesome name={item.Icon} size={IconSize} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />}
                                            {item.IconLibrary === Constants.IconLibrary.MaterialIcons && <MaterialIcons name={item.Icon} size={IconSize} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />}
                                        </View>
                                        <Text style={{ alignItems: 'center', fontSize: 16, textAlign: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.Name.toString()}</Text>
                                    </View>

                                </TouchableOpacity>
                                {/* </View> */}
                            </View>
                        );
                    }}
                />
            </View>

        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: '50%' // is 50% of container width
    },
    // container: {
    //     flex: 1,
    //     // marginTop: StatusBar.currentHeight || 0,
    //     // backgroundColor: '#c9c9c9',
    //     height: Dimensions.get("screen").height,
    //     display: 'flex'
    // },
    // item: {
    //     // backgroundColor: '#3232ff',
    //     // alignItems: 'center',
    //     // justifyContent: 'center',
    //     // width: '100%',
    //     flexDirection: 'row',
    //     // marginBottom: '2%',
    //     // height: '100%'
    // },
    // outerContainer: {
    //     // backgroundColor: '#3232ff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     width: '100%',
    //     flexDirection: 'column',
    //     marginBottom: '1%',
    //     // height: '100%'
    // },
    box: {

        height: 160,
        borderColor: 'black',
        backgroundColor: 'white',
        margin: '5%',
        width: '90%',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        borderRadius: 8,

        elevation: 24,
    },
    roundButton: {
        width: 100,
        height: 100,
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
        // marginLeft: '5%',
        // marginTop: '13%',
        // borderRadius: 100,
        // backgroundColor: 'orange',
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',

        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        ListDashboardMenu: state.reducerDashboard.lstDashboardMenu
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        OnGetDashboardMenu: (UserId) => dispatch(getDashboardMenu(UserId)),

    };
}


export default connect(mapStateToProps, mapsDispatchToProps)(MainDashoboard);