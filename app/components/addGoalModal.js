import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import GenerateForm from 'react-native-form-builder';
import { Input } from "native-base";
import { Button } from 'react-native-elements'

export default class askQuestionModal extends React.Component {
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
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Add a Goal
          </Text>
          <Input style={ styles.inputText }
              placeholder="Apply to 10 schools"
              underlineColorAndroid="transparent"
              multiline={true}
              onChangeText={this.props.onChangeText}
              onSubmitEditing={this.props.onSubmitEditing}
              />
          <Button
            buttonStyle={styles.addBtn}
            title='Add'
            onPress={this.props.onPress}/>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    height: Metrics.screenHeight/3,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 40
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  addBtn: {
    backgroundColor : Colors.lightPurple, 
    width : Metrics.screenWidth * .8, 
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 20, margin : 10
  },
  inputText: {
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
  }
});
