import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard, FlatList, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
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
import { HeaderBackButton } from "react-navigation-stack";
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ThemeColors } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
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

const sendTypeTeacher = [{
    label: Constants.SendActivityType.Teacher,
    value: Constants.SendActivityType.Teacher
}];

class AddPTM extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("ParentTeacherMeeting")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    constructor(props) {
        super(props);
        this.setStateToDefault();

    }

    setStateToDefault() {
        this.state = {
            Title: '',
            Description: '',
            StudentOrClassList: [],
            modalVisible: false,
            modalTitle: 'Select Classes',
            SendTo: 'Class',
            isDatePickerVisible: false,
            SelectedCLassOrStdList: [],
            txtStudentOrClass: 'Select Classes',
            FileName: '',
            PtmDateTimeString: '',
            PtmDateTime: moment().toDate(),
            IsShowClassDropdDownForSearch: false,
            ShowClassDropdDownForSearchList: [],
            ShowClassDropdDownForSearchValue: 0
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        if (this.props.SelectedUser.UserType === Constants.UserType.Parent) {
            this.setState({ modalTitle: 'Select Teacher', SendTo: 'Teacher', txtStudentOrClass: 'Select Teacher', })

        }
        else {
            this.setState({ modalTitle: 'Select Classes', SendTo: 'Class', txtStudentOrClass: 'Select Classes', })
        }
        this.BindClass();
    }

    BindClass = () => {
        let lst = [];
        let ListMap = [];
        if (this.props.SelectedUser.UserType === Constants.UserType.Parent) {
            let TeacherList = [];
            //This is wrong but this is time being
            let obj = {
                ClassId: -1,
                ClassName: this.props.SelectedUser.TeacherName,
            }
            TeacherList.push(obj);
            ListMap = TeacherList;
        }
        else {
            ListMap = this.props.StudentOrClassList;
        }

        ListMap.forEach(function (entry) {
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
                let ShowClassDropdDownForSearchList = this.BindClassListDropdDownForSearch();

                this.setState({ IsShowClassDropdDownForSearch: true, ShowClassDropdDownForSearchList, modalTitle: 'Select Students', StudentOrClassList: [] });
            }
        }
        else {
            this.BindClass();
        }


       



        // this.setState({ SendTo: val, txtStudentOrClass: val === Constants.SendActivityType.Student ? ' Select Students' : 'Select Classes' });
        // if (val === Constants.SendActivityType.Student) {
        //     var that = this;
        //     //this.props.onStartLoading();
        //     let lstClassId = [];
        //     this.props.StudentOrClassList.forEach(function (entry) {
        //         lstClassId.push(entry.ClassId);
        //     });
        //     let url = GLOABAL_PATH.API_URL + 'ActivityApi/GetStudents?ClassIds=' + lstClassId;
        //     axios.get(url)
        //         .then((response) => {
        //             let StudentList = response.data.StudentList;

        //             let lst = [];
        //             StudentList.forEach(function (entry) {
        //                 var lstClass = {};
        //                 lstClass['Id'] = entry.Id;
        //                 lstClass['Name'] = entry.Name;
        //                 lstClass['checked'] = false;
        //                 lst.push(lstClass);
        //             });
        //             that.setState({ StudentOrClassList: lst, modalTitle: 'Select Students' });
        //             // dispatch(setStudents(StudentList))
        //             //this.props.onStopLoading();
        //             // this.setState({ StudentOrClassList: StudentList });
        //         })
        //         .catch(function (error) {
        //             //this.props.onStopLoading();
        //         });
        // }
        // else{
        //     this.BindClass();
        // }
    };

    ClearAddPTM = () => {
        this.setState({
            Title: '',
            Description: '',
            StudentOrClassList: [],
            modalVisible: false,
            modalTitle: 'Select Classes',
            SendTo: 'Class',
            isDatePickerVisible: false,
            SelectedCLassOrStdList: [],
            txtStudentOrClass: 'Select Classes',
            FileName: '',
            PtmDateTimeString: '',
            PtmDateTime: moment().toDate(),
            IsShowClassDropdDownForSearch: false,
            ShowClassDropdDownForSearchList: [],
            ShowClassDropdDownForSearchValue: 0
        });
    }

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
        let Ids = ''
        Ids = (this.state.SelectedCLassOrStdList.map(function (item) {
            return item.Id
        })).join(',');

        if (this.state.Title === '') {
            alert('Please Enter Title');
        }
        else if (Ids === '') {
            if (this.props.SelectedUser.UserType === Constants.UserType.Parent) {
                alert('Please Select Teacher');
            }
            else {
                alert('Please Select Students Or Classes');
            }

        }
        else {
            let propsNavigate = this.props.Navigation;
            //let imagePath = resp.data;

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

            let objPTM = {
                Title: this.state.Title,
                PTMDateTime: this.state.PtmDateTime,
                UserType: this.props.SelectedUser.UserType,
                Description: this.state.Description,
                ClassId: ClassIds,
                StudentId: StudentId,
                UserId: this.props.SelectedUser.Id,
                BrId: this.props.SelectedUser.BrId
            }

            let url = GLOABAL_PATH.API_URL + Constants.ApiController.ParentTeacherMeetingApi + Constants.ParentTeacherMeetingApiFunc.SavePTM;

            //dispatch(stopLoading());
            // axios.post(url,{data : LeaveRequest})
            axios({ method: 'post', url: url, data: objPTM })
                .then((response) => {
                    console.log(response.data);
                    // dispatch(stopLoading());
                    if (response.data.Message === Constants.ApiResponse.Success) {
                        // dispatch(getLeavesRequest(LeaveRequest.StudentId, LeaveRequest.ClassId));                   
                        //dispatch(stopLoading());
                        this.ClearAddPTM();
                        //this.props.onGetActivities(StdId, SelectedClassId, Constants.ActivityType.Activity, GLOABAL_PATH.ACTIVITY_IMAGES);
                        alert('Saved Successfully');

                        this.props.navigation.navigate('ParentTeacherMeeting');
                        // this.props.Navigation.navigate('Attendance');
                    }
                    else {
                        // dispatch(stopLoading());
                        alert(response.data.Message);
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    alert('Internet may be slow, Please Try Again Later');
                    //dispatch(stopLoading());
                });
        }


    };



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

    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleConfirm = (date) => {

        this.setState({ PtmDateTime: moment(date).format('MM/DD/YYYY hh:mm A'), PtmDateTimeString: moment(date).format('DD-MMM-YYYY hh:mm A') });
        this.hideDatePicker();
    };
    render() {
        // let lst = getStudentOrClassList(this.props.StudentOrClassList);
        return (
            <Container>
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
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
                                    <MaterialIcons name='border-color' size={24} color={this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,paddingTop: 6 }}>Title</Label>
                            </View>


                            <Item style={styles.inputItem} >
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Enter Title"
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onChangeText={Title => this.setState({ Title })}
                                />
                            </Item>
                            <Text style={{...styles.separator, backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}></Text>



                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <EvilIcons name='clock' size={30} color={this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 0 }}>Date</Label>
                            </View>


                            <Item style={styles.inputItem} >
                                <TouchableOpacity onPress={this.showDatePicker}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ borderWidth: 0, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 50, marginLeft: 10, width: '90%' }}>{this.state.PtmDateTimeString === '' ? 'Select Date' : this.state.PtmDateTimeString}</Text>
                                        {/* <View style={{ top: 3, right: 25 }}>
                                            <Image style={{ width: 25, height: 25 }} source={this.state.imageSource} />
                                        </View> */}
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={this.state.isDatePickerVisible}
                                        mode="datetime"
                                        onConfirm={this.handleConfirm}
                                        onCancel={this.hideDatePicker}
                                    />
                                </TouchableOpacity>
                            </Item>
                            <Text style={{...styles.separator, backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}></Text>




                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <MaterialCommunityIcons name='text-subject' size={24} color={this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 6 }}>Description</Label>
                            </View>


                            <Item style={styles.inputItem} >
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Enter Description"
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onChangeText={Description => this.setState({ Description })}
                                />
                            </Item>
                            <Text style={{...styles.separator, backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}></Text>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <Icon name='ios-people' size={24} style={{ color: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, }} />
                                </View>
                                <Label style={{ color: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, }}>Send</Label>
                            </View>

                            <Item style={styles.inputItem} >
                                <View style={{ width: '100%' }}>
                                    <RNPickerSelect
                                        placeholder={{}}
                                        items={this.props.SelectedUser.UserType === Constants.UserType.Parent ? sendTypeTeacher : sendType}
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
                                                borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
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
                                                borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
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
                                                borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
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
                                                borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue,
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
                                            <Text style={{ borderWidth: 2, paddingLeft: 10, paddingRight: 28, paddingBottom: 10, paddingTop: 15, borderColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderRadius: 8, height: 'auto', marginLeft: 10, width: '90%' }}>{this.state.txtStudentOrClass} </Text>
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
                                                                                checked={item.checked} color={this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}
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
                                <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                                    onPress={this.SaveAtivityHandler}
                                >
                                    <Icon name='md-send' style={{ color: this.props.ClassLevel === 1?  Constants.Colors.yellowColor : Constants.Colors.whiteColor }} />
                                    <Text style={{ color: this.props.ClassLevel === 1?  Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold' }}>Send</Text>
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
        backgroundColor: Constants.Colors.headerBackColor,
        marginTop: 40
    },
    buttonText: {
        color: Constants.Colors.yellowColor,
        fontWeight: "bold"
    },
    empty: {
        height: 0,
        backgroundColor: "#FFF"
    },
    separator: {
        height: 1,
        marginTop: 10,
        // backgroundColor: Constants.Colors.headerBackColor
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
        onGetActivities: (StdId, ClassId, ActivityType, ImagePath) => dispatch(getActivities(StdId, ClassId, ActivityType, ImagePath))
    }
}



export default connect(maspStateToProps, mapDispatchToProps)(AddPTM);