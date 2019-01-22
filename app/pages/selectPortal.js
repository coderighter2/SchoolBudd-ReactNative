import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, AsyncStorage, TouchableOpacity  } from 'react-native';
import PropTypes from 'prop-types';

import { Button } from 'react-native-elements'
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'
import Images from '../Themes/Images'
import { LinearGradient } from 'expo';

export default class SelectPortalScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      header: null
    }
  };
  

  _selectPortalStudent = async() => {
    console.log("props " + JSON.stringify(this.props));
    if (this.props.selectPortalStudent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalStudent();
    } else {
      await AsyncStorage.setItem('portal', 'student');
      this.props.navigation.navigate('LoginScreen');
    }
  }

  _selectPortalConsultant = async() => {
    if (this.props.selectPortalConsultant) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalConsultant();
      } else {
        await AsyncStorage.setItem('portal', 'consultant');
        this.props.navigation.navigate('LoginScreen');
      }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
          <Image
            style={styles.backgroundImg}
            source={Images.selectPortal_background}
          />
          <Text style={styles.textStyles}>
            Are you a student or a consultant?
          </Text>

          <TouchableOpacity onPress={this._selectPortalStudent}>
            <LinearGradient
                colors={['#CE9FFC', '#7367F0']}
                style={styles.selectBtn}>
                  <Text style={styles.btnTxt}>
                    Students
                  </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={this._selectPortalConsultant}>
            <LinearGradient
                colors={['#CE9FFC', '#7367F0']}
                style={styles.selectBtn}>
                  <Text style={styles.btnTxt}>
                    Consultants
                  </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    color: 'white',
    marginBottom: 25
  },
  selectBtn:  {
    borderColor : 'transparent', 
    borderRadius : 23, 
    margin : 15,
    width: Metrics.screenWidth * .8,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTxt: {
    fontSize : 20,
    color: 'white',
  },
  backgroundImg: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0
  }
});
