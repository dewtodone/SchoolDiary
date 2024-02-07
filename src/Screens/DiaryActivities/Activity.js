import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    FlatList,
    Button, Dimensions
} from 'react-native';

import ImageView from 'react-native-image-view';
// import Entypo from 'react-native-vector-icons/Entypo'
const { width } = Dimensions.get('window');
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import { getActivities, startLoading, stopLoading } from '../../store/actions/index';
import GLOABAL_PATH from '../../utils/GlobalPath';
import Constants from '../../utils/Constants';
import { NavigationEvents } from 'react-navigation';
import { getStdId, getClassId, plusButtonShowForTeachers } from '../../utils/UserTypeFunc';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ImageModal from 'react-native-image-modal';

class Activity extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    // componentWillReceiveProps(){
    //     alert(this.props.SelectedUser.ClassLevel);
    // }

    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0,
            isImageViewVisible: false,
            isRefreshing: false,
            userSelected: [],
            modalVisible: false,
        };
    }
    onRefresh = async () => {
        this.setState({
            isRefreshing: true
        });

        this.GetActivities();

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

    DeleteActivity = (Id) => {
        let url = GLOABAL_PATH.API_URL + Constants.ApiController.ActivityApi + Constants.ActivityApiFunc.DeleteActivity + '?Id=' + Id + '&UserId=' + this.props.SelectedUser.UserId + '&ActivityType=' + Constants.ActivityType.Activity;
        this.setModalVisible(false);
        this.props.onStartLoading();
        axios.get(url)
            .then((resp) => {
                this.props.onStopLoading();
                let info = resp.data.Message;
                let msg = '';
                if (info === Constants.ApiResponse.Success) {

                    msg = Constants.DisMsg.DeletedSuccessfully;



                    this.GetActivities();

                    setTimeout(() => {
                        Alert.alert(Constants.DisMsg.DeletedSuccessfully);
                    }, 2000);

                }
                else {

                    msf = info;

                    setTimeout(() => {
                        Alert.alert(info);
                    }, 1000);
                }



            })//Then Call back respAppVersion
            .catch((error) => {
                this.props.onStopLoading();
                alert(error)
                console.log(error);
            });
    }

    componentDidMount() {
        this.GetActivities();
    }

    GetActivities = () => {
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
        let ClassId = getClassId(this.props.SelectedUser);
        let StdId = getStdId(this.props.SelectedUser);
        let UserType = this.props.SelectedUser.UserType;
        this.props.onGetActivities(StdId, ClassId, UserType, Constants.ActivityType.Activity, GLOABAL_PATH.ACTIVITY_IMAGES);
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this.GetActivities()} />
                <FlatList style={styles.list}
                    data={this.props.ActivitiesList}
                    initialNumToRender={5}
                    showsHorizontalScrollIndicator={false}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}

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
                        var image = <View></View>

                        if (item.source.uri.includes('default.jpg') === false) {
                            image=<ImageModal
                            resizeMode="cover"
                            modalImageResizeMode="contain"
                            imageBackgroundColor="#fff"
                            style={{
                              width: width - 38,
                              height: 250,
                            }}
                            source={{
                              uri: item.source.uri,
                            }}
                            />
                            // image = <View>
                            //     <TouchableOpacity key={item.Sr} onPress={() => {
                            //         this.setState({
                            //             imageIndex: item.Sr - 1,
                            //             isImageViewVisible: true,
                            //         });
                            //     }}
                            //     >

                            //         <Image
                            //             style={{ width: '100%', height: 125, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                            //             source={item.source}
                            //             resizeMode="cover"
                            //         />


                            //     </TouchableOpacity>
                            // </View>
                        }
                        // if (item.id != 11) {

                        return (
                            <View style={{ ...styles.card, borderColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>
                                {image}
                                <View style={styles.cardHeader}>

                                    <View >
                                        <View style={styles.innerContaineSecondColumn}>
                                            <Text style={styles.title}>{item.Title}</Text>
                                            <Text style={styles.classStyle}>Class: {item.ClassName}</Text>
                                            <Text style={styles.description}>{item.Description}</Text>
                                            

                                        </View>
                                        <View style={{...styles.innerContaineSecondColumn, flexDirection: 'row'}} >

                                            <View >
                                                <Text style={{ ...styles.timeAgo, color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>{item.CreatedDate}</Text>
                                            </View>
                                            

                                        </View>
                                    </View>
                                    <View >
                                                {this.props.SelectedUser.UserType === Constants.UserType.Admin || this.props.SelectedUser.UserType === Constants.UserType.Teacher ? <View s>
                                                    <TouchableOpacity key={item.Id} onPress={() => this.clickEventListener(item)}  >
                                                        <Icon name="md-trash" color="red" size={28} />
                                                    </TouchableOpacity>
                                                </View> : <View />}
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

                        )
                        // }
                        // else {
                        //     const item = post.item;
                        //     return (



                        //         <View style={styles.card}>

                        //             <View style={styles.cardHeader}>
                        //                 <View>
                        //                     <Text style={styles.title}>{item.title}</Text>
                        //                     <Text style={styles.description}>{item.description}</Text>
                        //                 </View>
                        //             </View>
                        //         </View>

                        //     )
                        // }
                    }} />
{/* 
                <ImageView
                    glideAlways
                    images={this.props.ActivitiesList}
                    imageIndex={this.state.imageIndex}
                    animationType="fade"
                    isVisible={this.state.isImageViewVisible}

                    onClose={() => this.setState({ isImageViewVisible: false })}
                    onImageChange={index => {
                        console.log(index);
                    }}

                /> */}
                {plusButtonShowForTeachers(this.props.SelectedUser, this.props.navigation, Constants.SubRoute.AddActivity)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop:20,
    },
    list: {
        paddingHorizontal: 17,
        backgroundColor: "#E6E6E6",
    },
    separator: {
        marginTop: 7,
    },
    /******** card **************/
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 6,
        backgroundColor: "white",
        borderRadius: 8,
        // borderColor: Constants.Colors.headerBackColor,
        borderWidth: 2

    },
    cardHeader: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        // borderRadius:8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "#EEEEEE",
    },
    cardImage: {
        flex: 1,
        height: 150,
        width: null,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    /******** card components **************/
    title: {
        fontSize: 17,
        flex: 1,
        marginTop: -10,
        color: Constants.Colors.cardBlackColor,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16,
        color: Constants.Colors.CardGrayColor,
        flex: 1,
        // marginTop: 5,
         marginBottom: 2,
    },
    classStyle: {
        fontSize: 15,
        color: Constants.Colors.cardBlackColor,
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 2

    },
    time: {
        fontSize: 13,
        color: "#808080",
        marginTop: 5
    },
    icon: {
        width: 25,
        height: 25,
    },
    iconData: {
        width: 15,
        height: 15,
        marginTop: 5,
        marginRight: 5
    },
    timeContainer: {
        flexDirection: 'row'
    },
    /******** social bar ******************/
    socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarlabel: {
        marginLeft: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        // flexDirection: "row",
        // marginRight:20,
        // marginRight: 30,
        // paddingRight: 30
    },
    innerContaineSecondColumn: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 10,
        marginRight: 30,



    },
    // floatButton: {
    //     borderWidth: 1,
    //     borderColor: "rgba(0,0,0,0.2)",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     width: 60,
    //     position: "absolute",
    //     bottom: 10,
    //     right: 10,
    //     height: 60,
    //     backgroundColor: Constants.Colors.headerBackColor,
    //     borderRadius: 100
    // },
});

const mapStateToProps = (state) => {
    return {
        ActivitiesList: state.reducerActivities.ActivitiesList,
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

export default connect(mapStateToProps, mapDispatchToProps)(Activity);