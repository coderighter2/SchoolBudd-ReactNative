import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, AsyncStorage  } from 'react-native';
import PropTypes from 'prop-types';

import { Button } from 'react-native-elements'
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'

export default class SelectPortalScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  _selectPortalStudent = async() => {
    console.log("props " + JSON.stringify(this.props));
    if (this.props.selectPortalStudent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalStudent();
      } else {
        await AsyncStorage.setItem('portal', 'student');
      }
  }

  _selectPortalConsultant = async() => {
    if (this.props.selectPortalConsultant) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalConsultant();
      } else {
        await AsyncStorage.setItem('portal', 'consultant');
      }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.feedbackBox}>
          <Text style={styles.textStyles}>Are you a student or a consultant?</Text>
          <Button
          title="Students"
          buttonStyle={ styles.selectTxt}
          onPress={this._selectPortalStudent}/>

          <Button
          title="Consultants"
          buttonStyle={ styles.selectTxt}
          onPress={this._selectPortalConsultant}/>

        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    height: Metrics.screenHeight*.35,
    width: Metrics.screenWidth*.5,
    borderRadius: 15
  },
  textStyles : {
    textAlign : 'center',
    fontSize : 20,
    fontWeight : 'bold',
  },
  selectTxt:  {
    backgroundColor : Colors.lightPurple, 
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 20, 
    margin : 15
  }
});
