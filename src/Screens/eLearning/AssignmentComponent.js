import React, { Component } from 'react';

import { StyleSheet, LayoutAnimation, UIManager, Alert, KeyboardAvoidingView, TextInput, TouchableHighlight, ImageBackground, Platform, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList, Linking, Form } from 'react-native';
import Constants from './../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import GLOBAL_PATH from './../../utils/GlobalPath';
import { getStdId, GetRandomColors } from './../../utils/UserTypeFunc';
import axios from 'axios';
import { Card, Right } from 'native-base';
import HTML from 'react-native-render-html';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPath from './../../utils/GlobalPath';
import randomColor from 'random-color';
import Modal, { ModalContent, SlideAnimation, ModalTitle, ModalFooter, ModalButton, Backdrop } from 'react-native-modals';
import { ScrollView } from 'react-native-gesture-handler';

import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormData from 'form-data';
import { startLoading, stopLoading } from './../../store/actions/index';
let maxIndex = 0;

class AssignmentComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            AssignmentsList: [],
            RandomColors: [],
            GeneralNotes: ``,
            modalVisible: false,
            modalVisibleDownloadFile: false,
            modalVisibleUploadFiles: false,
            itemSelected: [],
            AssignmentFilesPath: [],
            lstImageUpload: [],
            Comments: '',
            expandedState: [],
            AssignmentListFiltered: [],
            Type: ''
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let expandedState = this.state.expandedState;
        expandedState[index] = !expandedState[index];
        this.setState({ expandedState });
    }

    componentDidMount() {
 this.setState({ Type : this.props.Type});
        this.GetAssignmentsList();
        let expandedState = [false];
        this.setState({ expandedState });
       

    }

    clickEventListener = (item) => {
        this.setState({ itemSelected: item }, () => {
            this.setModalVisible(true);
        });
    }

    DownloadFilePathClick = (item) => {

        let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.GetAssignmentFiles + '?AssignmentId=' + item.id;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                this.setState({ AssignmentFilesPath: info.AssignmentFiles }, () => {
                    this.setModalVisibleDownloadFile(true);
                });
            })//Then Call back respAppVersion
            .catch((error) => {
                alert(error)
                console.log(error);
            });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModalVisibleDownloadFile(visible) {
        this.setState({ modalVisibleDownloadFile: visible });
    }

    ShowUploadFilesModal(item) {
        this.setState({ lstImageUpload: [], Comments: '' });
        this.setState({ itemSelected: item }, () => {
            this.setModalVisibleUploadFile(true);
        });
    }
    setModalVisibleUploadFile(visible) {
        // let lstImageUpload = []
        // lstImageUpload.push('Abc');
        // lstImageUpload.push('Abc2');
        // lstImageUpload.push('Abc3');

        // this.setState({ lstImageUpload });
        // this.setState({ itemSelected: item }, () => {
        //     this.setModalVisible(true);
        // });
        if (!visible && this.state.lstImageUpload.length > 0) {
            Alert.alert(
                "Close Confirmation",
                "Are you sure you want to close without saving files",
                [
                    {
                        text: "No",
                        onPress: () => console.log("OK Pressed"),
                        style: "cancel"
                    },
                    { text: "Yes", onPress: () => this.setState({ modalVisibleUploadFiles: visible }) }
                ]
            );
        }
        else {
            this.setState({ modalVisibleUploadFiles: visible });
        }
    }


    GetAssignmentsList = () => {
        this.setState({
            isRefreshing: true
        });
        // let url = 'http://www.colr.org/json/colors/random/35';
        // axios.get(url)
        //     .then((resp) => {
        // let a = resp.data.colors.filter(e => e.id != -1); 

        let RandomColors = [];
        for (let i = 0; i < 32; i++) {
            var color = randomColor(0.6, 0.99);
            RandomColors.push(color.hexString());
        }

        this.setState({ RandomColors });

        let UserId = this.props.SelectedUser.StudentUserId;
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.GetAssignments + '?UserId=' + UserId + '&AssignmentType=' + this.props.Type;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                this.setState({ AssignmentsList: info.Assignments });
                this.SetFilteredAssignmentList();
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

    SetFilteredAssignmentList() {
        let AssignmentsListMain = this.state.AssignmentsList;
        const result = [];
        const map = new Map();
        for (const item of AssignmentsListMain) {
            if (!map.has(item.Subject)) {
                map.set(item.Subject, true);    // set any value to Map
                result.push(item.Subject);
            }
        }
        let i = 1;
        let AssignmentListFiltered = [];
        let expandedState = [];

        for (const subject of result) {
            let filteredList = AssignmentsListMain.filter(function (item) {
                return item.Subject == subject;
            });

            let Obj = {
                Subject: subject,
                AssignmentsList: filteredList,
                Id: i
            }
            i++;

            AssignmentListFiltered.push(Obj);
            expandedState.push(false);
        }

        this.setState({ AssignmentListFiltered, expandedState });
    }

    onRefresh = async () => {
        this.GetAssignmentsList();
    };

    LectureNotesDescription = (GeneralNotes) => {
        this.setState({ GeneralNotesModalVisible: true, GeneralNotes });
    }

    DownloadFilePaths = (FilePath, FileName, FileExtention) => {
        // alert(GlobalPath.BasicApiUrl + FilePath);
        //Linking.openURL(GlobalPath.ACTIVITY_IMAGES + FilePath);
        //alert(FilePath);
        FilePath = GLOBAL_PATH.ACTIVITY_IMAGES + FilePath;

        const date = new Date();
        if (Platform.OS == 'android') {
            const { config, fs } = RNFetchBlob;


            const { DownloadDir } = fs.dirs; // You can check the available directories in the wiki.
            const options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true, // true will use native manager and be shown on notification bar.
                    notification: true,
                    path: `${DownloadDir}/${FileName}`,
                    description: 'Downloading.',
                },
            };

            config(options).fetch('GET', FilePath).then((res) => {
                console.log('do some magic in here');
            });
        }
        else {
            Linking.openURL(FilePath);

        }
    }


    GetFileExtention(FilePath) {
        let FileExtention = FilePath.substring(FilePath.lastIndexOf("/"));
        let ext = FileExtention.substring(FileExtention.lastIndexOf("."))
        return ext.replace(".", "");
    }


    ImagesFromGallery = () => {

        // var formData = new FormData();
        // var file = this.state.ImageData;//this is image data

        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            compressImageMaxWidth: 1280,
            compressImageMaxHeight: 1280,
            compressImageQuality: 0.6
        }).then(image => {
            let lstImages = this.state.lstImageUpload;
            if (lstImages.length > 0) {
                maxIndex = lstImages[lstImages.length - 1].key;
                maxIndex = maxIndex + 2;
            }
            image.map((i, index) => {
                // console.log('received image: ', i);
                // maxIndex= index;

                var photo = {
                    uri: i.path,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                };
                let Obj = {
                    ImageDetail: i,
                    ImageData: photo,
                    ImagePath: { uri: i.path },
                    key: maxIndex + index,
                }
                lstImages.push(Obj);
            });
            this.setState({ lstImageUpload: lstImages });

        }).catch(error => {
            console.log(error);
        });
    } // end of imageFromGallery
    ImageFromCamera = () => {
        ImagePicker.openCamera({
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            cropping: true,
            compressImageMaxWidth: 1280,
            compressImageMaxHeight: 1280,
            compressImageQuality: 0.6
        }).then(image => {
            let lstImages = this.state.lstImageUpload;
            // let maxIndex = 0;
            if (lstImages.length > 0) {
                maxIndex = lstImages[lstImages.length - 1].key;
                maxIndex = maxIndex + 2;
            }
            // image.map((i,index) => {
            var photo = {
                uri: image.path,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };
            let Obj = {
                ImageDetail: image,
                ImageData: photo,
                ImagePath: { uri: image.path },
                key: maxIndex + 1,
            }
            lstImages.push(Obj);
            // });
            this.setState({ lstImageUpload: lstImages });


        }).catch(error => {
            console.log(error);
        });
    } // end of imageFromCamera


    createTwoButtonAlert = (key) =>
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this item",
            [
                {
                    text: "No",
                    onPress: () => console.log("OK Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => this.deleteImageConfirm(key) }
            ]
        );

    deleteImageConfirm(key) {
        var arr = this.state.lstImageUpload;
        var res = arr.filter(item => item.key !== key);
        this.setState({ lstImageUpload: res });
    }

    SubmitFiles() {
        if (this.state.lstImageUpload.length <= 0) {
            alert('Please upload files');
        }
        else {
            this.props.OnStartLoading();
            var formData = new FormData();
            let lstImages = this.state.lstImageUpload;

            lstImages.forEach((i, index) => {
                // var photo = {
                //     uri: i.ImagePath,
                //     type: 'image/jpeg',
                //     name: 'photo.jpg',
                // };
                formData.append("image" + index, i.ImageData);
            });

            let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.SubmitAssignmentFiles;

            axios({
                url: url,
                method: "POST",
                data: formData
            }).then((resp) => {
                this.setState({ FileAttachmentSubmitAssignmnet: resp.data.FilesList });
                this.SubmitAssignmnetStudents();
            })
                .catch((err) => {
                    this.props.OnStopLoading();
                    alert(err);
                    console.log('ERROR ' + err);
                });
        }

    }

    SubmitAssignmnetStudents = () => {
        let Assignment = {
            StudentId: this.props.SelectedUser.Id,
            CreatedBy: this.props.SelectedUser.StudentUserId,
            AssignmentId: this.state.itemSelected.id,
            FilePath: this.state.FileAttachmentSubmitAssignmnet,
            Description: this.state.Comments
        }

        let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.SubmitAssignmentStudents;



        axios.post(url, Assignment)
            .then((response) => {
                this.props.OnStopLoading();

                if (response.data === 'Success') {
                    this.setState({ lstImageUpload: [], Comments: '' });
                    alert('Files has been uploaded successfully ');
                    this.setModalVisibleUploadFile(false);
                    this.GetAssignmentsList();
                }
                else {
                    alert(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
                this.props.OnStopLoading();
                // dispatch(stopLoading());
            });
    }





    render() {
        // let FlatListComponent = 

        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.GetAssignmentsList()} />
                <FlatList
                    data={this.state.AssignmentListFiltered}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    renderItem={(post, index) => {
                        const list = post.item;
                        return (
                            <View style={{ flex: 1, paddingLeft: 7, paddingRight: 5 }}>
                                <TouchableOpacity ref={this.accordian} style={styles.row} onPress={() => this.toggleExpand(list.Id - 1)}>
                                    <Text style={[styles.title, styles.font]}>{list.Subject}</Text>
                                    <Entypo name={this.state.expandedState[list.Id - 1] ? 'minus' : 'plus'} size={30} color='#1EB7FF' />
                                </TouchableOpacity>
                                <View style={styles.parentHr} />
                                {
                                    this.state.expandedState[list.Id - 1] &&
                                    <View style={styles.child}>
                                        <FlatList
                                            data={list.AssignmentsList}
                                            keyExtractor={(item) => {
                                                return item.Id;
                                            }}
                                            // onRefresh={this.onRefresh}
                                            // refreshing={this.state.isRefreshing}
                                            ItemSeparatorComponent={() => {
                                                return (
                                                    <View style={styles.separator} />
                                                )
                                            }}

                                            renderItem={(post, index) => {
                                                const item = post.item;

                                                let imageOrDates = <View style={styles.infoContainer} style={{
                                                    width: 70, height: 70, borderRadius: 50, backgroundColor: this.state.RandomColors[moment(item.DueDate).format('D')], alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <View style={styles.innerContainerFirstColumn} >
                                                        <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                                            {moment(item.DueDate).format('DD')}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.innerContainerFirstColumn}>
                                                        <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                                            {moment(item.DueDate).format('MMM')}
                                                        </Text>
                                                    </View>
                                                </View>
                                                let OtherData = <View style={styles.infoContainer}>
                                                    <View style={styles.innerContaineSecondColumn}>
                                                        <Text style={styles.infoMainText}>
                                                            {item.Subject}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.innerContaineSecondColumn}>
                                                        <Text style={styles.infoSubText}>
                                                            {item.Topic}
                                                        </Text>
                                                    </View>
                                                    {item.Remarks === '' ? <View></View> : <View style={styles.innerContaineSecondColumn}>
                                                        <Text style={{ ...styles.infoSubText, color: 'black', marginRight: 30, }}>
                                                            {'Remarks: ' + item.Remarks}
                                                        </Text>
                                                    </View>}
                                                    {parseInt(item.ObtainMarks) === 0 ? <View></View> : <View style={styles.innerContaineSecondColumn}>
                                                        <Text style={{ ...styles.infoSubText, color: 'black' }}>
                                                            {'Marks: ' + item.ObtainMarks + '/' + item.TotalMarks}
                                                        </Text>
                                                    </View>
                                                    }

                                                    {/* General Notes Modal */}

                                                    {/* <View style={{...styles.innerContaineSecondColumn,marginLeft:10}}>
                    
                    <HTML style={{ marginLeft:50 }} html={item.GeneralNotes} />
                   
                </View> */}
                                                    <View style={{ ...styles.innerContaineSecondColumn, marginRight: 10, marginTop: 5 }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            {item.Instructions === '' ? <View></View> : <View style={{ backgroundColor: '#00BFFF', color: '#FFF', marginRight: 15, borderRadius: 8 }}>
                                                                <TouchableOpacity style={styles.followButton} onPress={() => this.clickEventListener(item)}>
                                                                    <Icon name="md-eye" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                                    <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>See {this.state.Type}</Text>

                                                                </TouchableOpacity>

                                                            </View>}
                                                            {item.FilePath === '0' ? <View></View> : <View style={{ paddingTop: 2 }}>
                                                                <TouchableWithoutFeedback onPress={() => this.DownloadFilePathClick(item)}>
                                                                    <View style={{
                                                                        flex: 1, flexDirection: 'row',
                                                                        padding: 7, borderRadius: 8, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }} >
                                                                        <Icon name="md-download" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                                        <Text style={{ paddingTop: 2, paddingLeft: 10, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>Download</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            </View>}
                                                        </View>
                                                    </View>

                                                    <View style={{ ...styles.innerContaineSecondColumn, marginRight: 10, marginTop: 5 }}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <View style={{ paddingTop: 2 }}>
                                                                <TouchableWithoutFeedback disabled={item.SubmitId != "0" ? true : false} onPress={() => this.ShowUploadFilesModal(item)}>
                                                                    <View style={{
                                                                        flex: 1, flexDirection: 'row',
                                                                        padding: 7, borderRadius: 8, backgroundColor: item.SubmitId != "0" ? 'gray' : this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                                                        justifyContent: "center"
                                                                    }} >
                                                                        <Icon name="md-arrow-up" size={16} color={item.SubmitId != "0" ? 'white' : this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                                        <Text style={{ paddingTop: 2, paddingLeft: 10, color: item.SubmitId != "0" ? 'white' : this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>Upload</Text>
                                                                    </View>
                                                                </TouchableWithoutFeedback>
                                                            </View>
                                                        </View>
                                                    </View>


                                                </View>


                                                return (
                                                    // <TouchableOpacity
                                                    //   onPress={() => {
                                                    //     this.props.navigation.navigate("AddLeaves");
                                                    //   }}
                                                    // >
                                                    <Card style={styles.listItem}>
                                                        {imageOrDates}
                                                        {OtherData}

                                                    </Card>
                                                    // </TouchableOpacity>
                                                );
                                            }}
                                        />
                                    </View>
                                }
                            </View>
                        );
                    }
                    }
                />




                <Modal
                    visible={this.state.modalVisible}
                    modalTitle={<ModalTitle title={this.state.itemSelected.Subject + ' - ' + this.state.itemSelected.Topic} />}
                    maxHeight={Dimensions.Height - 100}
                    width={0.9}
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
                        <View style={{ height: Dimensions.get('window').height - 200 }}>
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                <HTML html={this.state.itemSelected.Instructions} />
                            </ScrollView>
                        </View>
                    </ModalContent>
                </Modal>

                <Modal

                    visible={this.state.modalVisibleDownloadFile}
                    onTouchOutside={() => {
                        this.setModalVisibleDownloadFile(false)
                    }}
                    modalTitle={<ModalTitle title='Download Files' />}
                    maxHeight={Dimensions.Height - 200}
                    width={0.9}
                    // onBackdropPress={() => setModalVisibleDownloadFile(false)}
                    footer={
                        <ModalFooter style={{ height: 40 }}>
                            <Right>
                                <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                    <TouchableOpacity style={{ width: '50%', paddingLeft: 20 }} onPress={() => { this.setModalVisibleDownloadFile(false) }}  >
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

                    <ModalContent style={{ backgroundColor: '#E6E6E6' }}>

                        <View style={{ height: Dimensions.get('window').height - 200 }}>
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                <FlatList


                                    data={this.state.AssignmentFilesPath}
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

                                    renderItem={(post, index) => {
                                        const item = post.item;
                                        let FileExtention = this.GetFileExtention(item.FilePath);
                                        let imageOrDates = <View style={styles.infoContainer} style={{
                                            borderRadius: 0, alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {item.FileThumbnail != '' ? <Image
                                                style={{ width: 50, height: 50 }}
                                                source={{
                                                    uri: GLOBAL_PATH.ACTIVITY_IMAGES + item.FileThumbnail,
                                                }}
                                            /> : <Icon name="md-document" size={60} />
                                            }

                                        </View>
                                        let OtherData = <View style={styles.infoContainer}>
                                            <View style={styles.innerContaineSecondColumn}>
                                                <Text style={styles.infoMainText}>
                                                    {item.FileName}
                                                </Text>
                                            </View>
                                            <View style={{ ...styles.innerContaineSecondColumn, marginRight: 10, marginTop: 5 }}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ paddingTop: 2 }}>
                                                        <TouchableWithoutFeedback onPress={() => this.DownloadFilePaths(item.FilePath, item.FileName, FileExtention)}>
                                                            <View style={{
                                                                flex: 1, flexDirection: 'row',
                                                                padding: 7, borderRadius: 8, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                                                justifyContent: "center"
                                                            }} >
                                                                <Icon name="md-download" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                                <Text style={{ paddingTop: 2, paddingLeft: 10, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>Download</Text>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                        return (
                                            <Card style={{ ...styles.listItem, borderRadius: 8 }}>
                                                {imageOrDates}
                                                {OtherData}
                                            </Card>
                                        );
                                    }}
                                />
                            </ScrollView>
                        </View>
                    </ModalContent>
                </Modal>



                <Modal

                    visible={this.state.modalVisibleUploadFiles}
                    onTouchOutside={() => {
                        this.setModalVisibleUploadFile(false)
                    }}
                    modalTitle={<ModalTitle title='Upload Files' />}
                    maxHeight={Dimensions.Height - 200}
                    width={0.9}
                    // onBackdropPress={() => setModalVisibleDownloadFile(false)}
                    footer={
                        <ModalFooter style={{ height: 40 }}>
                            <Right>
                                <View style={{ paddingRight: 20, paddingTop: 5 }}>
                                    <TouchableOpacity style={{ width: '50%', paddingLeft: 20 }} onPress={() => { this.setModalVisibleUploadFile(false) }}  >
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

                    <ModalContent style={{ backgroundColor: '#E6E6E6' }}>
                        {/* <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{flex: 1}}
                        > */}
                        <View style={{ height: Dimensions.get('window').height - 200, marginTop: 10 }}>
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: '#00BFFF', color: '#FFF', marginRight: 15, borderRadius: 8 }}>
                                        <TouchableOpacity style={styles.followButton} onPress={() => this.ImageFromCamera()}>
                                            <Icon name="ios-camera" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                            <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>From Camera</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 2 }}>
                                        <TouchableWithoutFeedback onPress={() => this.ImagesFromGallery()}>
                                            <View style={{
                                                flex: 1, flexDirection: 'row',
                                                padding: 7, borderRadius: 8, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                                justifyContent: "center"
                                            }} >
                                                <Icon name="md-albums" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                <Text style={{ paddingTop: 2, paddingLeft: 10, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>From Gallery</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View>

                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.lstImageUpload}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={3}

                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={styles.separator} />
                                        )
                                    }}

                                    renderItem={(post, index) => {
                                        const item = post.item;

                                        let imageOrDates = <View style={styles.infoContainer} style={{
                                            borderRadius: 0, alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <View style={{ flex: 1, flexDirection: "column" }}>
                                                <ImageBackground source={item.ImagePath} style={{ flex: 1, width: 70, height: 60, resizeMode: 'contain', justifyContent: "center" }} >
                                                    <TouchableWithoutFeedback
                                                        onPress={() =>
                                                            // this.confirmBox(item.key,true)
                                                            // this.removeImage(item.key)
                                                            // this.setState({ isVisible: true, imageKey: item.key })
                                                            this.createTwoButtonAlert(item.key)
                                                        }>
                                                        <MaterialCommunityIcons name='close-circle-outline'
                                                            size={26}
                                                            color='red' style={{
                                                                height: 40, width: 40,
                                                                // alignItems: 'flex-end',
                                                                flexDirection: 'row',
                                                                // alignItems: 'center'
                                                                // justifyContent: 'flex-end',
                                                                // position: 'absolute'
                                                                marginTop: -40,
                                                                marginHorizontal: 52
                                                            }} />
                                                    </TouchableWithoutFeedback>
                                                </ImageBackground>
                                            </View>

                                        </View>

                                        return (
                                            <Card style={{ ...styles.listItem, borderRadius: 8 }}>
                                                {imageOrDates}

                                            </Card>
                                        );
                                    }}
                                />
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        placeholder="Enter Comments"
                                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                                        onChangeText={Comments => this.setState({ Comments })}
                                        value={this.state.Comments}
                                        multiline={true}
                                        style={{ height: 80, borderWidth: 1, width: Dimensions.get('window').width - 100, marginTop: 50, fontSize: 16 }}

                                    />
                                    <TouchableWithoutFeedback onPress={() => this.SubmitFiles()}>
                                        <View style={{
                                            flex: 1, flexDirection: 'row',
                                            padding: 7, borderRadius: 8, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                            justifyContent: "center", marginTop: 20
                                        }} >
                                            <Icon name="md-send" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                            <Text style={{ paddingTop: 2, paddingLeft: 10, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>Submit</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                            </ScrollView>
                        </View>
                        {/* </KeyboardAvoidingView> */}
                    </ModalContent>
                </Modal>

            </View>




        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1EB7FF',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        backgroundColor: '#f8f8f9',
        borderColor: '#1EB7FF',
        borderWidth: 1
    },
    parentHr: {
        height: 1,
        color: '#ffffff',
        width: '100%',

    },
    child: {
        flex: 1,
        backgroundColor: '#C7C7C7',
        paddingTop: 15,
        borderWidth: 1,
        borderTopColor: 'transparent',
        borderRightColor: '#1EB7FF',
        borderLeftColor: '#1EB7FF',
        borderBottomColor: '#1EB7FF'
    },
    container: {
        // flex: 1,
        backgroundColor: "#E6E6E6"
    },
    separator: {
        marginTop: 7,
    },
    listItem: {
        flexDirection: "row",
        padding: 10,
        //borderRadius: 8
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
        fontWeight: "600",
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
        paddingLeft: 10,
        marginRight: 30,
    },

    followButton: {
        // marginTop: 10,
        // height: 35,
        // width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
        padding: 7
    },
    followButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
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
    item: {
        // backgroundColor: '#3232ff',
        alignItems: 'center',
        height: 90,
        margin: 3,
        marginBottom: 5,
    },
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


export default connect(mapStateToProps, mapsDispatchToProps)(AssignmentComponent);
