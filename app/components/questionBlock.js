import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
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
    // const { navigate } = this.props.navigation;
    // console.log("testing params" + this.props.navigation.state.params.item.seller);
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'Messages',
    //   params: {item: this.props.navigation.state.params.item},
    //   action: NavigationActions.navigate({routeName: 'MessagesScreen',params: {}}),
    // });
    // this.props.navigation.dispatch(navigateAction);
     // var key =
    // await AsyncStorage.multiRemove();
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

  imageButton() {
    if(this.props.jedi.profileImage){
      return(
        <Avatar
        size="large"
        source={{uri : this.props.jedi.profileImage}}
        activeOpacity={0.7}
        rounded
      />
      );
    } else {
      return(
        <Avatar
        size="large"
        source={Images.profile}
        activeOpacity={0.7}
        rounded
      />
      )
    }
  }
  render() {
          return (
            <TouchableOpacity onPress={() => this.openConsultantScreen()}>
              <View style={styles.cardView}>
                <Card style={styles.card}>
                    <View style={{flexDirection : 'row'}}>
                      {this.imageButton()}
                      <Text style={{fontSize : 15, marginLeft :20, fontWeight : '200', lineHeight : 30}}>{this.props.jedi.author}</Text>
                    </View>
                    <Text style={{fontSize: 18, marginLeft : 15, fontWeight: 'bold', marginTop : 10, marginBottom : 10, marginRight : 20}}>
                      {this.props.jedi.question}
                    </Text>
                    <Text style={{fontSize: 13, marginLeft : 15, color : '#888', marginTop : 0, marginBottom : 10, marginRight : 20}}>
                     Topic : {this.props.jedi.topic}
                    </Text>
                    </Card>

              </View>
            </TouchableOpacity>
            );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
  },
  pictureDetails: {
    flexDirection: 'column',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
});
