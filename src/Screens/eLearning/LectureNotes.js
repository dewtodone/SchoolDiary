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

class LectureNotes extends Component {

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
        }
    }
    componentDidMount() {

        this.GetLectureNotesList();
    }

    clickEventListener = (item) => {
        this.setState({ userSelected: item }, () => {
            this.setModalVisible(true);
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    GetLectureNotesList = () => {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
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
        let url = GLOBAL_PATH.API_URL + Constants.ApiController.ELearningVideosApi + Constants.Actions.ELearningVideosApi.GetLectureNotes + '?UserId=' + UserId;
        axios.get(url)
            .then((resp) => {
                let info = resp.data;
                this.setState({ LectureNotesList: info.LectureNotes });
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


        this.GetLectureNotesList();



    };

    LectureNotesDescription = (GeneralNotes) => {
        this.setState({ GeneralNotesModalVisible: true, GeneralNotes });
    }

    DownloadLectureNotesFiles = (FilePath) => {
        // alert(GlobalPath.BasicApiUrl + FilePath);
        Linking.openURL(GlobalPath.ACTIVITY_IMAGES + FilePath);
    }




    render() {
        // let FlatListComponent = 

        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.GetLectureNotesList()} />

                <FlatList
                    data={this.state.LectureNotesList}
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

                        let imageOrDates = <View style={styles.infoContainer} style={{
                            width: 75, height: 75, borderRadius: 50, backgroundColor: this.state.RandomColors[moment(item.Date).format('D')], alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View style={styles.innerContainerFirstColumn} >
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.Date).format('DD')}
                                </Text>
                            </View>
                            <View style={styles.innerContainerFirstColumn}>
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.Date).format('MMM')}
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
                            {/* General Notes Modal */}

                            {/* <View style={{...styles.innerContaineSecondColumn,marginLeft:10}}>
            
            <HTML style={{ marginLeft:50 }} html={item.GeneralNotes} />
           
        </View> */}
                            <View style={{ ...styles.innerContaineSecondColumn, marginRight: 10, marginTop: 5 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    {item.GeneralNotes === '' ? <View></View> : <View style={{ backgroundColor: '#00BFFF', color: '#FFF', marginRight: 15, borderRadius: 8 }}>
                                        <TouchableOpacity style={styles.followButton} onPress={() => this.clickEventListener(item)}>
                                            <Icon name="md-eye" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                            <Text style={{ ...styles.followButtonText, paddingLeft: 7 }}>View Notes</Text>

                                        </TouchableOpacity>
                                        {/* <Button  color: '#FFFFFF' title="View Notes" onPress={() => this.clickEventListener(item)}>

                                        </Button> */}

                                        {/* <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                        onPress={this.LectureNotesDescription}
                    >
                        <Icon name='md-send' style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }} />
                        <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold' }}>View Class Material</Text>
                    </Button> */}
                                    </View>}
                                    {item.FilePath === '' ? <View></View> : <View style={{ paddingTop: 2 }}>
                                        <TouchableWithoutFeedback onPress={() => this.DownloadLectureNotesFiles(item.FilePath)}>
                                            <View style={{
                                                flex: 1, flexDirection: 'row',
                                                padding: 7, borderRadius: 8, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, alignItems: "center",
                                                justifyContent: "center"
                                            }} >
                                                <Icon name="md-download" size={16} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
                                                <Text style={{ paddingTop: 2, paddingLeft: 10, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 14, fontWeight: '600' }}>Download</Text>

                                            </View>
                                        </TouchableWithoutFeedback>
                                        {/* Linking.openURL('https://g.co/meet/qkt-ebog-awa') */}
                                    </View>}

                                </View>
                            </View>


                        </View>
                        // let OtherData = <View style={styles.infoContainer}>
                        //     <View style={styles.innerContaineSecondColumn}>
                        //         <Text style={styles.infoMainText}>
                        //             {item.LeavesType}
                        //         </Text>
                        //     </View>
                        //     <View style={styles.innerContaineSecondColumn}>
                        //         <Text style={styles.infoSubText}>{item.Reason}</Text>
                        //     </View>
                        // </View>



                        // if (this.props.SelectedUser.UserType === Constants.UserType.Teacher || this.props.SelectedUser.UserType === Constants.UserType.Admin) {
                        //     imageOrDates =
                        //         <View style={styles.infoContainer} style={{
                        //             alignItems: "center",
                        //             justifyContent: "center"
                        //         }}>
                        //             <Image style={{ width: 90, height: 90, borderRadius: 20, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, borderWidth: 3 }}
                        //                 source={{ uri: item.StudentImage }} />
                        //         </View>

                        //     OtherData = <View style={styles.infoContainer}>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoMainText}>
                        //                 {item.StudentName}
                        //             </Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.Day} {item.Month}</Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.LeavesType}</Text>
                        //         </View>
                        //         <View style={styles.innerContaineSecondColumn}>
                        //             <Text style={styles.infoSubText}>{item.Reason}</Text>
                        //         </View>

                        //     </View>
                        // }

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



                <Modal
                    visible={this.state.modalVisible}
                    modalTitle={<ModalTitle title={this.state.userSelected.Subject + ' - ' + this.state.userSelected.Topic} />}
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
                        <View>
                            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                <HTML html={this.state.userSelected.GeneralNotes} />
                            </ScrollView>
                        </View>
                    </ModalContent>
                </Modal>
            </View>




        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6E6E6"
    },
    separator: {
        marginTop: 7,
    },
    listItem: {
        flexDirection: "row",
        padding: 10
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
        paddingLeft: 15,
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
    }
});


const mapStateToProps = (state) => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    };
};


export default connect(mapStateToProps, null)(LectureNotes);
