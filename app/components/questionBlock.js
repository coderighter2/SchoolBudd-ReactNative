import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';


export default class QuestionBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
      convoKey: '',
      userName: '',
      sellerName: '',
      previousMessage: false,
      isModalVisible: false,
    }

    console.log(JSON.stringify("questionblock props " + JSON.stringify(props)));
  }

  openConsultantScreen() {
    console.log('pressed ');
    this.props.purchaseItem(this.props.jedi);
  }

  onPressMessageSeller = async () => {
    console.log('testing message seller');

    await this.rememberMessage();
    await this.add();
    console.log("convokey: " + this.state.convoKey);
    this.openMessageScreen();
    this.props.navigation.navigate('MessagesScreen', {key: this.state.convoKey});
    //query
  }

  openMessageScreen() {
    console.log("pressed message: ");
    this.props.messageBlock(this.state.convoKey);
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.openConsultantScreen()}>
        <View style={styles.cardView}>
          {/* <Card style={styles.card}> */}
              <Text style={styles.questionTxt}>
                {this.props.jedi.question}
              </Text>
              <View style={{flexDirection : 'row', alignItems: 'center'}}>
                <Avatar
                  size="large"
                  source={this.props.jedi.profileImage?{uri : this.props.jedi.profileImage}:Images.profile}
                  activeOpacity={0.7}
                  rounded
                />
                <Text style={styles.authorTxt}>{this.props.jedi.author}</Text>
              </View>
              
              <Text style={styles.topicTxt}>
                Topic : {this.props.jedi.topic}
              </Text>
          {/* </Card> */}

        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.snow,
    padding: 15
  },
  authorTxt: {
    fontSize : 17, 
    marginLeft :15, 
    fontWeight : '200', 
  },
  questionTxt: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom : 10, 
  },
  topicTxt: {
    fontSize: 13,
    color : '#888', 
    marginTop : 10, 
  }
});
