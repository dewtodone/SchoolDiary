import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback,YellowBox, Dimensions, StatusBar, Picker, Button,FlatList,Linking } from 'react-native';
import Constants from '../../utils/Constants';

import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import GLOBAL_PATH from './../../utils/GlobalPath';
import randomColor from 'random-color';
import axios from 'axios';
import { Card, Right } from 'native-base';
class Academic extends Component {

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
        ExamAssesssmentList: [],
        RandomColors: [],
        // GeneralNotesModalVisible: false,
        GeneralNotes: ``,
        modalVisible: false,
        userSelected: [],
    }
}
componentDidMount() {

  this.GetExamAssessmentList();
}

GetExamAssessmentList = () => {
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

  let UserId = this.props.SelectedUser.Id;
  let url = GLOBAL_PATH.API_URL + Constants.ApiController.ExamAssessmentApi + Constants.Actions.ExamAssessmentApi.GetExamAssessmentList + '?StdId=' + UserId;
  axios.get(url)
      .then((resp) => {
          let info = resp.data;
          this.setState({ ExamAssesssmentList: info.Info });
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
  this.GetExamAssessmentList();
};



DownloadLectureNotesFiles = (FilePath) => {
  // alert(GlobalPath.BasicApiUrl + FilePath);
  Linking.openURL(GLOBAL_PATH.USER_IMAGE_PATH + FilePath);
}




  render() {

    return (

      <View style={styles.MainContainer}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        { this.props.SelectedUser.ClassLevel != 1?        
        <Text style={styles.text}>Academic Report coming soon</Text> :
        <View>
          <FlatList
                    data={this.state.ExamAssesssmentList}
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
                            width: 75, height: 75, borderRadius: 50, backgroundColor: this.state.RandomColors[moment(item.AssessmentDate).format('D')], alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <View style={styles.innerContainerFirstColumn} >
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.AssessmentDate).format('DD')}
                                </Text>
                            </View>
                            <View style={styles.innerContainerFirstColumn}>
                                <Text style={{ ...styles.contactIcon, color: Constants.Colors.FullBlackColor }}>
                                    {moment(item.AssessmentDate).format('MMM')}
                                </Text>
                            </View>
                        </View>
                        let OtherData = <View style={styles.infoContainer}>
                            <View style={styles.innerContaineSecondColumn}>
                                <Text style={styles.infoMainText}>
                                    {item.WeekNo}
                                </Text>
                            </View>
                            <View style={{...styles.innerContaineSecondColumn,marginRight: 35 }}>
                                <Text style={styles.infoSubText}  numberOfLines={3}>
                                    {item.Comments}
                                </Text>
                            </View>

                            <View style={{ ...styles.innerContaineSecondColumn, marginRight: 10, marginTop: 5 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
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
                                    </View>}
                                </View>
                            </View>
                        </View>
                        
                        return ( 
                            <Card style={styles.listItem}>
                                {imageOrDates}
                                {OtherData}

                            </Card>
                        );
                    }}
                />



               
        </View>
        }
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
      padding: 10,
      marginLeft:10,
      marginRight:10,
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
      fontSize: 12,
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
      paddingRight:35
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


export default connect(mapStateToProps, null)(Academic);
