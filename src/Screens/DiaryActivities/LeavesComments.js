import React, { Component } from 'react';
import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, KeyboardEvent } from 'react-native';
import { Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import profileImage from '../../assets/images/login-backg.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderBackButton } from "react-navigation-stack";
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import Constants from '../../utils/Constants';
import { startLoading, stopLoading } from './../../store/actions/index';
import GlobalPath from '../../utils/GlobalPath';
import axios from 'axios';
// const isKeyboardHide = false;

class LeavesComments extends React.Component {
 
    static navigationOptions = ({ navigation }) => {
        header: null
        return {

           
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.push("ApplyForLeave")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    state = {
        loading: false,
        isKeyboardHide: false,
        isKeyboardHeight: 0,
        LeaveRequestId: 0,
        LeavesInfo:{},
        messages: [
            // {
            //     dateTimeStr: '32',
            //     dateTimeUTC: '85',
            //     message: 'message from parent',
            //     //receiverID: 1,
            //     senderID: 2
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'asd',
            //     message: 'reply message from admin',
            //     //receiverID: 1,
            //     senderID: 1
            // },
            // {
            //     dateTimeStr: '32',
            //     dateTimeUTC: '85',
            //     message: 'message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'asd',
            //     message: 'reply message here',
            //     receiverID: 12,
            //     senderID: 12
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'second message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
            // {
            //     dateTimeStr: 'ssa',
            //     dateTimeUTC: 'ssa',
            //     message: 'third message here',
            //     receiverID: 12,
            //     senderID: 11
            // },
        ],
        UserId_Item: 'Muhammad Qasim',
        PartnerId_Item: 'Muhammad Qasim 1',
        ReceiverName_Item: 'Muhammad Qasim 2',
        ReceiverImage_Item: 'Muhammad Qasim 3',
        currentUser: this.props.SelectedUser.UserType === 'Parent'? 2: 1,
        inputMessage: ''
        // chatUser: [
        //     { name: ReceiverName_Item, profile_image: ReceiverImage_Item, last_seen: 'online' }
        // ]

    }

    constructor(props) {
        super(props);
        // this.state = {
        //     isRefreshing: false
        // }
    }

    // onRefresh = async () => {
    //     this.setState({
    //         isRefreshing: true
    //     });
    //     debugger;
    //     this.GetLeavesRequestComments(this.state.LeaveRequestId);
    //     this.setState({
    //         isRefreshing: false
    //     });
    // };

    GetLeavesRequestComments = (LeaveRequestId) => {
        this.props.OnStartLoading();
        let url = GlobalPath.API_URL + Constants.ApiController.DiaryAttendanceApi + Constants.Actions.DiaryAttendanceApi.GetLeavesRequestComments + '?LeavesRequestId='+LeaveRequestId+'&UserId=' + this.props.SelectedUser.UserId + '&UserType=' + this.props.SelectedUser.UserType;
        axios.get(url)
            .then((resp) => {
                debugger;
                this.setState({ messages: resp.data.List });
                //console.log(JSON.stringify(obj));
                this.props.OnStopLoading();
            })
            .catch((err) => {
                this.props.OnStopLoading();
            });
    }

    componentDidMount() {
        //alert(this.props.SelectedUser.UserType === 'Parent'? 2: 1)
       
        let item = this.props.navigation.getParam('item','');
       

        this.setState({ LeaveRequestId:item.Id, LeavesInfo:item});
        //this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        this.GetLeavesRequestComments(item.Id);
        // const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        //     // alert(e.endCoordinates.height);
        //     this.setState({ isKeyboardHide: true, isKeyboardHeight: e.endCoordinates.height })
        //     // alert('Keyboard Shown');
        //     // isKeyboardHide = true
        // });

        // const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        //     // setKeyboardStatus('Keyboard Hidden');
        //     this.setState({ isKeyboardHide: false })
        //     //isKeyboardHide = false
        // });


        // return () => {
        //     showSubscription.remove();
        //     hideSubscription.remove();
        // };
    }

    sendMessage = () => {
        let newMessage = this.state.inputMessage;
        if (newMessage != "") {
            this.SaveMessageApi(newMessage);
           this.AddMessgeInChat(newMessage);
           this.setState({ inputMessage : ''})
        }
    }

    SaveMessageApi= (msg) => {
        debugger;
        let objComments = {
            Comments: msg,
            LeaveRequestId: this.state.LeaveRequestId,
            CreatedBy: this.props.SelectedUser.UserId
        }

        let url = GlobalPath.API_URL + Constants.ApiController.DiaryAttendanceApi + Constants.Actions.DiaryAttendanceApi.SaveLeavesRequestComments;

        axios({ method: 'post', url: url, data: objComments })
            .then((response) => {
                if (response.data.Message != Constants.ApiResponse.Success) {
                    alert(response.data.Message);
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('Something Wrong!!. Please Again Later');
                // dispatch(stopLoading());
            });
    }

    AddMessgeInChat = (msg) => {
        let msgList = this.state.messages;
        let objNewMsg = {
            senderID: this.props.SelectedUser.UserType === 'Parent'? 2: 1,
            receiverID: 0,
            message: msg,
            dateTimeStr: ''
        }
        msgList.push(objNewMsg);
        this.setState({ messages: msgList});
    }

    render() {
        // if (false) {
        //     return (
        //         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        //             <ActivityIndicator size="large" color="#0000ff" />
        //         </View>
        //     )
        // }
        // else {

        return (
            // <KeyboardAvoidingView
            // behavior={Platform.OS === 'ios' ? '' : ''}
            // >


            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                 

                <View style={styles.container}>
                    <Card style={{ flexDirection: 'row' }}>
                        <View style={styles.ImageContainer}>
                            <Image source={profileImage} style={{ width: 58, height: 57, borderRadius: 8 }} />

                        </View>

                        <View style={styles.bannerTop}>
                            <Text style={styles.heading1}>{this.state.LeavesInfo.StudentName} </Text>
                            <Text style={styles.heading2}>Class 2A</Text>
                            <Text style={styles.heading2}>Leave</Text>
                        </View>
                    </Card>
                    {/* <View style={styles.bannerTopContainer}>


                    </View> */}

                    <FlatList
                        style={{ backgroundColor: '#F8F8F9', }}
                        // onRefresh={this.onRefresh}
                        // refreshing={this.state.isRefreshing}
                        inverted={true}
                        data={JSON.parse(JSON.stringify(this.state.messages)).reverse()}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback>
                                <View style={{ marginTop: 6 }}>
                                    <View
                                        style={{
                                            maxWidth: Dimensions.get('screen').width * 0.8,
                                            backgroundColor: item.senderID === this.state.currentUser
                                                ? '#dc71dc'
                                                : '#9c279c',
                                            alignSelf:
                                                item.senderID === this.state.currentUser
                                                    ? 'flex-end'
                                                    : 'flex-start',
                                            marginHorizontal: 10,
                                            padding: 10,
                                            borderRadius: 8,
                                            borderBottomLeftRadius:
                                                item.senderID === this.state.currentUser ? 8 : 0,
                                            borderBottomRightRadius:
                                                item.senderID === this.state.currentUser ? 0 : 8,
                                        }}>
                                        <Text style={{
                                            color: item.senderID === this.state.currentUser
                                                ? '#fff'
                                                : '#fff',
                                            fontSize: 18
                                        }}
                                        > {item.message}  </Text>
                                        <Text style={{ color: '#fff', fontSize: 12, alignSelf: 'flex-end', }}> sdfsdfd </Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    />


                    <View
                        style={{
                            paddingVertical: 8,
                            marginBottom: this.state.isKeyboardHide && Platform.OS === 'ios' ? this.state.isKeyboardHeight : 20
                        }}>
                        <View style={styles.messageInputView}>
                            <TextInput
                                defaultValue={this.state.inputMessage}
                                style={styles.messageInput}
                                placeholder='Enter Message'
                                onChangeText={(text) => this.setState({ inputMessage: text })}
                            // onSubmitEditing={() => {
                            //     sendMessage();
                            // }}
                            />
                            <TouchableOpacity
                                style={styles.messageSendView}
                                onPress={() => {
                                    this.sendMessage();
                                }}
                            >
                                <MaterialCommunityIcons name="send-circle" size={28} />

                                {/* <Icon name='send' type='material' /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )

        // }
    }
}
const styles = StyleSheet.create({
    headerLeft: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userProfileImage: { height: '100%', aspectRatio: 1, borderRadius: 100 },
    container: {
        flex: 1,
        // backgroundColor: 'blue',
        // marginTop: '20%',

    },
    messageInputView: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Constants.Colors.headerBackColorBlue

    },
    messageInput: {
        height: 43,
        flex: 1,
        paddingHorizontal: 10,
    },
    messageSendView: {
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    ImageContainer: {
        marginTop: 8,
        marginLeft: 10,
        marginBottom: 10,
        borderColor: Constants.Colors.headerBackColorBlue,
        borderWidth: 2,
        borderRadius: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    bannerTop: {
        paddingTop: 4,
        paddingLeft: 17,
        paddingBottom: 10,
        marginTop: 5
    },
    heading1: {
        fontWeight: '600',
        fontSize: 14,
    },
    heading2: {
        fontWeight: '500',
        fontSize: 15,
    }

})

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

export default connect(mapStateToProps, mapsDispatchToProps)(LeavesComments);
