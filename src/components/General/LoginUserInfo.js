
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

export const getUserInfo = async () => {
    var value = await AsyncStorage.getItem('NgsSd:LoginUserInfo');
    var PlayerId = await AsyncStorage.getItem('NgsSd:OneSignalPlayerId');
    var userInfo = {};
    userInfo = JSON.parse(value);    
    let obj = {
        "UserInfo": userInfo,
        "PlayerId" : PlayerId
    };
    return obj;
}

// async getUserInfo() {
//     var value = await AsyncStorage.getItem('NgsSd:LoginUserInfo');
//     var userInfo = JSON.parse(value);
//     return {
//         UserInfo : userInfo
//     }
// }


export const setUserInfo = async (username, password) => {
    var UserInfo = {
        Username: username,
        Password: password
    };
    await AsyncStorage.setItem('NgsSd:LoginUserInfo', JSON.stringify(UserInfo))
        .then(() => {
            return 'ok';
        })
        .catch(error => {
            console.log(error);
            return error;
        });
}

export const setOneSignalPlayerId = async (PlayerId) => {
    await AsyncStorage.setItem('NgsSd:OneSignalPlayerId', PlayerId)
        .then(() => {
            return 'ok';
        })
        .catch(error => {
            console.log(error);
            return error;
        })

}

export const getOneSignalPlayerId = async () => {
    var PlayerId = await AsyncStorage.getItem('NgsSd:OneSignalPlayerId')
   
    return PlayerId;

}



export const removeUserInfo = () => {
    AsyncStorage.removeItem('NgsSd:LoginUserInfo');
}

export const OneSignalInitialized = () => {
    OneSignal.init('352bacb9-bac2-4942-9c70-432d4b7d8709', {
        kOSSettingsKeyAutoPrompt: true,
    });
    //352bacb9-bac2-4942-9c70-432d4b7d8709  apple one signal key
    //
    // OneSignal.init('77218782-8c69-437e-805f-240623ce8198', {
    //     kOSSettingsKeyAutoPrompt: true,
    // });

    return OneSignal;
}

