import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, TouchableWithoutFeedback,TextInput,Keyboard } from 'react-native';
import { Card, Badge, Right } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { getLeavesRequest } from '../../store/actions/index';
import Constants from '../../utils/Constants';
import { getStdId, getClassIdIfTeacher, plusButtonShowForTeachers, plusButtonShowForParents } from '../../utils/UserTypeFunc';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton, Backdrop } from 'react-native-modals';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { startLoading, stopLoading } from './../../store/actions/index';
import GlobalPath from '../../utils/GlobalPath';
import axios from 'axios';
import moment from 'moment';
class AttendanceParent extends Component {

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
            modalVisible: false,
            ModalStudentImage: '',
            ModalStudentName: '',
            ModalClass: '',
            ModalLeavesType: '',

            loading: false,
            isKeyboardHide: false,
            isKeyboardHeight: 0,
            LeaveRequestId: 0,
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
            currentUser: this.props.SelectedUser.UserType === 'Parent' ? 2 : 1,
            inputMessage: ''
            // chatUser: [
            //     { name: ReceiverName_Item, profile_image: ReceiverImage_Item, last_seen: 'online' }
            // ]
        }


        // this.props.onGetLeavesRequest(this.props.SelectStudent.StdId, this.props.SelectStudent.ClassId);
    }

    // componentWillMount () {
    //     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    //     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    //   }
        
    //   componentWillUnmount () {
    //     this.keyboardDidShowListener.remove();
    //     this.keyboardDidHideListener.remove();
    //   }
        
    //   _keyboardDidShow () {
    //     alert('Keyboard Shown');
    //     this.setState({ isKeyboardHide: true })
    //   }
        
    //   _keyboardDidHide () {
    //     this.setState({ isKeyboardHide: false })
    //   }

    componentDidMount() {
        this.props.onGetLeavesRequest(getStdId(this.props.SelectedUser), getClassIdIfTeacher(this.props.SelectedUser));

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
    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        });

        this.props.onGetLeavesRequest(getStdId(this.props.SelectedUser), getClassIdIfTeacher(this.props.SelectedUser));

        this.setState({
            isRefreshing: false
        });

    };

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
            dateTimeStr: new Date()
        }
        msgList.push(objNewMsg);
        this.setState({ messages: msgList});
    }

    GetViewCommentsButton(item) {
        return <TouchableOpacity style={{
            backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
            borderRadius: 5,

            //borderColor: Constants.Colors.headerBackColor,
            borderWidth: 1
        }}
             //onPress={() => this.props.navigation.navigate('LeavesComments', { item: item })}
             onPress={() => this.OpenModal(item)}
        >
            {/* { <Badge style={{  width: "5".toString().length === 1? 26: null ,top: 0, position: 'absolute', fontSize: 15, right: '-3%' }}><Text style={{ marginLeft:"5".toString().length === 1? Platform.OS === 'ios'? 1:2 : null,fontSize: 18, fontWeight: 'bold', color: 'white' }}>{5}</Text></Badge>} */}
            <View style={{ flexDirection: 'row', padding: 5 }}>
                <Entypo name="message" size={15} color="white" style={{ height: 17, width: 18 }} />
                <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, paddingLeft: 2, fontSize: 14 }}>View Comments</Text>
            </View>

        </TouchableOpacity>

    }

    OpenModal = (item) => {

        this.setState({ LeaveRequestId: item.Id, ModalStudentImage: item.StudentImage, ModalStudentName: item.StudentName, ModalClass: item.ClassName, ModalLeavesType: item.LeavesType });
        this.GetLeavesRequestComments(item.Id);
        this.setModalVisible(true);
    }

    GetLeavesRequestComments = (LeaveRequestId) => {
        this.props.OnStartLoading();
        let url = GlobalPath.API_URL + Constants.ApiController.DiaryAttendanceApi + Constants.Actions.DiaryAttendanceApi.GetLeavesRequestComments + '?LeavesRequestId=' + LeaveRequestId + '&UserId=' + this.props.SelectedUser.UserId + '&UserType=' + this.props.SelectedUser.UserType;
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.modalVisible}
                    modalTitle={<ModalTitle title={this.state.ModalStudentName} />}
                    maxHeight={Dimensions.Height - 100}
                    onHardwareBackPress={() => { this.setModalVisible(false) }}
                    width={0.9}
                    // onRequestClose={() => {
                    //     setModalVisible(false)
                    //     }}
                    //     backButtonClose={true}
                    footer={
                        <ModalFooter style={{ height: 40 }}>
                            <Right>
                                <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                    <TouchableOpacity style={{ width: '50%', paddingLeft: 20 }} onPress={() => { this.setModalVisible(false) }}  >
                                        <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </ModalFooter>
                    }
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'left',
                    })}
                // onTouchOutside={() => this.ModalOutsiderClickHandler}
                >
                    <ModalContent>
                        <View style={{ maxHeight: Dimensions.get('window').height - 200 }}>
                        <ScrollView >
                                {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}

                                   
                                        {/* <Card style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={styles.infoContainer} style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                paddingLeft: 10
                                            }}>
                                                <Image style={{ width: 90, height: 90, borderRadius: 20, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderWidth: 3 }}
                                                    source={{ uri: this.state.ModalStudentImage }} />

                                                
                                            </View>

                                            <View style={styles.bannerTop}>
                                                <Text style={styles.heading1}>{this.state.ModalStudentName}</Text>
                                                <Text style={styles.heading2}>{this.state.ModalClass}</Text>
                                                <Text style={styles.heading2}>{this.state.ModalLeavesType}</Text>
                                            </View>
                                        </Card> */}
                                        

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
                                                            <Text style={{ color: '#fff', fontSize: 12, alignSelf: 'flex-end', }}> {moment(item.dateTimeStr).format('DD-MM-YYYY hh:mm A')} </Text>
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
                                            {this.props.SelectedUser.UserType != Constants.UserType.Teacher && <View style={styles.messageInputView}>
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
                                            </View>}
                                        </View>
                                        
                                  
                                {/* </TouchableWithoutFeedback> */}




                            </ScrollView>
                        </View>
                    </ModalContent>
                </Modal>
                <FlatList
                    data={this.props.LeavesRequestList}
                    keyExtractor={(item) => {
                        return item.Id;
                    }}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    // onRefresh={() => this.onRefresh()}
                    // refreshing={this.state.refreshing}
                    renderItem={(post, index) => {
                        const item = post.item;

                        let imageOrDates = <View style={styles.infoContainer} style={{
                            width: 75, height: 75, borderRadius: 50, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View style={styles.innerContainerFirstColumn} >
                                <Text style={{ ...styles.contactIcon, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }}>
                                    {item.Day}
                                </Text>
                            </View>
                            <View style={styles.innerContainerFirstColumn}>
                                <Text style={{ ...styles.contactIcon, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }}>
                                    {item.Month}
                                </Text>

                            </View>
                        </View>

                        let OtherData = <View style={styles.infoContainer}>
                            <View style={styles.innerContaineSecondColumn}>
                                <Text style={styles.infoMainText}>
                                    {item.LeavesType}
                                </Text>
                            </View>
                            <View style={{ ...styles.innerContaineSecondColumn }}>
                                <Text style={styles.infoSubText}>{item.Reason}</Text>
                            </View>
                            <View style={{ width: 150, marginLeft: 15 }}>
                                {this.GetViewCommentsButton(item)}
                            </View>
                        </View>



                        if (this.props.SelectedUser.UserType === Constants.UserType.Teacher || this.props.SelectedUser.UserType === Constants.UserType.Admin) {
                            imageOrDates =
                                <View style={styles.infoContainer} style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingLeft: 10
                                }}>
                                    <Image style={{ width: 90, height: 90, borderRadius: 20, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderWidth: 3 }}
                                        source={{ uri: item.StudentImage }} />

                                    {/* <View style={{ paddingTop:8 }}><Text>View Comments</Text></View> */}
                                </View>

                            OtherData = <View style={{ ...styles.infoContainer }}>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoMainText}>
                                        {item.StudentName}
                                    </Text>
                                </View>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.classStyle}>Class: {item.ClassName}</Text>
                                </View>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoSubText}>{item.Day} {item.Month}</Text>

                                </View>
                                <View style={{ ...styles.innerContaineSecondColumn, flex: 1, flexDirection: 'row', alignContent: 'space-between' }}>
                                    <View style={{ width: 100 }}>
                                        <Text style={{ ...styles.infoSubText }}>{item.LeavesType}</Text>
                                    </View>
                                    <View >
                                        {this.GetViewCommentsButton(item)}
                                    </View>
                                </View>
                                <View style={styles.innerContaineSecondColumn}>
                                    <Text style={styles.infoSubText}>{item.Reason}</Text>
                                </View>

                            </View>
                        }

                        return (
                            // <TouchableOpacity
                            //   onPress={() => {
                            //     this.props.navigation.navigate("AddLeaves");
                            //   }}
                            // >
                            <Card style={styles.listItem}>
                                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                                {imageOrDates}
                                {OtherData}



                            </Card>
                            // </TouchableOpacity>
                        );
                    }}

                />
                {plusButtonShowForParents(this.props.SelectedUser, this.props.navigation, Constants.SubRoute.AddLeaves)}
                {/* <TouchableOpacity
                    style={styles.floatButton}
                    onPress={() => {
                        this.props.navigation.navigate("AddLeaves");
                    }}
                >
                    <Entypo name="plus" size={30} color={Constants.Colors.yellowColor} />
                </TouchableOpacity> */}


            </View>
            //   <View style={styles.MainContainer}>

            //     <Text style={styles.text}>Attendance</Text>
            // <Text style={styles.text}>{this.props.LeavesRequestList.length}</Text>
            //   </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#E6E6E6"

    },
    separator: {
        marginTop: 7,
    },
    listItem: {
        flexDirection: "row",
        // padding: 12,
        paddingTop: 8,
        paddingBottom: 8,
        marginLeft: 6,
        marginRight: 6,
        borderRadius: 12,
        // backgroundColor: 'green'

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 4,
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
        flex: 1,
        flexDirection: "column",
        // backgroundColor: 'red'
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
    classStyle: {
        fontSize: 15,
        color: Constants.Colors.cardBlackColor,
        fontWeight: '600',
        marginTop: 4,
        paddingLeft: 10,
        marginBottom: 2
    },
    innerContainerFirstColumn: {
        justifyContent: "center",
        alignItems: "center"
    },
    innerContaineSecondColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 10,
        marginRight: 10,
    },
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

});

const mapStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        LeavesRequestList: state.reducerAttendance.LeavesRequestList
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetLeavesRequest: (StdId, ClassId) => dispatch(getLeavesRequest(StdId, ClassId)),
        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AttendanceParent);