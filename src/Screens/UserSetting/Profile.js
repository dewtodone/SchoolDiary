import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, Clipboard, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, YellowBox, Dimensions, StatusBar, Picker, FlatList, Linking, Form, Animated,Keyboard } from 'react-native';
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


import { Left, Container, Input, Item, Label, Button } from 'native-base';
import { getAvailableLocationProviders } from 'react-native-device-info';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

class Profile extends Component {

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
            ProfileInfo: null,
            BranchName: '',
            Username: '',
            Password: '',
            Name: '',
            Address: '',
            Area: '',
            City: '',
            MobileNo: '',
            Email: '',
            NewMobileNoOrEmail: '',
            ModalVisible: false,
            MobileNoOTP: '',
            OTPVisible: false,
            IsTimerEnabled: false,
            IsResendOTP: false,
            IsSubmitOTP: false,
            OTPText: '',
            IsMoibleTrueEmailFalse: true

        }
    }
    componentDidMount() {
        this.GetProfileInfo();
    }
    GetProfileInfo = () => {

        this.props.OnStartLoading();
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });

        let ParentUserLoginId = this.props.SelectedUser.UserId;
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.LoginApi + Constants.Actions.LoginApi.ParentProfile + '?ParentUserId=' + ParentUserLoginId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                //alert(JSON.stringify(info));
                // this.setState({ LectureNotesList: info.LectureNotes });
                if (info != null) {
                    this.setState({
                        // FeePaymentInfo: info.Profile.objFeePaymentInfo,
                        BranchName: info.Profile.BranchName,
                        Username: info.Profile.Username,
                        Password: info.Profile.Password,
                        Name: info.Profile.Name,
                        Address: info.Profile.Address,
                        Area: info.Profile.Area,
                        City: info.Profile.City,
                        MobileNo: info.Profile.MobileNo,
                        Email: info.Profile.Email,
                        // NewMobileNo: info.Profile.MobileNo
                        // DueDate: info.Info.objFeePaymentInfo.DueDate,
                        // Installment: info.Info.objFeePaymentInfo.Installment,
                        // FeePaymentStatus: info.Info.objFeePaymentInfo.FeePaymentStatus,
                        // IsPayFee: info.Info.objFeePaymentInfo.IsPayFee,
                        // AdminRejectedComments: info.Info.objFeePaymentInfo.AdminCommentsRejected,

                    });
                    //this.props.OnSetFeePaymentInfo(info);
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


    ChangeMobileNo = () => {
        this.setState({ ModalVisible: true, IsMoibleTrueEmailFalse: true });
    }



    ChangeEmail = () => {
        this.setState({ ModalVisible: true, IsMoibleTrueEmailFalse: false });
    }


    Change = () => {
        if (this.state.IsSubmitOTP === false) {
            this.SendOTP();
        }
        else {
            if (this.state.MobileNoOTP != this.state.OTPText) {
                alert('Please enter correct OTP')
            }
            else {
                this.props.OnStartLoading();
                let ParentUserLoginId = this.props.SelectedUser.UserId;
                let Action = Constants.Actions.LoginApi.SaveEmail;
                let FunctionVariable  = 'Email';
                let alertMsg = 'Email Successfully updated';
                if (this.state.IsMoibleTrueEmailFalse) {
                    Action = Constants.Actions.LoginApi.SaveMobileNo;
                    FunctionVariable = 'MobileNo';
                    alertMsg = 'Mobile No. Successfully updated';
                }
                
                let url = GLOBAL_PATH.API_URL + Constants.ApiController.LoginApi + Action + '?'+FunctionVariable+'=' + this.state.NewMobileNoOrEmail + '&UserId=' + ParentUserLoginId;
                axios.get(url)
                    .then((resp) => {
                        this.props.OnStopLoading();
                        let info = resp.data;
                        //alert(JSON.stringify(info));
                        // this.setState({ LectureNotesList: info.LectureNotes });

                        if (info.Message === 'Success') {
                            alert(alertMsg);
                            this.setState({ ModalVisible: false });
                            this.CloseModal();
                            this.GetProfileInfo();
                        }
                        else {
                            alert(info.Message);
                        }

                        // alert('OTP has been sent to your mobile no.');
                    })//Then Call back respAppVersion
                    .catch((error) => {
                        // alert(error)
                        this.props.OnStopLoading();
                    });



            }
        }
    }


    SendOTP = () => {
        if (this.state.IsMoibleTrueEmailFalse) {
            if (this.state.MobileNo === this.state.NewMobileNoOrEmail) {
                alert('Please enter difference Mobile no. or Close');
            }
            else if (this.state.NewMobileNoOrEmail.substr(0, 3) != '923' || this.state.NewMobileNoOrEmail.length != 12) {
                alert('Please enter valid mobile number');
            }
            else {
                this.props.OnStartLoading();
                this.setState({ IsResendOTP: false });

                let ParentUserLoginId = this.props.SelectedUser.UserId;
                let url = GLOBAL_PATH.API_URL + Constants.ApiController.LoginApi + Constants.Actions.LoginApi.ChangeMobileNoOTP + '?MobileNo=' + this.state.NewMobileNoOrEmail + '&UserId=' + ParentUserLoginId;
                axios.get(url)
                    .then((resp) => {
                        let info = resp.data;
                        //alert(JSON.stringify(info));
                        // this.setState({ LectureNotesList: info.LectureNotes });

                        if (info != null) {
                            this.setState({
                                MobileNoOTP: info.LoginInfo.OTP,
                                OTPVisible: true,
                                IsTimerEnabled: true,
                                IsResendOTP: false,
                                IsSubmitOTP: true,

                            });
                            //this.props.OnSetFeePaymentInfo(info);
                        }
                        this.props.OnStopLoading();
                        // alert('OTP has been sent to your mobile no.');
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
        } else {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (this.state.Email === this.state.NewMobileNoOrEmail) {
                alert('Please enter difference Email or Close');
            }
            else if (reg.test(this.state.NewMobileNoOrEmail) === false) {
                alert('Please enter valid email');
            }
            else {
                this.props.OnStartLoading();
                this.setState({ IsResendOTP: false });

                let ParentUserLoginId = this.props.SelectedUser.UserId;
                let url = GLOBAL_PATH.API_URL + Constants.ApiController.LoginApi + Constants.Actions.LoginApi.ChangeEmailOTP + '?Email=' + this.state.NewMobileNoOrEmail + '&UserId=' + ParentUserLoginId;
                axios.get(url)
                    .then((resp) => {
                        let info = resp.data;
                        //alert(JSON.stringify(info));
                        // this.setState({ LectureNotesList: info.LectureNotes });

                        if (info != null) {
                            this.setState({
                                MobileNoOTP: info.LoginInfo.OTP,
                                OTPVisible: true,
                                IsTimerEnabled: true,
                                IsResendOTP: false,
                                IsSubmitOTP: true,

                            });
                            //this.props.OnSetFeePaymentInfo(info);
                        }
                        this.props.OnStopLoading();
                        // alert('OTP has been sent to your mobile no.');
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
        }
    }

    CloseModal = () => {
        this.setState({ ModalVisible: false, NewMobileNoOrEmail: '', OTPVisible: false, IsSubmitOTP: false, IsResendOTP: false, IsTimerEnabled: false });
    }

    render() {
        // let FlatListComponent = 
        // let DownloadFeeChallan = this.DownloadFeeChallan.bind(this);

        return (
            <View style={styles.container} >
                <NavigationEvents onDidFocus={() => this.GetProfileInfo()} />
                <View style={{ ...styles.card, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>

                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Branch :</Text>
                            </View>
                        </View>

                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.BranchName}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Username :</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Username}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Password :</Text>
                            </View>
                        </View>

                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Password}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Parent Name:</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Name}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Address :</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Address}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Area :</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Area}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> City :</Text>
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.City}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor2 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Mobile No. :</Text>
                            </View>
                        </View>
                        <View style={{
                            ...styles.column2, ...styles.greenColumn,
                            flexDirection: 'row',
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.TextColumn2}> {this.state.MobileNo}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={{ ...styles.followButton, marginLeft: 2, marginRight: 2 }} onPress={() => this.ChangeMobileNo()}>
                                    <Text style={styles.followButtonText}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.separator}></Text>
                    <View style={{ ...styles.row, ...styles.rowColor1 }}>
                        <View style={styles.column1}>
                            <View style={styles.blueColumn}>
                                <Text style={styles.TextColumn1}> Email:</Text>

                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.greenColumn}>
                                <Text style={styles.TextColumn2}> {this.state.Email}</Text>
                                <TouchableOpacity style={{ ...styles.followButton, marginLeft: 5, marginRight: 10 }} onPress={() => this.ChangeEmail()}>
                                    <Text style={styles.followButtonText}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                    <Text style={styles.separator}></Text>
                </View>

                <Modal
                    visible={this.state.ModalVisible}
                    modalTitle={<ModalTitle title={this.state.IsMoibleTrueEmailFalse ? 'Change Mobile No.' : 'Change Email'} textStyle={{ color: Constants.Colors.headerBackColor, fontWeight: 'bold' }} />}

                    maxHeight={100}
                    width={0.9}
                    footer={
                        <ModalFooter style={{ height: 40 }}>
                            <Right>
                                <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                    <TouchableOpacity style={{ width: '40%', paddingLeft: 20 }} onPress={() => this.CloseModal()}>
                                        <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </ModalFooter>
                    }
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'left',
                    })}
                    onTouchOutside={() => this.ModalOutsiderClickHandler}
                >
                    <ModalContent>
                        <View>

                            {/* <Container> */}
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    Keyboard.dismiss;
                                }}
                            >
                                <View>
                                    <Text style={{ fontSize: 16, marginBottom: 10 }}> {this.state.IsMoibleTrueEmailFalse ? 'Please enter new mobile number \n (format: 923001234567)' : 'Please enter new email'}</Text>
                                    <Item style={styles.inputItem} floatingLabel>
                                        <Label style={{ color: Constants.Colors.headerBackColor }}>{this.state.IsMoibleTrueEmailFalse ? 'Mobile No' : 'Email'}</Label>
                                        <Input
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            keyboardType={this.state.IsMoibleTrueEmailFalse?"decimal-pad":"email-address"}
                                            placeholder="e.g: 923001234567"
                                            maxLength={this.state.IsMoibleTrueEmailFalse ? 12 : 100}
                                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                                            value={this.state.NewMobileNoOrEmail}
                                            onChangeText={(NewMobileNoOrEmail) => this.setState({ NewMobileNoOrEmail })}

                                        />
                                    </Item>
                                    {this.state.OTPVisible === true && <Item style={styles.inputItem} floatingLabel>
                                        <Label style={{ color: Constants.Colors.headerBackColor }}>OTP</Label>
                                        <Input
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            keyboardType="decimal-pad"
                                            placeholder="OTP"

                                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                                            onChangeText={(OTPText) => this.setState({ OTPText })}

                                        />
                                    </Item>}

                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15, flexDirection: 'row' }}>
                                        <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.Colors.headerBackColor, width: '50%' }}
                                            onPress={() => this.Change()}>
                                            <Icon name='md-send' style={{ color: Constants.Colors.yellowColor }} />
                                            <Text style={{ paddingLeft: 10, color: Constants.Colors.yellowColor, fontSize: 18, fontWeight: 'bold' }}> {this.state.OTPVisible === true ? 'Submit OTP' : 'Send'}</Text>
                                        </Button>
                                        {this.state.IsResendOTP === true && <TouchableOpacity style={{ width: '40%', paddingLeft: 20 }} onPress={() => this.SendOTP()}>
                                            <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Resend OTP</Text>
                                        </TouchableOpacity>}
                                        {this.state.IsTimerEnabled === true && <CountdownCircleTimer
                                            onComplete={() => {
                                                this.setState({ IsTimerEnabled: false, IsResendOTP: true });
                                            }}
                                            isPlaying={this.state.IsTimerEnabled}
                                            duration={90}
                                            size={70}
                                            strokeWidth={5}

                                            colors={[
                                                ['#004777', 0.4],
                                                ['#F7B801', 0.4],
                                                ['#A30000', 0.2],
                                            ]}
                                        >
                                            {({ remainingTime, animatedColor }) => (
                                                <Animated.Text style={{ color: animatedColor }}>
                                                    {remainingTime}
                                                </Animated.Text>
                                            )}
                                        </CountdownCircleTimer>
                                        }
                                    </View>
                                    {this.state.IsMoibleTrueEmailFalse ? <View>
                                        <Text><Text style={{ color: 'red', fontWeight: 'bold' }}>
                                            Note:
                                        </Text>
                                            <Text>
                                                Kindly intimate school office if your mobile no. is converted to any other network
                                        </Text></Text>
                                    </View> : <View></View>
                                    }
                                    {/* <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/nolan/40/000000/email.png' }} /> */}
                                    {/* <Icon name="md-lock" size={26} style={styles.inputIcon} /> */}
                                    {/* <Item style={styles.inputItem} >
                                                <Label>Mobile No</Label>
                                                <Input
                                                    autoCorrect={false}
                                                    autoCapitalize="none"
                                                    keyboardType="default"
                                                    // placeholder="Enter Title"
                                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                
                                                />
                                            </Item> */}
                                </View>

                            </TouchableWithoutFeedback>
                            {/* </Container> */}
                        </View>
                    </ModalContent>
                </Modal>



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
        marginTop: 2,

        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: "#00BFFF",
        padding: 2,
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        paddingLeft: 2,
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
        flexBasis: '33%',
        flex: 1,
    },
    column2: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '67%',
        flex: 1,
    },

    blueColumn: {
        // backgroundColor: 'blue',
        height: 40,
        borderRightColor: 'white',
        borderRightWidth: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 4

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

export default connect(mapStateToProps, mapsDispatchToProps)(Profile);
