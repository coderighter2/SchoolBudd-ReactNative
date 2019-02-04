import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import GenerateForm from 'react-native-form-builder';
import { Input } from "native-base";
import { Button } from 'react-native-elements'

export default class confirmAppointmentModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.onBackdropPress}
        backdropColor={'black'}>
        <View style={styles.modalViewQuestion}>
          <Text style={styles.modalText}>
            Confirm Appointment!
          </Text>
          <Text style={{fontSize : 15, marginTop: 5}}>
            Timeslot(s): {this.state.timeslotsArrayString}
          </Text>
          <Text style={{fontSize : 15}}>
            Price: ${this.props.preFeePrice}{'\n'}
            Fees: ${this.props.fees}{'\n'}
            Total Price: ${this.props.totalPrice} total
          </Text>
          <Input style={styles.inputTxt}
            placeholder="Goal of Appointment (ex: Essay Editing)"
            underlineColorAndroid="transparent"
            onChangeText={this.props.onChangeText}
            onSubmitEditing={this.props.onSubmitEditing}
            />
        <Button
          buttonStyle={styles.bookBtn}
          title='Book'
          onPress={this.props.onPress}/>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalViewQuestion: {
    height: Metrics.screenHeight*.4,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  bookBtn: {
    backgroundColor : Colors.lightPurple, 
    width : Metrics.screenWidth * .8, 
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 15, 
    margin : 10
  },
  inputTxt: {
    width: '100%',
    alignContent: "flex-start",
    justifyContent: "flex-start",
    minHeight: 40,
    textAlignVertical: "top",
    padding: 10,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    backgroundColor: 'white',
    marginTop: 10
  }
});
