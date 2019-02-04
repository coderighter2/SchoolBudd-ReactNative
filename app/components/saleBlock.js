import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import { WebBrowser } from 'expo';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import metrics from '../Themes/Metrics';


export default class SaleBlock extends React.Component {

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
      skypeTest: 'amandaorbuch',
      name: '',
      profilePicture: '',
      cityState: '',
      schoolName: '',
      skypeUsername: '',
      getHeight: '',
      getWidth: '',
      ration: null,
    }

    //console.log(JSON.stringify("saleblock props " + JSON.stringify(props)));
  }

  openConsultantScreen() {
    //console.log('pressed ');
    this.props.selectConsultant(this.props.jedi);
  }

  componentWillMount =async() => {
    //console.log("SaleBlock page open");
    var that = this;
    await firebase.database().ref('users').child(this.props.jedi.key).on('value', (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      that.setState({ name: childData.name, cityState: childData.cityState, profilePicture: childData.profilePicture,
        schoolName: childData.schoolName, skypeUsername: childData.skypeUsername});
      if(childData.profilePicture) {
        Image.getSize(childData.profilePicture, (width, height) => {this.setState({getWidth: width, getHeight:height, ration: width/Metrics.screenWidth})});
      }
    });
  }

  onPressMessageSeller = async () => {
    //console.log('testing message seller');

    var url;
    if (this.state.skypeUsername !== "") {
      url = 'skype://' + this.state.skypeUsername + '?chat';

      Linking.canOpenURL(url).then(supported => {
      if (supported) {
        alert("Consultant has not set up skype account yet");
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
    } else {
      alert("Consultant has not set up skype account yet");
    }
  }

  onPressBookAppointment(){
    //console.log('testing book appointment');
    this.props.bookAppointment(this.props.jedi);
  }

  openMessageScreen() {
    //console.log("pressed message: ");
    this.props.messageBlock(this.state.convoKey);
  }

  render() {
    return (
      <TouchableOpacity 
      // onPress={() => this.openConsultantScreen()}
      >
        <View style={styles.cardView}>
          <Card style={styles.card}
              image={{uri: this.state.profilePicture}}
              imageStyle={{flex: 1, width: this.state.getWidth/this.state.ration*.92, height: this.state.getHeight/this.state.ration*.92}}
              imageProps={{ resizeMode: 'contain'}}
              >
              <View style={{flexDirection :'row'}}>
                <View style={{flexDirection :'column'}}>
                  <Text style={styles.textStyles}>
                    Name: {this.state.name}
                  </Text>
                  <Text style={styles.textStyles}>
                    Hometown: {this.state.cityState}
                  </Text>
                  <Text style={styles.textStyles}>
                    Affiliation: {this.state.schoolName}
                  </Text>
                  <Text style={styles.textStyles}>
                    Price: ${this.props.jedi.price}/hr
                  </Text>
                </View>
              </View>
              
              <Button
                icon={{name: 'code'}}
                buttonStyle={{backgroundColor : Colors.lightPurple, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 10}}
                title='Book Appointment'
                onPress={() => this.onPressBookAppointment()}/>
              <Button
                icon={{name: 'code'}}
                buttonStyle={{backgroundColor : Colors.lightPurple, borderColor : 'transparent', borderWidth : 0, borderRadius : 20, margin : 10}}
                title='Message Consultant'
                onPress={() => this.onPressMessageSeller()}/>
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
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    flex: 1, 
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
