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
    Button,Dimensions
} from 'react-native';

import ImageView from 'react-native-image-view';

const { width } = Dimensions.get('window');

export default class Blog extends Component {

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: 'Activity'           
    //     };
    // };
    // static navigationOptions = ({ navigation, navigationOptions }) => {


    //     return {
    //         headerLeft: () => (
    //             <View style={{ marginLeft: 20 }}>
    //                 <Button
    //                     onPress={ () => {

    //                         this.props.navigation.setParams({
    //                           Title: 'New Activity Title'
    //                         });
    //                     } }
    //                     title="Menu"
    //                 />
    //                 <Text>{navigation.getParam('Title', 'Default Title')}</Text>
    //             </View>
    //         ),
    //         //title: params ? params.otherParam : 'A Nested Details Screen',
    //         /* These values are used instead of the shared configuration! */
    //         //   headerStyle: {
    //         //     backgroundColor: navigationOptions.headerTintColor,
    //         //   },
    //         //   headerTintColor: navigationOptions.headerStyle.backgroundColor,
    //     };
    // };

    // static navigationOptions =  {

    //     headerLeft: () => (
    //         <View style={{marginLeft:20}}>
    //         <Button
    //           onPress={() => alert('This is a button!')}
    //           title="Menu"

    //         />
    //         <Text >{this.state.User}</Text>
    //         </View>
    //       ),
    // };



    constructor(props) {
        super(props);
        this.state = {
            imageIndex : 0,
            isImageViewVisible: false,
            data: [
                { id: 1, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source:{ uri: "https://lorempixel.com/800/600/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 2, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 3, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 4, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 5, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 6, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 7, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 8, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 9, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 41, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 42, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 43, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 44, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 45, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 46, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 47, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 48, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 49, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 11, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 12, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 13, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 14, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 15, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 16, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 17, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 18, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 19, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 21, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 22, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 23, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 24, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 25, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 26, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 27, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 28, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 29, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 31, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 32, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 33, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 34, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 35, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 36, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 37, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 38, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 39, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 11, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 12, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 13, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 14, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 15, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 16, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 17, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 18, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 19, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 141, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 142, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 143, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 144, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 145, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 146, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 147, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 148, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 149, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 111, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 112, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 113, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 114, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 115, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 116, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 117, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 118, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 119, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 121, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 122, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 123, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 124, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 125, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 126, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 127, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 128, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 129, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
                { id: 131, title: "Lorem ipsum dolor", time: "2018-08-01 12:15 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean  ligula..." },
                { id: 132, title: "Sit amet, consectetuer", time: "2018-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/5/"}, description: "Lorem  dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 133, title: "Dipiscing elit. Aenean ", time: "2017-08-05 12:21 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit , consectetuer  elit. Aenean commodo ligula..." },
                { id: 134, title: "Commodo ligula eget dolor.", time: "2015-08-12 12:00 pm", source: { uri: "https://lorempixel.com/400/200/nature/6/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 135, title: "Aenean massa. Cum sociis", time: "2013-06-12 12:11 pm", source: { uri: "https://lorempixel.com/400/200/sports/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 136, title: "Natoque penatibus et magnis", time: "2018-08-12 12:56 pm", source: { uri: "https://lorempixel.com/400/200/nature/8/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 137, title: "Dis parturient montes, nascetur", time: "2018-08-12 12:33 pm", source: { uri: "https://lorempixel.com/400/200/nature/1/"}, description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula..." },
                { id: 138, title: "Ridiculus mus. Donec quam", time: "2018-06-12 12:44 pm", source: { uri: "https://lorempixel.com/400/200/nature/3/"}, description: "Lorem ipsum  sit amet, consectetuer adipiscing elit.  commodo ligula..." },
                { id: 139, title: "Felis, ultricies nec, pellentesque", time: "2012-07-12 12:23 pm", source: { uri: "https://lorempixel.com/400/200/nature/4/"}, description: "Lorem ipsum dolor sit amet, consectetuer  elit. Aenean commodo ligula..." },
            ]
        };
    }

    render() {

        return (
            <View style={styles.container}>

                <FlatList style={styles.list}
                    data={this.state.data}
                    initialNumToRender={5}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator} />
                        )
                    }}
                    renderItem={(post,index) => {
                        const item = post.item;
                        return (
                            <View style={styles.card}>
                                <View>
                                    {/* <Text style={{ color: 'white' }}>{index}</Text> */}
                                    <TouchableOpacity
                                        key={item.title}
                                        onPress={() => {
                                            //alert(item.id);
                                            this.setState({
                                                
                                                imageIndex: item.id - 1,
                                                isImageViewVisible: true,
                                            });
                                        }}
                                    >
                                        <Image
                                            style={{ width, height: 125 }}
                                            source={ item.source }
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* <Image style={styles.cardImage} source={{ uri: item.image }} /> */}
                                <View style={styles.cardHeader}>

                                    <View>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.description}>{item.description}</Text>
                                        {/* <View style={styles.timeContainer}>
                      <Image style={styles.iconData} source={{uri: 'https://png.icons8.com/color/96/3498db/calendar.png'}}/>
                      <Text style={styles.time}>{item.time}</Text>
                    </View> */}
                                    </View>
                                </View>
                                {/* <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image style={styles.icon} source={{uri: 'https://png.icons8.com/material/96/2ecc71/visible.png'}}/>
                        <Text style={styles.socialBarLabel}>78</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image style={styles.icon} source={{uri: 'https://png.icons8.com/ios-glyphs/75/2ecc71/comments.png'}}/>
                        <Text style={styles.socialBarLabel}>25</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}
                            </View>
                        )
                    }} />

                <ImageView
                    glideAlways
                    images={this.state.data}
                    imageIndex={this.state.imageIndex}
                    animationType="fade"
                    isVisible={this.state.isImageViewVisible}

                    onClose={() => this.setState({ isImageViewVisible: false })}
                    onImageChange={index => {
                        console.log(index);
                    }}
                />
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
        marginTop: 10,
    },
    /******** card **************/
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: "white",
        borderRadius: 4,
    },
    cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
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
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
        backgroundColor: "#EEEEEE",
    },
    cardImage: {
        flex: 1,
        height: 150,
        width: null,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
    },
    description: {
        fontSize: 15,
        color: "#888",
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
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
    }
});   