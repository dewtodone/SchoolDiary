import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard, FlatList, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import { Container, Form, Item, Input, Label, Button, Icon, Radio, Left, Right, List, ListItem, DatePicker, CheckBox } from 'native-base';

import Constants from '../../utils/Constants';
import GLOABAL_PATH from '../../utils/GlobalPath';
import { saveLeaveRequest, getStudents, saveActivity, startLoading, stopLoading, getActivities } from '../../store/actions/index';
import { connect } from 'react-redux';
import axios from 'axios';
import { getStudentOrClassList, getClassId, getStdId } from '../../utils/UserTypeFunc';
import ProgressBar from '../../components/General/ProgressBar';
import RNPickerSelect from 'react-native-picker-select';
import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import ImagePicker from 'react-native-image-picker';

import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';
import { ThemeColors } from 'react-navigation';

height = Dimensions.get('window').height;
width = Dimensions.get('window').width;
const sendType = [{
    label: Constants.SendActivityType.Class,
    value: Constants.SendActivityType.Class
},
{
    label: Constants.SendActivityType.Student,
    value: Constants.SendActivityType.Student
}];
class ActivityComponent extends React.Component {





    constructor(props) {
        super(props);

        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        this.state = {
            Title: '',
            Description: '',
            StudentOrClassList: [],
            modalVisible: false,
            modalTitle: 'Select Classes',
            SendTo: 'Class',
            imageSource: '',
            SelectedCLassOrStdList: [],
            txtStudentOrClass: 'Select Classes',
            FileName: '',
            ImageData: '',
            IsShowClassDropdDownForSearch: false,
            ShowClassDropdDownForSearchList: [],
            ShowClassDropdDownForSearchValue: 0
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

    setStateToDefault = () => {
        this.setState({
            Title: '',
            Description: '',

            modalVisible: false,
            modalTitle: 'Select Classes',
            SendTo: 'Class',
            imageSource: '',

            txtStudentOrClass: 'Select Classes',
            FileName: '',
            ImageData: ''
        });
        this.BindClass();
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
    componentDidMount() {
        this.setStateToDefault();
        this.BindClass();

    }

    BindClass = () => {
debugger;
        let lst = [];
        this.props.StudentOrClassList.forEach(function (entry) {
            if (entry.ClassName != "All Classes"){
            var lstClass = {};
            lstClass['Id'] = entry.ClassId;
            lstClass['Name'] = entry.ClassName;
            lstClass['checked'] = false;
            lst.push(lstClass);
            }
        });
        this.setState({ StudentOrClassList: lst });
    }

    BindClassListDropdDownForSearch = () => {
        let lst = [];
        var lstClass = {};
        lstClass['value'] = 0;
        lstClass['label'] = 'Select Class';

        lst.push(lstClass);
        this.props.StudentOrClassList.forEach(function (entry) {
            var lstClass = {};
            lstClass['value'] = entry.ClassId;
            lstClass['label'] = entry.ClassName;

            lst.push(lstClass);
        });
        return lst;
    }

    ShowClassDropdDownForSearchChangedHandler = (val) => {
        let lstClassId = [];
        var that = this;
        lstClassId.push(val);
        this.GetStudentsClass(lstClassId);

        that.setState({ ShowClassDropdDownForSearchValue: val, txtStudentOrClass: this.state.SendTo === 'Student' ? ' Select Students' : 'Select Classes', modalTitle: 'Select Students' });
    }
    StudentOrClassChangedHandler = (val) => {
        this.setState({ SendTo: val, txtStudentOrClass: val === Constants.SendActivityType.Student ? ' Select Students' : 'Select Classes', IsShowClassDropdDownForSearch: false, modalTitle: 'Select Classes' });
        let ShowClassDropdDownForSearchList = this.BindClassListDropdDownForSearch();
        if (val === Constants.SendActivityType.Student) {

            let ClassCount = this.props.StudentOrClassList.length;
            if (ClassCount === 1) {
                var that = this;
                //this.props.onStartLoading();
                let lstClassId = [];
                this.props.StudentOrClassList.forEach(function (entry) {
                    lstClassId.push(entry.ClassId);
                });
                this.GetStudentsClass(lstClassId);
                that.setState({ modalTitle: 'Select Students', IsShowClassDropdDownForSearch: true, ShowClassDropdDownForSearchList });

            }
            else {


                this.setState({ IsShowClassDropdDownForSearch: true, ShowClassDropdDownForSearchList, modalTitle: 'Select Students', StudentOrClassList: [] });
            }
        }
        else {
            this.BindClass();
        }
    };


    GetStudentsClass = (lstClassId) => {
        let url = GLOABAL_PATH.API_URL + 'ActivityApi/GetStudents?ClassIds=' + lstClassId;
        axios.get(url)
            .then((response) => {
                let StudentList = response.data.StudentList;

                let lstStudents = [];
                StudentList.forEach(function (entry) {
                   
                    var lstClass = {};
                    lstClass['Id'] = entry.Id;
                    lstClass['Name'] = entry.Name;
                    lstClass['checked'] = false;
                    lstStudents.push(lstClass);
                    
                });
                this.setState({ StudentOrClassList: lstStudents });
            })
            .catch(function (error) {
                //this.props.onStopLoading();
            });
    }

    SaveAtivityHandler = () => {
        // console.log(this.props.Navigation);
        this.props.onStartLoading();
        let Ids = ''
        Ids = (this.state.SelectedCLassOrStdList.map(function (item) {
            return item.Id
        })).join(',');

        if (this.state.Title === '') {
            this.props.onStopLoading();
            alert('Please Enter Title');
        }
        else if (Ids === '') {
            this.props.onStopLoading();
            alert('Please Select Students Or Classes');
        }
        else {
            if (this.state.ImageData !== '') {
                let url = GLOABAL_PATH.API_URL + Constants.ApiController.ActivityApi + Constants.ActivityApiFunc.SaveFile;
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
                    this.SaveActivity(resp.data, Ids);

                }).catch((err) => {
                    this.props.onStopLoading();
                    alert(err);
                })
            }
            else {
                this.SaveActivity('', Ids);
            }
        }


    };

    SaveActivity = (imagePath, Ids) => {
        let propsNavigate = this.props.Navigation;
        //let imagePath = resp.data;
        console.log(imagePath);
        let ClassIds = '';
        let StudentId = '';


        if (this.state.SendTo === Constants.SendActivityType.Student) {
            StudentId = Ids;
        }
        else {
            ClassIds = Ids;
        }
        let SelectedClassId = getClassId(this.props.SelectedUser);
        let StdId = getStdId(this.props.SelectedUser);

        let Activity = {
            Title: this.state.Title,
            ImageUrl: imagePath,
            FeedType: this.props.Type,
            FeedDescription: this.state.Description,
            ClassId: ClassIds,
            StudentId: StudentId,
            UserId: this.props.SelectedUser.Id
        }

        let url = GLOABAL_PATH.API_URL + Constants.ApiController.ActivityApi + Constants.ActivityApiFunc.SaveActivity;


        // axios.post(url,{data : LeaveRequest})
        axios({ method: 'post', url: url, data: Activity })
            .then((response) => {
                console.log(response.data);
                this.props.onStopLoading();
                if (response.data.Message === Constants.ApiResponse.Success) {
                    // dispatch(getLeavesRequest(LeaveRequest.StudentId, LeaveRequest.ClassId));                   
                    // dispatch(stopLoading());
                    //    this.setState({
                    //     Title : '',
                    //     imageSource : '',
                    //     Description : '',

                    //    });
                    this.setStateToDefault();
                    this.props.onGetActivities(StdId, SelectedClassId, this.props.SelectedUser.UserType, this.props.Type, GLOABAL_PATH.ACTIVITY_IMAGES);

                    alert('Saved Successfully');

                    propsNavigate.navigation.navigate(Activity.FeedType);
                    // this.props.Navigation.navigate('Attendance');
                }
                else {
                    // dispatch(stopLoading());
                    alert(response.data.Message);
                }

            })
            .catch(function (error) {
                console.log(error);
                this.props.onStopLoading();
                alert('Something Wrong!!. Please Again Later');
                // dispatch(stopLoading());
            });

    }



    onCheckedChange = async (index) => {
        Keyboard.dismiss;
        let items = this.state.StudentOrClassList;
        items[index].checked = items[index].checked ? !items[index].checked : true
        this.setState({ StudentOrClassList: items })
    };



    onPressOkButton = async () => {
        let selectedTypeList = this.state.StudentOrClassList.filter(function (item) {
            return item.checked === true;
        });

        this.setState({
            modalVisible: false, SelectedCLassOrStdList: selectedTypeList, txtStudentOrClass: (selectedTypeList.map(function (item) {
                return item.Name
            })).join(',')
        });
    };

    render() {
        // let lst = getStudentOrClassList(this.props.StudentOrClassList);
        return (
            <Container>
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss;
                    }}
                >
                    <ScrollView style={styles.container} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>

                        <Form>
                            {/* <Item style={styles.inputItem} floatingLabel> */}

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <MaterialIcons name='border-color' size={24} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 6 }}>Title</Label>
                            </View>


                            <Item style={styles.inputItem} >
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Enter Title"
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onChangeText={Title => this.setState({ Title })}
                                    value={this.state.Title}
                                />
                            </Item>
                            <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>



                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <EvilIcons name='image' size={30} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 0 }}>Image</Label>
                            </View>


                            <Item style={styles.inputItem} >
                                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ borderWidth: 0, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 50, marginLeft: 10, width: '90%' }}>Select Image</Text>
                                        <View style={{ top: 3, right: 25 }}>
                                            <Image style={{ width: 25, height: 25 }} source={this.state.imageSource} />
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </Item>
                            <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>




                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <MaterialCommunityIcons name='text-subject' size={24} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 6 }}>Description</Label>
                            </View>


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
                            <Text style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}></Text>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <Icon name='ios-people' size={24} style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>Send</Label>
                            </View>

                            <Item style={styles.inputItem} >
                                <View style={{ width: '100%' }}>
                                    <RNPickerSelect
                                        placeholder={{}}
                                        items={sendType}
                                        onValueChange={this.StudentOrClassChangedHandler}
                                        style={{

                                            iconContainer: {
                                                top: -6,
                                                right: 12
                                            },
                                            inputIOS: {
                                                // fontSize: 16,
                                                // paddingVertical: 12,
                                                // paddingHorizontal: 10,
                                                // borderWidth: 1,
                                                // borderColor: Constants.Colors.yellowColor,
                                                // borderRadius: 4,
                                                // color: Constants.Colors.yellowColor,
                                                // marginLeft: 10,
                                                // marginRight: 10,
                                                // paddingRight: 30, // to ensure the text is never behind the icon
                                                fontSize: 15,
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                borderWidth: 2,
                                                borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
                                                borderRadius: 8,
                                                color: '#333',
                                                paddingRight: 30, // to ensure the text is never behind the icon
                                                width: '90%'
                                            },
                                            inputAndroid: {
                                                fontSize: 15,
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                borderWidth: 2,
                                                borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
                                                borderRadius: 8,
                                                color: '#333',
                                                paddingRight: 30, // to ensure the text is never behind the icon
                                                width: '90%'

                                            },
                                        }}
                                        value={this.state.SendTo}
                                        useNativeAndroidPickerStyle={false}
                                        textInputProps={{ underlineColor: 'yellow' }}
                                        Icon={() => {
                                            return <Icon name="md-arrow-dropdown" style={{ paddingTop: 16, paddingRight: 30 }} size={30} />
                                        }}
                                    />
                                </View>
                            </Item>

                            {this.state.IsShowClassDropdDownForSearch && <Item style={styles.inputItem} >
                                <View style={{ width: '100%' }}>
                                    <RNPickerSelect
                                        placeholder={{}}
                                        items={this.state.ShowClassDropdDownForSearchList}
                                        onValueChange={this.ShowClassDropdDownForSearchChangedHandler}
                                        style={{

                                            iconContainer: {
                                                top: -6,
                                                right: 12
                                            },
                                            inputIOS: {
                                                // fontSize: 16,
                                                // paddingVertical: 12,
                                                // paddingHorizontal: 10,
                                                // borderWidth: 1,
                                                // borderColor: Constants.Colors.yellowColor,
                                                // borderRadius: 4,
                                                // color: Constants.Colors.yellowColor,
                                                // marginLeft: 10,
                                                // marginRight: 10,
                                                // paddingRight: 30, // to ensure the text is never behind the icon
                                                fontSize: 15,
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                borderWidth: 2,
                                                borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
                                                borderRadius: 8,
                                                color: '#333',
                                                paddingRight: 30, // to ensure the text is never behind the icon
                                                width: '90%'
                                            },
                                            inputAndroid: {
                                                fontSize: 15,
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                borderWidth: 2,
                                                borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
                                                borderRadius: 8,
                                                color: '#333',
                                                paddingRight: 30, // to ensure the text is never behind the icon
                                                width: '90%'

                                            },
                                        }}
                                        value={this.state.ShowClassDropdDownForSearchValue}
                                        useNativeAndroidPickerStyle={false}
                                        textInputProps={{ underlineColor: 'yellow' }}
                                        Icon={() => {
                                            return <Icon name="md-arrow-dropdown" style={{ paddingTop: 16, paddingRight: 30 }} size={30} />
                                        }}
                                    />
                                </View>
                            </Item>
                            }

                            <Item style={styles.inputItem} >

                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ borderWidth: 2, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 'auto', marginLeft: 10, width: '90%' }}>{this.state.txtStudentOrClass} </Text>
                                            <View style={{ top: 3, right: 25 }}>
                                                <Icon style={{}} name='md-arrow-dropdown'></Icon>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                    <Modal
                                        visible={this.state.modalVisible}
                                        modalTitle={<ModalTitle title={this.state.modalTitle} />}
                                        maxHeight={100}

                                        width={0.9}
                                        footer={
                                            <ModalFooter style={{ height: 60 }}>
                                                <Right>
                                                    <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                                        <ModalButton
                                                            text="    OK     "
                                                            onPress={this.onPressOkButton}
                                                        />
                                                    </View>
                                                </Right>


                                            </ModalFooter>
                                        }
                                        modalAnimation={new SlideAnimation({
                                            slideFrom: 'left',
                                        })}
                                        onTouchOutside={() => {
                                            this.setState({ modalVisible: false });
                                        }}
                                    >
                                        <ModalContent style={{ height: height - 200 }}>
                                            <ScrollView  >
                                                <FlatList
                                                    keyExtractor={this.keyExtractor}
                                                    data={this.state.StudentOrClassList}
                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <ListItem >
                                                                <Left>
                                                                    <TouchableOpacity onPress={() => this.onCheckedChange(index)

                                                                        //     () => {
                                                                        //     let items = this.state.StudentOrClassList;
                                                                        //     items[index].checked = items[index].checked ? !items[index].checked : true
                                                                        //     this.setState({ StudentOrClassList: items })
                                                                        // }
                                                                    }>
                                                                        <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
                                                                            <CheckBox
                                                                                checked={item.checked} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}
                                                                                onPress={() =>
                                                                                    this.onCheckedChange(index)
                                                                                }
                                                                            />
                                                                            <Text style={{ paddingLeft: 20 }}>{item.Name}</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </Left>
                                                            </ListItem>
                                                        )
                                                    }
                                                    }
                                                    extraData={this.state}
                                                />

                                            </ScrollView>
                                        </ModalContent>
                                    </Modal>
                                </View>

                            </Item>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                                <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                                    onPress={this.SaveAtivityHandler}
                                >
                                    <Icon name='md-send' style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }} />
                                    <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold' }}>Send</Text>
                                </Button>

                            </View>
                        </Form>
                        <ProgressBar />
                    </ScrollView>
                </TouchableWithoutFeedback>

            </Container>

        );
    }
};

// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//         // fontSize: 16,
//         // paddingVertical: 12,
//         // paddingHorizontal: 10,
//         // borderWidth: 1,
//         // borderColor: Constants.Colors.yellowColor,
//         // borderRadius: 4,
//         // color: Constants.Colors.yellowColor,
//         // marginLeft: 10,
//         // marginRight: 10,
//         // paddingRight: 30, // to ensure the text is never behind the icon
//         fontSize: 15,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginLeft: 10,
//         marginRight: 10,
//         borderWidth: 2,
//         borderColor: Constants.Colors.headerBackColor,
//         borderRadius: 8,
//         color: '#333',
//         paddingRight: 30, // to ensure the text is never behind the icon
//         width: '90%'
//     },
//     inputAndroid: {
//         fontSize: 15,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginLeft: 10,
//         marginRight: 10,
//         borderWidth: 2,
//         borderColor: Constants.Colors.headerBackColor,
//         borderRadius: 8,
//         color: '#333',
//         paddingRight: 30, // to ensure the text is never behind the icon
//         width: '90%'

//     },
// });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 10,
        height: 0
    },
    inputItem: {
        margin: 10
    },
    button: {
        // backgroundColor: Constants.Colors.headerBackColor,
        marginTop: 40
    },
    buttonText: {
        // color: Constants.Colors.yellowColor,
        fontWeight: "bold"
    },
    empty: {
        height: 0,
        backgroundColor: "#FFF"
    },
    separator: {
        height: 1,
        marginTop: 10,

    },
});


const maspStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser,
        StudentOrClassList: state.reducerLogin.StudentOrClassList,
        ClassList: state.reducerLogin.ClassList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onGetStudents: (lstClassId) => dispatch(getStudents(lstClassId)),
        onStartLoading: () => dispatch(startLoading()),
        onStopLoading: () => dispatch(stopLoading()),
        onGetActivities: (StdId, ClassId, UserType, ActivityType, ImagePath) => dispatch(getActivities(StdId, ClassId, UserType, ActivityType, ImagePath))
    }
}



export default connect(maspStateToProps, mapDispatchToProps)(ActivityComponent);