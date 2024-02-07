import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, Clipboard, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, Linking, Form } from 'react-native';
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
import { setFeePaymentInfo, startLoading, stopLoading } from './../../store/actions/index';
import OpenApp from 'react-native-open-app';

class ParentProfile extends Component {

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
            FeePaymentInfo: null,
            TotalAmount: '',
            DueDate: '',
            FeePaymentStatus: '',
            Installment: '',
            IsPayFee: true,
            AdminRejectedComments: ''
        }
    }

    componentDidMount() {
        this.GetFeePaymentInfo();
    }


    GetFeePaymentInfo = () => {
     
        this.props.OnStartLoading();
        //this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });

        let StdId = this.props.SelectedUser.Id;
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.FeeApi + Constants.Actions.FeeApi.GetStudentFeeChallanInfo + '?StdId=' + StdId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                //alert(JSON.stringify(info));
                // this.setState({ LectureNotesList: info.LectureNotes });
                if (info != null) {
                    this.setState({
                        FeePaymentInfo: info.Info.objFeePaymentInfo,
                        TotalAmount: info.Info.objFeePaymentInfo.TotalAmount,
                        DueDate: info.Info.objFeePaymentInfo.DueDate,
                        Installment: info.Info.objFeePaymentInfo.Installment,
                        FeePaymentStatus: info.Info.objFeePaymentInfo.FeePaymentStatus,
                        IsPayFee: info.Info.objFeePaymentInfo.IsPayFee,
                        AdminRejectedComments: info.Info.objFeePaymentInfo.AdminCommentsRejected,

                    });
                    this.props.OnSetFeePaymentInfo(info);
                }
                this.props.OnStopLoading();

            })//Then Call back respAppVersion
            .catch((error) => {
                // alert(error)
                this.props.OnStopLoading();
            });
        // })//Then Call back respAppVersion
        // .catch((error) => {
        //     alert(error)
        //     console.log(error);
        // });






    }

    LectureNotesDescription = (GeneralNotes) => {
        this.setState({ GeneralNotesModalVisible: true, GeneralNotes });
    }

    DownloadLectureNotesFiles = () => {
        alert(this.state.FeePaymentInfo.Path);
        Linking.openURL(GLOBAL_PATH.USER_IMAGE_PATH + this.state.FeePaymentInfo.Path);
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

    PayFee() {

        this.props.navigation.navigate('UploadFeePaymentReceipt');


    }

    PayFee1() {
        alert('adasd');
    }

    DownloadFeeChallan = () => {

        Linking.openURL(GLOBAL_PATH.USER_IMAGE_PATH + this.state.FeePaymentInfo.Path);
    }


 


    render() {
        // let FlatListComponent = 
        // let DownloadFeeChallan = this.DownloadFeeChallan.bind(this);
        let colorPaymentStatus = 'black';
        if (this.state.FeePaymentStatus === 'Rejected') {
            colorPaymentStatus = 'red';
        } else if (this.state.FeePaymentStatus === 'Paid') {
            colorPaymentStatus = 'green';
        } else if (this.state.FeePaymentStatus === 'Partially Paid') {
            colorPaymentStatus = 'blue'
        }
        else if (this.state.FeePaymentStatus === 'In Review') {
            colorPaymentStatus = '#ff6600'
        }
        return (
            <View style={styles.container} >
                <NavigationEvents onDidFocus={() => this.GetFeePaymentInfo()} />
                <View style={{ ...styles.card, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>

                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}> 
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Total Payable :</Text>
                            </View> 
                        </View>

                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.TotalAmount}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Due Date :</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.DueDate}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Fee Period :</Text>
                            </View>
                        </View>

                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Installment}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Payment Status:</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={{ ...styles.TextColumn2, color: colorPaymentStatus }}> {this.state.FeePaymentStatus}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...styles.row, marginLeft:4, marginRight:4 }}>
                        <View style={{ ...styles.column1 }}>
                            <TouchableOpacity disabled={!this.state.IsPayFee} style={{ ...styles.followButton, backgroundColor: !this.state.IsPayFee ? "gray" : '#00BFFF' }} onPress={() => this.PayFee()}>
                                <Icon name="md-briefcase" size={24} color={Constants.Colors.whiteColor} />
                                <Text style={styles.followButtonText}>Pay Fee</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.column2}>
                            <TouchableOpacity style={{ ...styles.followButton, marginLeft: 5, marginRight:10 }} onPress={() => this.DownloadFeeChallan()}>
                                <Icon name="md-download" size={24} color={Constants.Colors.whiteColor} />
                                <Text style={styles.followButtonText}>Download Fee Challan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                </View>

                {this.state.FeePaymentStatus === 'Rejected' && <Card style={{ ...styles.listItem }}>
                    <View >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>{this.state.AdminRejectedComments}</Text>
                    </View>
                </Card>
                }
                {/* <Card style={{ ...styles.listItem, backgroundColor: 'blue' }}>




                    <View style={{ ...styles.modalColumn, backgroundColor: 'yellow' }}>

                        <View style={{ ...styles.modalRow, backgroundColor: 'green' }}>
                            <Text style={styles.rowText}>Total Amount Payable: </Text>
                            <Text style={styles.rowText}>{this.state.TotalAmount} </Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={styles.rowText}>Due Date: </Text>
                            <Text style={styles.rowText}>{this.state.DueDate}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={styles.rowText}>Fee Period: </Text>
                            <Text style={styles.rowText}>{this.state.Installment}</Text>
                        </View>


                        <View style={styles.modalRow}>
                            <Text style={styles.rowText}>Payment Status: </Text>
                            <Text style={styles.rowText}>{this.state.FeePaymentStatus}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <TouchableOpacity style={styles.followButton} onPress={() => this.PayFee()}>
                                <Icon name="md-briefcase" size={24} color={Constants.Colors.whiteColor} />
                                <Text style={styles.followButtonText}>Pay Fee</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ ...styles.followButton, marginLeft: 30 }} onPress={() => this.DownloadFeeChallan()}>
                                <Icon name="md-download" size={24} color={Constants.Colors.whiteColor} />
                                <Text style={styles.followButtonText}>Download Fee Challan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card> */}
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        marginRight: 7,
        marginLeft: 7


    },

    // cardHeader: {
    //     paddingVertical: 12,
    //     paddingHorizontal: 16,
    //     // borderRadius:8,
    //     borderTopLeftRadius: 8,
    //     borderTopRightRadius: 8,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',

    // },
    /******** card **************/
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 6,
        backgroundColor: "white",
        borderRadius: 4,
        borderWidth: 2,
        // marginLeft: 10,
        // marginRight: 10,

    },
    // cardHeader: {
    //     paddingVertical: 12,
    //     paddingHorizontal: 16,
    //     // borderRadius:8,
    //     borderTopLeftRadius: 8,
    //     borderTopRightRadius: 8,
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',

    // },
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

        height: 2
    },
    separatorVertical: {

        width: 2
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
        backgroundColor: 'red',
    },

    followButton: {
        marginTop: 10,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: "#00BFFF",
        padding: 10,
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        paddingLeft: 10,
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
    },


    modal: {
        backgroundColor: '#add8e6',
        marginTop: height - 500,
        paddingLeft: 50,
        paddingRight: 50

    },
    row: {
        // flexDirection: 'row',
        // justifyContent: 'center',
        // padding: 10,
        // backgroundColor: '#F6F6F6',

        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    column1: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '38%',
        flex: 1,
    },
    column2: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '62%',
        flex: 1,
    },

    blueColumn: {
        // backgroundColor: 'blue',
        height: 40,
        borderRightColor: 'white',
        borderRightWidth: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight : 4

    },

    greenColumn: {
        // backgroundColor: 'green',
        height: 40,
        paddingLeft: 4,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    rowColor1: {
        backgroundColor: '#e6e6e6', //e2e6ec

    },
    rowColor2: {
        backgroundColor: '#cccccc', //c9d1e1
    },
    TextColumn1: {
        color: '#2482c9',//6fa9d4
        fontSize: 16,
        fontWeight: 'bold',
    },
    TextColumn2: {
        color: 'black', //This color is used in PaymentStaus when not rejected
        fontSize: 16,
        fontWeight: 'bold',

    },

    rowText: {
        flex: 1,
        flexDirection: 'row',

        // justifyContent: 'center',
        fontSize: 15

    },

    rowTextModal: {
        justifyContent: 'center',
        fontSize: 16

    },

    modalRow: {
        flexDirection: 'row',
        marginTop: 10,
        // borderBottomWidth: 1,
        // justifyContent: 'center'

    },
    modalCloseButton: {
        marginTop: 10
    },
});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        OnSetFeePaymentInfo: (FeePaymentInfo) => dispatch(setFeePaymentInfo(FeePaymentInfo)),
        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    };
}

export default connect(mapStateToProps, mapsDispatchToProps)(ParentProfile);
