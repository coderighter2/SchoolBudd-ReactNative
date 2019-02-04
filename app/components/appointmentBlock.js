import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import DataTimes from '../Themes/DataTimes'
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


export default class AppointmentBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      cardSelected: false,
      timeSlot: '',
      currentUserID: '',
      consultantID: '',
      dateString: '',
    }
  }

  componentWillMount= async() => {
    var userUID = firebase.auth().currentUser.uid;
    var name;
    //console.log("uid " + userUID);
    await this.setState({ 
      currentUserID: userUID,
      consultantID: this.props.consultantKey,
      dateString: this.props.dateString,
      timeSlot: this.props.jedi.timeSlot
    });
  }

  storeAppointment= async() => {

    if (!this.state.cardSelected) {
      this.setState({ cardSelected: !this.state.cardSelected});
      const date = this.state.dateString
      const timeSlot = this.state.timeSlot

      var timeSlotArray = await AsyncStorage.getItem('selectedTimeslots');
      timeSlotArray = JSON.parse(timeSlotArray);
      //console.log("test " + JSON.stringify(timeSlotArray));
        if ((await AsyncStorage.getItem("selectedTimeslots") == null) || (timeSlotArray.length == 0)) {
          var selectedTimeslots = [];
          selectedTimeslots.push(timeSlot);
          await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
        } else {
          var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
          //console.log("time slots retrieved " +  JSON.stringify(selectedTimeslots));
          selectedTimeslots = JSON.parse(selectedTimeslots);
          if (!selectedTimeslots.includes(timeSlot)) {
            selectedTimeslots.push(timeSlot);
            await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
          }
          var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
          //console.log("time slots pushed " +  JSON.stringify(selectedTimeslots));
        }
    }  else {
      var selectedTimeslots = await AsyncStorage.getItem('selectedTimeslots');
      selectedTimeslots = JSON.parse(selectedTimeslots);
      var index = selectedTimeslots.indexOf(this.state.timeSlot);
      if (index > -1) {
        selectedTimeslots.splice(index, 1);
      }
      await AsyncStorage.setItem('selectedTimeslots', JSON.stringify(selectedTimeslots));
      console.log("time slots retrieved else" +  JSON.stringify(selectedTimeslots));
      await this.setState({ cardSelected: !this.state.cardSelected});
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.storeAppointment()}>
        <View style={styles.cardView}>
          <Card
            containerStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            wrapperStyle= {this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            title={this.state.dateString}>
            <Text>
              {this.props.jedi.timeSlot}
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
    height: Metrics.screenHeight* .14,
  },
  cardSelected: {
    backgroundColor: Colors.lightPurple,
  },
  cardNotSelected: {
    backgroundColor: 'white',
  },
});
