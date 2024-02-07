import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, Clipboard, YellowBox, Dimensions, StatusBar, Picker, FlatList,Alert } from 'react-native';
import Constants from './../../utils/Constants';
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import { Container, Form, Button, Item, Input, Label, Radio, Left, List, ListItem, DatePicker } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalPath from './../../utils/GlobalPath';
import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';
import { startLoading, stopLoading } from './../../store/actions/index';
import axios from 'axios';
class UploadFeePaymentReceipt extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("FeePayment")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    constructor(props) {
        super(props);
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        this.state = {
            Description: '',
            lstAccountInfo: [],

        }
    }
    checkAllPermissions = async () => {
        try {
            await PermissionsAndroid.requestMultiple
            ([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]);
            if ((await PermissionsAndroid.check('android.permission.CAMERA')) &&
                (await PermissionsAndroid.check('android.permission.CAMERA')) &&
                (await PermissionsAndroid.check('android.permission.CAMERA'))) {
                console.log('You can use the camera');
                return true;
            } else {
                console.log('all permissions denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
        }
    };
    componentDidMount() {

        // alert(JSON.stringify(this.props.FeePaymentInfo));
        this.setState({ lstAccountInfo: this.props.FeePaymentInfo.Info.lstAccounInfo });
    }

    setHeaderColor() {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
    }

    setClipboardAccountNo(AccountNo) {
        Clipboard.setString(AccountNo);
        // alert(AccountNo);
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            // maxWidth: 500,
            // maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
        };

        if (Platform.OS === Constants.Platform.android) {
            this.checkAllPermissions();
            ImagePicker.showImagePicker(options, response => {
                if (response.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let source = { uri: response.uri };
                    this.setState({
                        imageSource: source,
                        FileName: response.fileName === null ? 'iPhoneFile' + response.fileSize : response.fileName,
                        ImageData: response.data
                    });
                }
            });
        }
        else {
            ImagePicker.launchImageLibrary(options, response => {


                if (response.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let source = { uri: response.uri };
                    var getFilename = source.uri.split("/");
                    var fileName = getFilename[getFilename.length - 1];
                    this.setState({
                        imageSource: source,
                        FileName: response.fileName === null ? fileName : response.fileName,
                        ImageData: response.data
                    });
                }
            });
        }
    }

    onButtonOkPress = () => {
        this.props.navigation.navigate('FeePayment');
    }

    SubmitReceipt = () => {
        if (this.state.imageSource === undefined || this.state.imageSource === '') {
            alert('Please upload receipt')
        }
        else {
            this.props.OnStartLoading();
            let url = GlobalPath.API_URL + Constants.ApiController.FeeApi + Constants.Actions.FeeApi.SaveFileFeeReceipt;
            var formData = new FormData();
            var file = this.state.ImageData;
            formData.append("image", file);
            RNFetchBlob.fetch('POST', url, {
                // Authorization: "Bearer access-token",
                // otherHeader: "foo",
                'Content-Type': 'multipart/form-data',
            }, [
                { name: 'image', filename: this.state.FileName, type: 'image/png', data: this.state.ImageData },

            ]).then((resp) => {

                let objInfo = this.props.FeePaymentInfo.Info.objFeePaymentInfo;
                let PaymentInfo = {
                    Id: objInfo.Id,
                    InvoiceId: objInfo.InvoiceId,
                    StdId: this.props.SelectedUser.Id,
                    FilePath: resp.data,
                    CommentsUser: this.state.Description
                }

                let url = GlobalPath.API_URL + Constants.ApiController.FeeApi + Constants.Actions.FeeApi.SaveFeeReceipt;


                // axios.post(url,{data : LeaveRequest})
                axios({ method: 'post', url: url, data: PaymentInfo })
                    .then((response) => {
                        console.log(response.data);
                        this.props.OnStopLoading();
                        if (response.data.Message === Constants.ApiResponse.Success) {

                            Alert.alert(
                                'Success',
                                objInfo.FeePaymentReceiptMessage,
                                [
                                    // { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                                    { text: 'Ok', onPress: this.onButtonOkPress },
                                ],
                                { cancelable: false }
                            )

                        }

                    }).catch((err) => {
                        this.props.OnStopLoading();
                        alert(err);
                    })
            }).catch((err) => {
                this.props.OnStopLoading();
                alert(err);
            })
        }
    }

    render() {

        let AccountInfo = []

        return (
            <View style={styles.MainContainer}>
                <NavigationEvents onDidFocus={() => this.setHeaderColor()} />
                <ScrollView >



                    <FlatList style={styles.list}
                        data={this.props.FeePaymentInfo.Info.lstAccounInfo}
                        initialNumToRender={5}
                        showsHorizontalScrollIndicator={false}
                        // onRefresh={this.onRefresh}
                        // refreshing={this.state.isRefreshing}

                        keyExtractor={(item) => {
                            return item.Id;
                        }}
                        ItemSeparatorComponent={() => {
                            return (
                                <View style={styles.separator} />
                            )
                        }}
                        renderItem={(post, index) => {
                            const item = post.item;
                            return (
                                <Card style={styles.listItem}>
                                    <View style={styles.modalColumn}>
                                        <View style={styles.modalRow}>
                                            <Text style={styles.rowTextModal}>Bank Name: </Text>
                                            <Text style={styles.rowTextModal}>{item.BankName}</Text>
                                        </View>
                                        <View style={styles.modalRow}>
                                            <Text style={styles.rowTextModal}>Branch Name: </Text>
                                            <Text style={styles.rowTextModal}>{item.BranchName}</Text>
                                        </View>
                                        <View style={styles.modalRow}>
                                            <Text style={styles.rowTextModal}>Account Title: </Text>
                                            <Text style={styles.rowTextModal}>{item.AccountTitle}</Text>
                                        </View>
                                        <View style={styles.modalRow}>
                                            <Text style={styles.rowTextModal}>Account No: </Text>
                                            <Text style={styles.rowTextModal}>{item.AccountNo}</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center' }}>
                                            <TouchableOpacity style={styles.followButton} onPress={() => this.setClipboardAccountNo(item.AccountNo)}>
                                                <Icon name="md-copy" size={16} color={Constants.Colors.whiteColor} />
                                                <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>Copy Account no.</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                </Card>

                            )

                        }} />




                    {/* <Card style={styles.listItem}>
                        <View style={styles.modalColumn}>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Bank Name: </Text>
                                <Text style={styles.rowTextModal}>ALLIED BANK LIMITED</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Branch Name</Text>
                                <Text style={styles.rowTextModal}>LIBERTY MARKET LHR.</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Account Title: </Text>
                                <Text style={styles.rowTextModal}>C/o NCUK LAHORE (Pvt.) LTD</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Account No: </Text>
                                <Text style={styles.rowTextModal}>02150010063280910010</Text>

                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.followButton} onPress={() => this.setClipboardAccountNo('02150010063280910010')}>
                                    <Icon name="md-copy" size={16} color={Constants.Colors.whiteColor} />
                                    <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>Copy account no</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </Card>
                    <Card style={styles.listItem}>
                        <View style={styles.modalColumn}>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Bank Name: </Text>
                                <Text style={styles.rowTextModal}>ALLIED BANK LIMITED</Text>
                            </View>





                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Branch Name</Text>
                                <Text style={styles.rowTextModal}>LIBERTY MARKET LHR.</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Account Title: </Text>
                                <Text style={styles.rowTextModal}>C/o NCUK LAHORE (Pvt.) LTD</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.rowTextModal}>Account No: </Text>
                                <Text style={styles.rowTextModal}>02150010063280910010</Text>

                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.followButton} onPress={() => this.setClipboardAccountNo('02150010063280910010')}>
                                    <Icon name="md-copy" size={16} color={Constants.Colors.whiteColor} />
                                    <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>Copy account no</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </Card> */}

                    <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>



                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                            <EvilIcons name='image' size={30} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                        </View>
                        <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 0 }}>Upload Receipt</Label>
                    </View>


                    <Item style={styles.inputItem} >
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ borderWidth: 0, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 50, marginLeft: 10, width: '90%' }}>Upload Receipt</Text>
                                <View style={{ top: 3, right: 25 }}>
                                    <Image style={{ width: 25, height: 25 }} source={this.state.imageSource} />
                                </View>
                            </View>

                        </TouchableOpacity>
                    </Item>
                    <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>




                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20, paddingBottom: 10 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                            <MaterialCommunityIcons name='text-subject' size={24} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                        </View>
                        <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 6 }}>Remarks (Optional)</Label>
                    </View>


                    <Item style={styles.inputItem} >
                        <Input
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="default"
                            placeholder="Remarks (Optional)"
                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                            onChangeText={Description => this.setState({ Description })}
                            value={this.state.Description}
                            multiline={true}

                        />
                    </Item>
                    <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15, marginBottom:20 }}>
                        <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                            onPress={this.SubmitReceipt}
                        >
                            <Icon name='md-send' style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }} />
                            <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>Submit</Text>
                        </Button>

                    </View>
                    <View style={{ height:300}}>

                    </View>
                    {/* <View>
                                <Text style={{ fontSize: 18, justifyContent: 'center' }}>Attach payment proof</Text>

                            </View>
                            <View>
                                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ borderWidth: 0, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 50, marginLeft: 10, width: '90%' }}>Select Image</Text>
                                        <View style={{ top: 3, right: 25 }}>
                                            <Image style={{ width: 25, height: 25 }} source={this.state.imageSource} />
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, justifyContent: 'center' }}>Comments</Text>

                            </View>
                            <View>
                           <Item style={styles.inputItem} >
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Enter Description"
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onChangeText={Description => this.setState({ Description })}
                                    value={this.state.Description}
                                    multiline={true}
                                   
                                />
                            </Item>
                           </View> */}

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {

        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 0 : 0,
        alignItems: 'center',
        justifyContent: 'center',

    },
    listItem: {
        // flexDirection: "row",
        // padding: 2
        borderRadius: 8,
        marginLeft: 7,
        marginRight: 7
    },
    followButton: {
        margin: 5,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: "#00BFFF",
        padding: 5,
        width: 200
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        paddingLeft: 10,
    }, row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6',

    },
    rowText: {
        flex: 1,
        justifyContent: 'center',
        fontSize: 16

    },

    rowTextModal: {
        justifyContent: 'center',
        fontSize: 16

    },

    modalRow: {
        flexDirection: 'row',

        marginTop: 10,
        // borderBottomWidth: 1,
        justifyContent: 'center'

    },
    separator: {
        height: 1,
        marginTop: 10,

    },
});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        FeePaymentInfo: state.reducerFeePayment.FeePaymentInfo
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        OnStartLoading: () => dispatch(startLoading()),
        OnStopLoading: () => dispatch(stopLoading()),
    };
}



export default connect(mapStateToProps, mapsDispatchToProps)(UploadFeePaymentReceipt);
