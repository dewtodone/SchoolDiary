import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button, FlatList,Alert } from 'react-native';
import { Card } from 'native-base';
import ImageView from 'react-native-image-view';

const { width } = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo'
import { connect } from 'react-redux';
import { getActivities, startLoading, stopLoading } from '../../store/actions/index';
import GLOABAL_PATH from '../../utils/GlobalPath';
import Constants from '../../utils/Constants';
import { NavigationEvents } from 'react-navigation';
import { plusButtonShowForTeachers, getClassId, getStdId } from '../../utils/UserTypeFunc';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { ConfirmDialog } from 'react-native-simple-dialogs';
class Notice extends Component {



    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            isImageViewVisible: false,
            isRefreshing: false,
            userSelected: [],
            modalVisible: false,
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };
    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        });

        this.GetNotices();
        this.setState({
            isRefreshing: false
        });

    };

    clickEventListener = (item) => {
        this.setState({ userSelected: item }, () => {
            this.setModalVisible(true);
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    DeleteActivity =(Id) => {
        let url = GLOABAL_PATH.API_URL + Constants.ApiController.ActivityApi + Constants.ActivityApiFunc.DeleteActivity + '?Id=' + Id + '&UserId=' + this.props.SelectedUser.UserId +'&ActivityType=' + Constants.ActivityType.Homework;
        this.setModalVisible(false);
        this.props.onStartLoading();
        axios.get(url)
            .then((resp) => {
                this.props.onStopLoading();
                let info = resp.data.Message;
               if (info === Constants.ApiResponse.Success){

                   this.GetNotices();

                   setTimeout(() =>{
                    Alert.alert(Constants.DisMsg.DeletedSuccessfully);
                },2000)
               }
               else{
                setTimeout(() =>{
                    Alert.alert(info);
                },1000)
                
               }
            })//Then Call back respAppVersion
            .catch((error) => {
                this.props.onStopLoading();
                alert(error)
                console.log(error);
            });
    }

    componentDidMount() {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        this.GetNotices();
    }

    GetNotices = () => {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        let ClassId = getClassId(this.props.SelectedUser);
        let StdId = getStdId(this.props.SelectedUser);
        let UserType = this.props.SelectedUser.UserType;
        this.props.onGetActivities(StdId, ClassId, UserType, Constants.ActivityType.Notice, GLOABAL_PATH.ACTIVITY_IMAGES);

    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                {/* <Text>{this.props.NoticeList.length}</Text>
          <Text>{this.props.ActivitiesList.length}</Text> */}


                <NavigationEvents onDidFocus={() => this.GetNotices()} />



                <FlatList
                    style={styles.root}
                    data={this.props.NoticeList}
                    initialNumToRender={5}
                    showsHorizontalScrollIndicator={false}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    // extraData={this.state}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{ ...styles.separator, backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }} />
                        )
                    }}
                    keyExtractor={(item) => {
                        return item.Id;
                    }}
                    renderItem={(post) => {
                        const item = post.item;
                        let image = <View />;
                        if (item.source.uri.includes('default.jpg') === false) {
                            image = <View style={styles.infoContainer} style={{
                                width: 100, height: 70, alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <TouchableOpacity key={item.Title} onPress={() => {

                                    this.setState({
                                        imageIndex: item.Sr - 1,
                                        isImageViewVisible: true,
                                    });
                                }}
                                >

                                    <Image
                                        source={item.source}
                                        style={{ ...styles.avatar, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}
                                        resizeMode="cover"
                                    />

                                </TouchableOpacity>
                            </View>
                        }
                        return (
                            <View style={{ flexDirection: "row", padding: 12 }}>
                                {image}
                                <View style={styles.infoContainer}>
                                    <View style={styles.innerContaineSecondColumn}>
                                        <Text style={styles.Title}>
                                            {item.Title}
                                        </Text>
                                        <Text style={styles.classStyle}>Class: {item.ClassName}</Text>
                                    </View>
                                    <View style={styles.innerContaineSecondColumn}>
                                        <Text style={styles.Description}>{item.Description}</Text>
                                    </View>

                                    <View style={styles.innerContaineSecondColumn}>
                                        <View style={{ flexDirection:'row', flex:1, justifyContent:'space-between'}}>
                                            <View style={{ alignself: 'flex-start',}}>
                                                <Text style={{ ...styles.timeAgo, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>{item.CreatedDate}</Text>
                                            </View>
                                            <View style={{ alignself: 'flex-end', marginLeft : 10 }}>
                                                {this.props.SelectedUser.UserType === Constants.UserType.Admin || this.props.SelectedUser.UserType === Constants.UserType.Teacher ? <View >
                                                    <TouchableOpacity key={item.Id} onPress={() => this.clickEventListener(item)}  >
                                                        <Icon name="md-trash" color="red" size={28} />
                                                    </TouchableOpacity>
                                                </View> : <View />}
                                            </View>
                                        </View>
                                    </View>

                                    <ConfirmDialog
                                    title="Confirm Dialog"
                                    message="Are you sure about that?"
                                    visible={this.state.modalVisible}
                                    // onTouchOutside={() => this.setState({ modalVisible: false })}
                                    positiveButton={{
                                        title: "YES",
                                        onPress: () => this.DeleteActivity(this.state.userSelected.Id)
                                    }}
                                    negativeButton={{
                                        title: "NO",
                                        onPress: () => { this.setModalVisible(false); }

                                    }}
                                />
                                </View>

                            </View>
                        );
                    }} />
                <ImageView
                    glideAlways
                    images={this.props.NoticeList}
                    imageIndex={this.state.imageIndex}
                    animationType="fade"
                    isVisible={this.state.isImageViewVisible}

                    onClose={() => this.setState({ isImageViewVisible: false })}
                    onImageChange={index => {
                        console.log(index);
                    }}
                />

                {plusButtonShowForTeachers(this.props.SelectedUser, this.props.navigation, Constants.SubRoute.AddNotice)}

            </View>


        );
    }
}


const styles = StyleSheet.create({
    root: {
        backgroundColor: "#FFFFFF"
    },
    infoContainer: {
        // flexDirection: "column",
        // marginRight:20,
        marginRight: 30,
        paddingRight: 30
    },
    container: {
        padding: 16,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: "#FFFFFF",
        //alignItems: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        width: 110,
        height: 100
    },
    avatar: {
        width: 100,
        height: 70,
        borderRadius: 8,

        borderWidth: 3

    },
    text: {
        marginBottom: 5,
        //flexDirection: 'row',
        flexWrap: 'wrap'
    },
    content: {
        flex: 1,
        marginLeft: 16,
        marginRight: 0
    },
    mainContent: {
        //marginRight: 60
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 20,
        paddingRight: 10
    },
    img: {
        height: 50,
        width: 50,
        margin: 0
    },
    attachment: {
        position: 'absolute',
        right: 0,
        height: 50,
        width: 50
    },
    separator: {
        height: 1,
        // backgroundColor: Constants.Colors.headerBackColor
    },
    timeAgo: {
        fontSize: 13,
        // color: Constants.Colors.headerBackColor
    },
    Title: {
        fontSize: 17,
        color: "#212121",
        fontWeight: 'bold'
    },
    Description: {
        fontSize: 16,
        color: "#757575",


    }, 
    classStyle: {
        fontSize: 15,
        color: Constants.Colors.cardBlackColor,
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 2

    },floatButton: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        backgroundColor: Constants.Colors.headerBackColor,
        borderRadius: 100
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
});


const mapStateToProps = (state) => {
    return {
        NoticeList: state.reducerActivities.NoticeList,
        SelectedUser: state.reducerLogin.SelectedUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetActivities: (StdId, ClassId, UserType, ActivityType, ImagePath) => dispatch(getActivities(StdId, ClassId, UserType, ActivityType, ImagePath)),
        onStartLoading: () => dispatch(startLoading()),
        onStopLoading: () => dispatch(stopLoading()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);