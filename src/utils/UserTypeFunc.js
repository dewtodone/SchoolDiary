import React from 'react';
import Constants from './Constants';
import Entypo from 'react-native-vector-icons/Entypo';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import axios from 'axios';
export const getStudentOrClassName = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        return SelectedUser.StudentName;
    }
    else {
        return SelectedUser.ClassName;
    }
}

export const getClassName = (SelectedUser) => {
    return SelectedUser.ClassName;
}

export const getUserId = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        return SelectedUser.StudentUserId;
    }
    else {
        return SelectedUser.UserId;
    }
}


export const getStudentOrTeacherName = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        return SelectedUser.StudentName;
    }
    else {
        return SelectedUser.TeacherName;
    }
}


export const getStdId = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        return SelectedUser.Id;
    }
    else {
        return 0;
    }
}



export const getClassOrStdId = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        return SelectedUser.Id;
    }
    else {
        return SelectedUser.ClassId;
    }
}

export const RemoveAllClasses = (lstClasses, UserType) =>{
    if (UserType === Constants.UserType.Teacher || UserType === Constants.UserType.Admin){
        if (lstClasses[0].label === "All Classes"){
            lstClasses.splice(0,1);
        }
    }

    return lstClasses;
}


export const getClassId = (SelectedUser, List) => {
    return SelectedUser.ClassId;
}

export const getClassIdIfTeacher = (SelectedUser) => {
    if (SelectedUser.UserType === Constants.UserType.Teacher || SelectedUser.UserType === Constants.UserType.Admin) {
        return SelectedUser.ClassId;
    } else {
        return 0;
    }
}

export const getStudentOrClassList = (List) => {
    let lst = [];
    if (List) {
        List.forEach(function (entry) {
            var studentOrClass = {}
            studentOrClass['label'] = entry.UserType === Constants.UserType.Parent ? entry.StudentName + ' (' + entry.ClassName + ')' : entry.ClassName;
            studentOrClass['value'] = entry.UserType === Constants.UserType.Parent ? entry.Id : entry.ClassId;
            lst.push(studentOrClass);
        });
    }
    return lst;
}


export const plusButtonShowForTeachers = (SelectedUser, navigation, router) => {
    let plusButton = <View />
    if (SelectedUser.UserType === Constants.UserType.Teacher || SelectedUser.UserType === Constants.UserType.Admin) {
        plusButton = plusButtonFunc(navigation, router,SelectedUser.ClassLevel);
        // plusButton = <TouchableOpacity
        //     style={styles.floatButton}
        //     onPress={() => {
        //         this.props.navigation.navigate("AddLeaves");
        //     }}
        // >
        //     <Entypo name="plus" size={30} color={Constants.Colors.yellowColor} />
        // </TouchableOpacity>
    }
    return plusButton;
}

export const plusButtonShowForOnlyAdmins = (SelectedUser, navigation, router) => {
    let plusButton = <View />
    if (SelectedUser.UserType === Constants.UserType.Admin) {
       
        plusButton = plusButtonFunc(navigation, router,SelectedUser.ClassLevel);
        // plusButton = <TouchableOpacity
        //     style={styles.floatButton}
        //     onPress={() => {
        //         this.props.navigation.navigate("AddLeaves");
        //     }}
        // >
        //     <Entypo name="plus" size={30} color={Constants.Colors.yellowColor} />
        // </TouchableOpacity>
    }
    return plusButton;
}

export const plusButtonShowForParents = (SelectedUser, navigation, router) => {
    let plusButton = <View />
    if (SelectedUser.UserType === Constants.UserType.Parent) {
        plusButton = plusButtonFunc(navigation, router,SelectedUser.ClassLevel);
    }
    return plusButton;
}


export const plusButtonFunc = (navigation, route, ClassLevel) => {
    plusButton = <TouchableOpacity
        style={{...styles.floatButton,   backgroundColor: ClassLevel === 1? Constants.Colors.headerBackColor : Constants.Colors.headerBackColorBlue}}
        onPress={() => {
            navigation.navigate(route);
        }}
    >
        <Entypo name="plus" size={30} color={ClassLevel === 1? Constants.Colors.yellowColor : Constants.Colors.whiteColor} />
    </TouchableOpacity>

    return plusButton;
}

export const DeviceUniqueId =() =>{
   return DeviceInfo.getUniqueId();
}

export const GetRandomColors=(number) => {
    let url = 'http://www.colr.org/json/colors/random/'+number;
        axios.get(url)
            .then((resp) => {
                
                return resp;
            })//Then Call back respAppVersion
            .catch((error) => {
                alert(error)
                console.log(error);
            });

}

const styles = StyleSheet.create({
    floatButton: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 60,
        borderRadius: 100
    },
});

