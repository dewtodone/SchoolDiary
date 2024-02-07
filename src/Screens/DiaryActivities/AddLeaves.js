import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, Keyboard, Platform } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import { Container, Form, Item, Input, Label, Button, Icon, Radio, Left, Right, List, ListItem, DatePicker } from 'native-base';

import Constants from '../../utils/Constants';
import { saveLeaveRequest } from '../../store/actions/index';
import { connect } from 'react-redux';

import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import { HeaderBackButton } from "react-navigation-stack";

class AddLeaves extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton tintColor={navigation.getParam('ClassLevel') === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor} onPress={_ => navigation.navigate("ApplyForLeave")} />),
            headerStyle: {
                backgroundColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue
            },
            headerTintColor: navigation.getParam('ClassLevel') === 1 ? Constants.Colors.headerColor : Constants.Colors.whiteColor,
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            leavesTypeSelected: '',
            chosenStartDate: '',
            chosenEndDate: '',
            Reason: ''
        }

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({ ClassLevel: this.props.SelectedUser.ClassLevel });
    }
    setStartDate(newDate) {
        // if (Platform.OS === Constants.Platform.ios){
        //     alert(newDate);
        // }
        this.setState({ chosenStartDate: newDate });
    }

    setEndDate(newDate) {
        this.setState({ chosenEndDate: newDate });
    }

    SaveLeaveRequestHandler = () => {

        if (this.state.leavesTypeSelected === '') {
            alert('Please Select Leave Type');
        }
        else if (this.state.chosenStartDate === '') {
            alert('Please select start date');
        }
        else if (this.state.chosenEndDate === '') {
            alert('Please select end date');
        }
        else if (this.state.Reason === '') {
            alert('Please enter reason');
        }
        else if (this.state.chosenStartDate > this.state.chosenEndDate) {
            alert('Start Date must be less than End Date');
        }
        else {
            let LeavesRequest = {
                LeavesType: this.state.leavesTypeSelected,
                // StartDate: '12/12/2019',
                // EndDate: '12/12/2019',
                StartDate: moment(this.state.chosenStartDate).format("MM/DD/YYYY"),
                EndDate: moment(this.state.chosenEndDate).format("MM/DD/YYYY"),
                Reason: this.state.Reason,
                StudentId: this.props.SelectedUser.Id,
                ClassId: this.props.SelectedUser.ClassId,
                CreatedBy: this.props.SelectedUser.UserId
                // Id : 1,
                // CreatedDate : '12/12/2019',
                // UpdatedDate : '12/12/2019',
            }
            this.props.onSaveLeaveRequest(LeavesRequest, this.props);
            // this.setState({
            //     leavesTypeSelected: '',
            //     chosenStartDate: '',
            //     chosenEndDate: '',
            //     Reason: ''
            // });
        }

    };
    render() {
        return (
            <Container>
                <NavigationEvents onDidFocus={() => this.componentDidMount()} />
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss;
                    }}
                >
                    {/* <SweetAlert
            show={this.state.show}
            title="Demo"
            text="SweetAlert in React"
            onConfirm={() => this.setState({ show: false })}
          /> */}

                    <ScrollView style={styles.container} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>

                        <Form>
                            {/* <Item style={styles.inputItem} floatingLabel> */}

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <MaterialCommunityIcons name='file-document-edit-outline' size={24} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 6 }}>Leave Type</Label>
                            </View>


                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: '10%', paddingTop: 15 }}>
                                <TouchableWithoutFeedback onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Sick })}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                        <View>
                                            <Radio
                                                selected={this.state.leavesTypeSelected == Constants.LeavesType.Sick} />
                                        </View>
                                        <View style={{ paddingLeft: 10 }}>
                                            <Text >{Constants.LeavesType.Sick}</Text>
                                        </View>

                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Urgent })}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Radio onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Urgent })}
                                            selected={this.state.leavesTypeSelected == Constants.LeavesType.Urgent} />
                                    </View>
                                    <View style={{ paddingLeft: 10 }}>
                                        <Text >{Constants.LeavesType.Urgent}</Text>
                                    </View>
                                </View>
                                </TouchableWithoutFeedback>
                            </View>
                           
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: '10%', paddingTop: 15 }}>
                            <TouchableWithoutFeedback onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Causal })}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Radio onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Causal })}
                                            selected={this.state.leavesTypeSelected == Constants.LeavesType.Causal} />
                                    </View>
                                    <View style={{ paddingLeft: 10 }}>
                                        <Text >{Constants.LeavesType.Causal}</Text>
                                    </View>
                                </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Other })}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Radio onPress={() => this.setState({ leavesTypeSelected: Constants.LeavesType.Other })}
                                            selected={this.state.leavesTypeSelected == Constants.LeavesType.Other} />
                                    </View>
                                    <View style={{ paddingLeft: 10 }}>
                                        <Text >{Constants.LeavesType.Other}</Text>
                                    </View>
                                </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={{...styles.separator, backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}></Text>
                            {/* <Input 
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={fname => this.setState({ fname })}
                  /> */}
                            {/* </Item> */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 10 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <Icon name='md-time' size={24} style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, paddingTop: 1 }}>Date</Label>
                            </View>
                            <Item style={styles.inputItem} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }} stackedLabel>

                                <Label>Select Start Date</Label>
                                {/* <View style={{flex:1, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}> */}
                                <DatePicker
                                    defaultDate={new Date()}
                                    // minimumDate={new Date(2018, 1, 1)}
                                    // maximumDate={new Date(2018, 12, 31)}
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={300}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"spinner"}
                                    placeHolderText="Select start date"
                                    
                                    // textStyle={{ color: Constants.Colors.headerBackColor }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.setStartDate}
                                    disabled={false}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            paddingTop: 6,
                                        }
                                    }}
                                />
                            </Item>

                            <Item style={styles.inputItem} style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }} stackedLabel>

                                <Label>Select End Date</Label>
                                {/* <View style={{flex:1, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}> */}
                                <DatePicker
                                    defaultDate={new Date()}
                                    // minimumDate={new Date(2018, 1, 1)}
                                    // maximumDate={new Date(2018, 12, 31)}
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"spinner"}
                                    placeHolderText="Select end date"
                                    // textStyle={{ color: Constants.Colors.headerBackColor }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.setEndDate}
                                    disabled={false}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            paddingTop: 6,
                                        }
                                    }}
                                />
                            </Item>

                            <Text style={{...styles.separator, backgroundColor: this.props.ClassLevel === 1?  Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}></Text>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 20 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                                    <MaterialCommunityIcons name='text-subject' size={24} color={this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue} />
                                </View>
                                <Label style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue }}>Reason</Label>
                            </View>

                            <Item style={styles.inputItem} >
                                <Input
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Enter Reason"
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onChangeText={Reason => this.setState({ Reason })}
                                />
                            </Item>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                                <Button iconLeft='' rounded style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue, width: '50%' }}
                                    onPress={this.SaveLeaveRequestHandler}
                                >
                                    <Icon name='save' style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor }} />
                                    <Text style={{ color: this.props.SelectedUser.ClassLevel === 1 ? Constants.Colors.yellowColor : Constants.Colors.whiteColor, fontSize: 18, fontWeight: 'bold' }}>Apply</Text>
                                </Button>

                            </View>
                        </Form>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </Container>
        );
    }
};



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

const mapStateToProps = state => {
    return {
        SelectedUser: state.reducerLogin.SelectedUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSaveLeaveRequest: (LeavesRequest, navigationProps) => dispatch(saveLeaveRequest(LeavesRequest, navigationProps))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLeaves);