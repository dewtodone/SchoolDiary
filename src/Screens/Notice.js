import React, { Component } from 'react';

import { StyleSheet, Platform, View, Text, Image, TouchableOpacity, YellowBox, Dimensions, StatusBar, Picker, Button,FlatList } from 'react-native';

import ImageView from 'react-native-image-view';

const { width } = Dimensions.get('window');
class Notice extends Component {

   
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
      isImageViewVisible: false,
      data:[
        {id:1, source: { uri: "https://bootdey.com/img/Content/avatar/avatar7.png" }, name:"March", text:"Lorem ipsum d.", attachment:"https://lorempixel.com/100/100/nature/6/"},
        {id:2, source: { uri: "https://bootdey.com/img/Content/avatar/avatar6.png"}, name:"John ",     text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:"https://lorempixel.com/100/100/nature/5/"},
        {id:3, source: { uri:"https://bootdey.com/img/Content/avatar/avatar2.png"}, name:"Finn ",  text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:""},
        {id:4, source: { uri:"https://bootdey.com/img/Content/avatar/avatar3.png"}, name:"Maria ",  text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:""},
        {id:5, source: { uri: "https://bootdey.com/img/Content/avatar/avatar1.png"}, name:"Frank Odalthh",    text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:"https://lorempixel.com/100/100/nature/4/"},
        {id:6, source: { uri: "https://bootdey.com/img/Content/avatar/avatar4.png"}, name:"Clark June Boom!", text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:""},
        {id:7, source: { uri: "https://bootdey.com/img/Content/avatar/avatar5.png"}, name:"The googler",      text:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", attachment:""},
      ]
    }
  }

  render() {
    return (
      <View>
      <FlatList
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id;
        }}
        renderItem={(item) => {
          const Notification = item.item;
          let attachment = <View/>;
         
          let mainContentStyle;
          // if(Notification.attachment) {
          //   mainContentStyle = styles.mainContent;
          //   attachment = <Image style={styles.attachment} source={{uri:Notification.attachment}}/>
          // }
          return(
            <View style={styles.container}>
                  <TouchableOpacity key={item.title} onPress={() => {
                
                            this.setState({
                                imageIndex: Notification.id - 1,
                                isImageViewVisible: true,
                            });
                        }}
                        >

                            <Image
                               source={{uri: item.item.source.uri}} style={styles.avatar}
                                resizeMode="cover"
                            />

                        </TouchableOpacity>
              {/* <Image source={{uri:Notification.image}} style={styles.avatar}/> */}
              <View style={styles.content}>
                <View style={mainContentStyle}>
                  <View style={styles.text}>
                      <Text style={styles.name}>{Notification.name}{asdasdasd}</Text>
                    <Text>{Notification.text}</Text>
                  </View>
                  <Text style={styles.timeAgo}>
                    2 hours ago
                  </Text>
                </View>
               
              </View>
            </View>
          );
        }}/>
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
  root: {
    backgroundColor: "#FFFFFF"
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: 'flex-start'
  },
  avatar: {
    width:100,
    height:50,
    //borderRadius:25,
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap:'wrap'
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0
  },
  mainContent: {
    marginRight: 60
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
    backgroundColor: "#CCCCCC"
  },
  timeAgo:{
    fontSize:12,
    color:"#696969"
  },
  name:{
    fontSize:16,
    color:"#1E90FF"
  }
});  
  export default Notice;