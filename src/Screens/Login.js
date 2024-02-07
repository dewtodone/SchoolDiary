import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    Linking, TouchableWithoutFeedback, Keyboard, TouchableHighlight, Platform
} from 'react-native';

import bgImage from '../assets/images/login-backg.png';
import axios from 'axios';


import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import { Right, Left, Form, Container, Input, Item, Button, Label } from 'native-base';
import { connect } from 'react-redux';
import { login, forgotPassword, setForgotPassword, setOTPModal } from '../store/actions/index';

import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInfo, setUserInfo } from '../components/General/LoginUserInfo';
import ProgressBar from '../components/General/ProgressBar';

import Constants from '../utils/Constants';

// import { Dimensions } from 'Dimensions';

height = Dimensions.get('window').height;
width = Dimensions.get('window').width;



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            username: '',
            password: '',
            MobileNo: '',
            OTPText: '',
            EyeIcon: 'eye-off',
            IsPasswordIcon: true,

        }
    }

    componentDidMount() {
        // this.openProgress();

        // this.getUserInfo();
        //console.log(Platform.OS);
        //console.log(Platform.OS.toString() === 'ios' ?   ' getting ios' :'getting info android' );
        getUserInfo().then((response) => {
            //this callback is executed when your Promise is resolved
            try {
                var UserInfo = response.UserInfo;
                let PlayerId = response.PlayerId;
                // alert(UserInfo.Username);
                // alert(UserInfo.Password);
                if (UserInfo != undefined) {
                    this.setState({
                        username: UserInfo.Username,
                        password: UserInfo.Password,
                    });
                }

                this.setState({
                    PlayerId: PlayerId
                });

                if (UserInfo != null) {
                    this.props.OnLogin(UserInfo.Username, UserInfo.Password, PlayerId, this.props.navigation);
                }
                else {
                    this.props.OnLogin('', '', PlayerId, this.props.navigation);
                }
            }
            catch { }
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            //console.log('Promise is rejected with error: ' + error);
        });
        // let UserInfo = getUserInfo();
        // // alert(UserInfo.username);
        // if (UserInfo.username != undefined){
        //     
        // }        
    }





    // openProgress = () => {
    //     this.showLoading();

    //     setTimeout(
    //         () => {
    //             this.hideLoading();
    //         },
    //         4000,
    //     );
    // }

    // setUserInfo = async () => {



    //     var UserInfo = {
    //         username: this.state.username,
    //         password: this.state.password
    //     };
    //     await AsyncStorage.setItem('SchoolDairyUserInfo1', JSON.stringify(UserInfo))
    //         .then(() => {

    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    // showLoading = () => {
    //     //this.setState({ showProgress: true });
    // }

    // hideLoading = () => {
    //     //this.setState({ showProgress: false });
    // }

    SubmitLogin = (username, password) => {

        this.props.OnLogin(username, password, this.state.PlayerId, this.props.navigation);
    }


    onClickListener = (btn) => {
        if (btn === 'login') {
            if (this.state.username.trim() === '' || this.state.password.trim() === '') {
                alert('Username and password required!!!');
            }
            else {
                this.SubmitLogin(this.state.username, this.state.password);
            }
        }
        else if (btn === 'forgot') {

            this.props.OnSetForgotPassword(true);
            // this.props.OnSetOTPModal(false)
        }
        // this.props.OnLogin(this.state.username, this.state.password);


        // this.props.navigation.navigate("App");



        // setTimeout(
        //     () => {
        //         this.showLoading();                
        //     },
        //     4000,
        // );
        // if (this.state.username == "admin" && this.state.password == "123")
        // {            
        //     this.setUserInfo();
        //     this.hideLoading();
        //     this.props.navigation.navigate("App");
        // }
        // else
        // {
        //     setTimeout(
        //         () => {
        //             this.hideLoading();
        //             alert('Invalid Username OR Password');
        //         },
        //         4000,
        //     );
        // }








        //     axios.post('http://192.168.43.198:80/ApiSMS/api/LoginApi/Register', {        
        //     userName: 'test',
        //     userusername: this.state.username,
        //     userPassword: this.state.password
        //   } )
        //     .then(function(response, data) {
        //       alert(response.data.Message);
        //       // alert(response.data.list[0].Name);
        //       //this.props.navigation.navigate('Dashboard');
        //   })
        //   .catch(function (error) {
        //     alert(error);
        //   });
        //     // .then(res => {
        //     //  alert(JSON.parse(res).Message)
        //     
        // })
    }

    PressOkButtonHandler = () => {
        console.log('Press');
        if (Platform.OS == 'ios') {
            Linking.openURL(this.props.AppVersionInfo.Urlios);
            // https://itunes.apple.com/app/id1515705378
            // https://apps.apple.com/app/id1515705378
            //both are correct
        }
        else {
            Linking.openURL(this.props.AppVersionInfo.UrlAndroid);
        }
        // this.props.onPressOkButtonClick();
    }

    ForgotPasswordClickHandler = () => {
        if (this.props.OTPVisible === true) {
            if (this.state.OTPText === this.props.LoginInfo.OTP.toString()) {
                let LoginInfo = this.props.LoginInfo;
                // this.setState({
                //     username: UserInfo.Username,
                //     password: UserInfo.Password
                // });

                this.props.OnSetForgotPassword(false);
                this.SubmitLogin(LoginInfo.Username, LoginInfo.Password);
            }
            else {
                alert(Constants.DisMsg.InvalidOTP);
            }
        }
        else {
            this.SendOTP();
        }

        // 
    }

    SendOTP = () => {
        var mobileNo = this.state.MobileNo;
        var initialMoibleNoDigit = mobileNo.substr(0, 3);
        if (initialMoibleNoDigit != '923' || mobileNo.length != 12) {
            alert('Please enter valid mobile number');
        }
        else {
            this.props.OnForgotPassword(mobileNo);
        }
    }




    CloseForgotPasswordModalHandler = () => {

        this.props.OnSetForgotPassword(false);
    }

    CloseOTPModalHandler = () => {
        this.props.OnSetOTPModal(false);
    }

    RensendOTPHandler = () => {
        this.SendOTP();
    }


    ChangeEyeIcon = () => {
        this.setState(prevState => ({
            IsPasswordIcon: !prevState.IsPasswordIcon,
            EyeIcon: prevState.EyeIcon === 'eye' ? 'eye-off' : 'eye'

        }))
    }

    render() {

        // let otp = <View />;

        // if (this.props.OTPModalVisible){
        //     otp = 
        // }

        return (

            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss;
                }}
            >

                <View style={styles.container}>
                    <Image style={styles.bgImage} source={require('./../assets/images/login-backg.png')} />

                    <View style={styles.btnContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputs} value={this.state.username}
                                placeholder="Username"
                                underlineColorAndroid='transparent'
                                onChangeText={(username) => this.setState({ username })} />
                            {/* <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/nolan/40/000000/email.png' }} /> */}
                            <Icon name="md-person" size={26} style={styles.inputIcon} />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputs} value={this.state.password}
                                placeholder="Password"
                                secureTextEntry={this.state.IsPasswordIcon}
                                underlineColorAndroid='transparent'
                                onChangeText={(password) => this.setState({ password })} />

                            <Icon name={'md-' + this.state.EyeIcon} size={26} style={styles.inputIcon} onPress={() => this.ChangeEyeIcon()} />


                            {/* <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/nolan/40/000000/key.png' }} /> */}
                        </View>
                    </View>

                    {/* <TouchableOpacity style={styles.btnForgotPassword} onPress={() => this.onClickListener('restore_password')}>
            <Text style={styles.btnText}>Forgot your password?</Text>
        </TouchableOpacity> */}
                    <View style={styles.btnContainer}>
                        <View style={{ width: '60%' }}>
                            <Button style={{ ...styles.buttonContainer, ...styles.loginButton, backgroundColor: Constants.Colors.headerBackColor }} onPress={() => this.onClickListener('login')}>
                                <Icon name="md-lock" size={26} style={{ color: Constants.Colors.yellowColor, paddingRight: 8 }} />
                                <Text style={styles.loginText}>Login</Text>
                            </Button>
                            {/* <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name="md-lock" size={26} style={{ color: Constants.Colors.yellowColor, paddingRight: 8 }} />
                                    <Text style={styles.loginText}>Login</Text>
                                </View>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ width: '40%' }}>
                            <TouchableHighlight underlayColor='white' style={styles.buttonContainer} onPress={() => this.onClickListener('forgot')}>
                                <Text style={{ color: Constants.Colors.headerBackColor, fontSize: 15, paddingRight: 2 }}>Forgot password?</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
            <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity> */}
                    <ProgressBar />
                    {/* APP version Modal */}
                    <Modal
                        visible={this.props.appVersionModalVisible}
                        modalTitle={<ModalTitle title={this.props.AppVersionInfo.Title} />}
                        maxHeight={Dimensions.Height - 100}
                        width={0.9}
                        footer={
                            <ModalFooter style={{ height: 40 }}>
                                <Right>
                                    <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                        <TouchableOpacity style={{ width: '50%', paddingLeft: 20 }} onPress={() => this.PressOkButtonHandler()}>
                                            <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Go To {Platform.OS === 'ios' ? 'App Store' : 'PlayStore'}</Text>
                                        </TouchableOpacity>
                                        {/* <ModalButton
                                            text="Go To PlayStore"
                                            onPress={() => this.PressOkButtonHandler()}
                                        /> */}
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
                            <View>
                                <Text>{this.props.AppVersionInfo.Message}</Text>
                            </View>
                        </ModalContent>
                    </Modal>



                    {/* Forgot Password Modal */}
                    <Modal
                        visible={this.props.forgotPasswordModalVisible}
                        modalTitle={<ModalTitle title='Forgot Credential' textStyle={{ color: Constants.Colors.headerBackColor, fontWeight: 'bold' }} />}

                        maxHeight={100}
                        width={0.9}
                        footer={
                            <ModalFooter style={{ height: 40 }}>
                                <Right>
                                    <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                        <TouchableOpacity style={{ width: '40%', paddingLeft: 20 }} onPress={() => this.CloseForgotPasswordModalHandler()}>
                                            <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Close</Text>
                                        </TouchableOpacity>
                                        {/* <ModalButton
                                            text="Close"
                                            onPress={() => this.CloseForgotPasswordModalHandler()}
                                        /> */}
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
                                        <Text style={{ fontSize: 16 }}>Please enter mobile no registered in your school (format: 923001234567)</Text>
                                        <Item style={styles.inputItem} floatingLabel>
                                            <Label style={{ color: Constants.Colors.headerBackColor }}>Mobile No</Label>
                                            <Input
                                                autoCorrect={false}
                                                autoCapitalize="none"
                                                keyboardType="decimal-pad"
                                                placeholder="e.g: 923001234567"
                                                maxLength={12}
                                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                onChangeText={(MobileNo) => this.setState({ MobileNo })}

                                            />
                                        </Item>
                                        {this.props.OTPVisible === true && <Item style={styles.inputItem} floatingLabel>
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
                                                onPress={() => this.ForgotPasswordClickHandler()}>
                                                <Icon name='md-send' style={{ color: Constants.Colors.yellowColor }} />
                                                <Text style={{ paddingLeft: 10, color: Constants.Colors.yellowColor, fontSize: 18, fontWeight: 'bold' }}> {this.props.OTPVisible === true ? 'Submit OTP' : 'Send'}</Text>
                                            </Button>
                                            {this.props.OTPVisible === true && <TouchableOpacity style={{ width: '40%', paddingLeft: 20 }} onPress={() => this.RensendOTPHandler()}>
                                                <Text style={{ fontSize: 16, color: Constants.Colors.headerBackColor }}>Resend OTP</Text>
                                            </TouchableOpacity>}
                                        </View>
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


                    {/* Enter OTP Modal*/}
                    {/* <Modal
                        visible={this.props.OTPModalVisible}
                        modalTitle={<ModalTitle title='Enter OTP' textStyle={{color: Constants.Colors.headerBackColor, fontWeight:'bold'}} />}
                        
                        maxHeight={100}
                        width={0.9}
                        footer={
                            <ModalFooter style={{ height: 40 }}>
                                <Right>
                                    <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                        <ModalButton
                                            text="Close"
                                            onPress={() => this.CloseOTPModalHandler()}
                                        />
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

                             
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        Keyboard.dismiss;
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontSize: 16 }}>Please enter OTP</Text>
                                        <Item style={styles.inputItem} floatingLabel>
                                            <Label style={{ color: Constants.Colors.headerBackColor}}>OTP</Label>
                                            <Input
                                                autoCorrect={false}
                                                autoCapitalize="none"
                                                keyboardType="decimal-pad"
                                                placeholder="e.g: 923001234567"
                                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                onChangeText={(OTP) => this.setState({OTP})}

                                            />
                                        </Item>
                                        
                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                                            <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.Colors.headerBackColor, width: '50%' }}
                                                onPress={() => this.ForgotPasswordClickHandler()}
                                            >
                                                <Icon name='md-send' style={{ color: Constants.Colors.yellowColor }} />
                                                <Text style={{ paddingLeft:10 ,color: Constants.Colors.yellowColor, fontSize: 18, fontWeight: 'bold' }}>Send</Text>
                                            </Button>

                                        </View>                                      
                                    </View>

                                </TouchableWithoutFeedback>
                               
                            </View>
                        </ModalContent>
                    </Modal> */}




                </View>

            </TouchableWithoutFeedback>

        );
    }
}

const resizeMode = 'center';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        //backgroundColor: '#DCDCDC',
    },
    inputItem: {
        margin: 10,
        borderBottomWidth: 2,
        borderBottomColor: Constants.Colors.headerBackColor,
    },

    btnContainer: {

        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    btnItem: {
        width: '50%' // is 50% of container width
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 300,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginLeft: '5%',

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // elevation: 2,
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
        fontSize: 16,
    },
    inputIcon: {
        paddingRight: 15,
        color: Constants.Colors.headerBackColor
    },
    buttonContainer: {
        height: 45,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: '7%',

        // width: 300,
        borderRadius: 30,
        backgroundColor: 'transparent'
    },
    btnForgotPassword: {
        height: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
        width: 300,
        backgroundColor: 'transparent'
    },
    loginButton: {
        //"#00b5ec",

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        // elevation: 9,
    },
    loginText: {
        color: Constants.Colors.yellowColor,
        fontSize: 18,
        fontWeight: 'bold'
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',

        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    btnText: {
        color: "white",
        fontWeight: 'bold'
    }
});


const mapStateToProp = state => {
    return {
        appVersionModalVisible: state.reducerLogin.appVersionModalVisible,
        AppVersionInfo: state.reducerLogin.AppVersionInfo,
        forgotPasswordModalVisible: state.reducerLogin.forgotPasswordModalVisible,
        OTPVisible: state.reducerLogin.OTPVisible,
        LoginInfo: state.reducerLogin.LoginInfo,
    };
};


const mapsDispatchToProps = dispatch => {
    return {
        OnLogin: (username, password, PlayerId, propsNavigate) => dispatch(login(username, password, PlayerId, propsNavigate)),
        OnForgotPassword: (MobileNo) => dispatch(forgotPassword(MobileNo)),
        OnSetForgotPassword: (forgotPasswordModalVisible) => dispatch(setForgotPassword(forgotPasswordModalVisible)),
        OnSetOTPModal: (OTPModalVisible) => dispatch(setOTPModal(OTPModalVisible)),
    };
}

export default connect(mapStateToProp, mapsDispatchToProps)(Login);
// export default Login;