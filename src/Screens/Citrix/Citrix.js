import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text,TouchableOpacity } from 'react-native';
import { getUserId } from './../../utils/UserTypeFunc';
import Constants from './../../utils/Constants';
import GLOBAL_PATH from './../../utils/GlobalPath';
import axios from 'axios';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from './../../store/actions/index';
import { Card, Right } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { Linking } from 'react-native';
class Citrix extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    componentDidMount() {
        this.props.OnStartLoading();
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });

        let UserId = getUserId(this.props.SelectedUser);
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.CitrixApi + Constants.Actions.CitrixApi.GetCitrixUrl + '?UserId=' + UserId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                this.props.OnStopLoading();
                if (info.Message === 'Success') {
                    Linking.openURL(info.url);
                }
                else {
                    alert(info.Message);
                }
            })
            .catch((error) => {
                this.props.OnStopLoading();
            });
    }

    render() {
        return (
            <View style={styles.container} >
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                <Card style={styles.listItem}>
                    <View>
                        <View style={styles.cardContent}>
                            <TouchableOpacity style={styles.followButton} onPress={() => this.componentDidMount()}>
                                <Text style={styles.followButtonText}>Open Citrix portal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
            </View >
        )
    };

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6E6E6"
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    cardContent: {
        marginLeft: 10,
        marginTop: 10,
        // justifyContent: 'center',
        // alignItems: "center",


    },
    separator: {
        marginTop: 7,
    },
    listItem: {
        flexDirection: "row",
        padding: 12
    },
    iconContainer: {
        // width: 100,
        // height: 100,
        alignItems: "center",
        justifyContent: "center",
        flex: 1
        // backgroundColor: "#B83227",
        // borderRadius: 100
    },
    contactIcon: {
        fontSize: 18,
        // color: Constants.Colors.yellowColor,
        fontWeight: 'bold',
        alignItems: "center",
        justifyContent: "center",
    },
    infoContainer: {
        flexDirection: "column",
    },
    infoMainText: {
        fontSize: 16,
        // fontWeight: "400",
        paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.cardBlackColor,
        fontWeight: 'bold'
    },
    infoSubText: {
        fontSize: 16,
        // fontWeight: "400",
        paddingLeft: 10,
        paddingTop: 2,
        color: Constants.Colors.CardGrayColor,

    },
    innerContainerFirstColumn: {
        justifyContent: "center",
        alignItems: "center"
    },
    innerContaineSecondColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 15,
        marginRight: 30,
    },

    followButton: {
        marginTop: 10,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
        padding: 10
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    },
    /************ modals ************/
    popup: {
        backgroundColor: 'white',
        marginTop: 80,
        marginHorizontal: 20,
        borderRadius: 7,
    },
    popupOverlay: {
        backgroundColor: "#00000057",
        flex: 1,
        marginTop: 30
    },
    popupContent: {
        //alignItems: 'center',
        margin: 5,
        height: 250,
    },
    popupHeader: {
        marginBottom: 45
    },
    popupButtons: {
        marginTop: 15,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: "#eee",
        justifyContent: 'center'
    },
    popupButton: {
        flex: 1,
        marginVertical: 16
    },
    btnClose: {
        height: 20,
        backgroundColor: '#20b2aa',
        padding: 20
    },
    modalInfo: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    };
}

export default connect(mapStateToProps, mapsDispatchToProps)(Citrix);
