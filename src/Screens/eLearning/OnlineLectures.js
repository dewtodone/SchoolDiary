import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, Linking, Form } from 'react-native';
import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import GLOBAL_PATH from './../../utils/GlobalPath';
import { getStdId, GetRandomColors } from './../../utils/UserTypeFunc';
import axios from 'axios';
import { Card, Right } from 'native-base';
import HTML from 'react-native-render-html';

import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPath from './../../utils/GlobalPath';
import randomColor from 'random-color';
import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import { ScrollView } from 'react-native-gesture-handler';
import OpenApp from 'react-native-open-app';
class OnlineLectures extends Component {

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
            isRefreshing: false,
            LectureNotesList: [],
            RandomColors: [],
            // GeneralNotesModalVisible: false,
            GeneralNotes: ``,
            modalVisible: false,
            userSelected: [],
            ScienceCode: '',
            ArtsCode: ''

        }
    }
    componentDidMount() {

        this.GetOnlineLecturesList();
    }

    clickEventListener = (item) => {
        this.setState({ userSelected: item }, () => {
            this.setModalVisible(true);
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    GetOnlineLecturesList = () => {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        this.setState({
            isRefreshing: true
        });
        // let url = 'http://www.colr.org/json/colors/random/35';
        // axios.get(url)
        //     .then((resp) => {
        // let a = resp.data.colors.filter(e => e.id != -1); 

        let RandomColors = [];
        for (let i = 0; i < 31; i++) {
            var color = randomColor(0.6, 0.99);
            RandomColors.push(color.hexString());
        }

        this.setState({ RandomColors });

        let UserId = this.props.SelectedUser.StudentUserId;
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.GetOnlineLectures + '?UserId=' + UserId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                // this.setState({ LectureNotesList: info.LectureNotes });
                if (info.OnlineLectures.length > 0) {
                    this.setState({ ScienceCode: info.OnlineLectures[0].ScienceCode, ArtsCode: info.OnlineLectures[0].ArtsCode });
                }
                this.setState({
                    isRefreshing: false
                });
                // console.log(this.state.LectureNotesList);
                // alert('asdas');
            })//Then Call back respAppVersion
            .catch((error) => {
                alert(error)
                console.log(error);
            });
        // })//Then Call back respAppVersion
        // .catch((error) => {
        //     alert(error)
        //     console.log(error);
        // });






    }

    onRefresh = async () => {


        this.GetOnlineLecturesList();



    };

    LectureNotesDescription = (GeneralNotes) => {
        this.setState({ GeneralNotesModalVisible: true, GeneralNotes });
    }

    DownloadLectureNotesFiles = () => {
        alert('Downloaded');
    }

    OpenGoogleMeet = (code) => {
        // const url = "gmeet://app";
        // const config = {
        //     appName: 'Google Meet',
        //     appStoreId: 'id1013231476',
        //     playStoreId: 'info.fernandoantunes',
        //     appStoreLocale: 'br',
        // };


        // OpenApp.openInStore(config);
        // alert('working');
        // alert('asd');
        // Linking.openURL('https://meet.google.com/amg-cnbr-cze');
        Linking.openURL(code);
    }


    render() {
        // let FlatListComponent = 
        let OnlineLecturesHtml = <View />
        if (this.props.SelectedUser.ClassLevel >= 3) {

            OnlineLecturesHtml = <View style={styles.cardContent}>
                {/* <Text style={styles.name}>Science Code</Text>
    <Text style={styles.position}>asdas</Text> */}
                {this.state.ScienceCode === '' ? <View /> : <TouchableOpacity style={styles.followButton} onPress={() => this.OpenGoogleMeet(this.state.ScienceCode)}>
                    <Text style={styles.followButtonText}>Open Science Code</Text>
                </TouchableOpacity>}
                {this.state.ArtsCode === '' ? <View /> : <TouchableOpacity style={styles.followButton} onPress={() => this.OpenGoogleMeet(this.state.ArtsCode)}>
                    <Text style={styles.followButtonText}>Open Arts Code</Text>
                </TouchableOpacity>}
            </View>
        }
        else {
            OnlineLecturesHtml = <View style={styles.cardContent}>
                {/* <Text style={styles.name}>Science Code</Text>
    <Text style={styles.position}>asdas</Text> */}
                {this.state.ScienceCode === '' ? <View /> : <TouchableOpacity style={styles.followButton} onPress={() => this.OpenGoogleMeet(this.state.ScienceCode)}>
                    <Text style={styles.followButtonText}>Open Live Lecture</Text>
                </TouchableOpacity>}
            </View>
        }
        return (
            <View style={styles.container} >
                <NavigationEvents onDidFocus={() => this.GetOnlineLecturesList()} />
                { this.state.ArtsCode === '' && this.state.ScienceCode === '' ? <View /> : <Card style={styles.listItem}>
                    <View>
                        {OnlineLecturesHtml}
                    </View>
                </Card>}
            </View >
        );
    }
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


export default connect(mapStateToProps, null)(OnlineLectures);
