import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements'
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'
import { LinearGradient } from 'expo';

export default class Home extends React.Component {


  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Four Year Plan',
      title: 'Four Year Plan',
      }
  };

  constructor(props) {
    super(props);
    this.state = {
    }
    //see what props App.js is constructed with:
    console.log("goals timeline " + JSON.stringify(props));
  }

  navigateFreshmanYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Freshman'});
  }

  navigateSophomoreYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Sophomore'});
  }

  navigateJuniorYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Junior'});
  }

  navigateSeniorYear= async() =>{
    this.props.navigation.navigate("TimelineSheet", {year: 'Senior'});
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >

        <TouchableOpacity onPress={() => this.navigateFreshmanYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#8338af', '#4d2c7d']}
              style={styles.yearItem}>
              <View style = {styles.circleView}>
                <Text style = {[styles.numberTxt, {color: '#8338af'} ]}>1</Text>
              </View>
              <Text style={styles.btnTxt}>
                Freshman Year
              </Text>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.navigateSophomoreYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#c83dd0', '#8227aa']}
              style={styles.yearItem}>
              <View style = {styles.circleView}>
                <Text style = {[styles.numberTxt, {color: '#c83dd0'} ]}>2</Text>
              </View>
              <Text style={styles.btnTxt}>
                Sophomore Year
              </Text>
            </LinearGradient>
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => this.navigateJuniorYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#cd37bb', '#c03dc5']}
              style={styles.yearItem}>
              <View style = {styles.circleView}>
                <Text style = {[styles.numberTxt, {color: '#cd37bb'} ]}>3</Text>
              </View>
              <Text style={styles.btnTxt}>
                Junior Year
              </Text>
            </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.navigateSeniorYear()}>
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={['#e2b0ff', '#9f44d3']}
              style={styles.yearItem}>
              <View style = {styles.circleView}>
                <Text style = {[styles.numberTxt, {color: '#e2b0ff'} ]}>4</Text>
              </View>
              <Text style={styles.btnTxt}>
                Senior Year
              </Text>
            </LinearGradient>
        </TouchableOpacity> 
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50
  },
  yearItem: {
    backgroundColor : Colors.lightPurple, 
    width : 300,
    height: 50,
    borderRadius : 25, 
    margin : 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOffset: { height: 3, width: 3},
  },
  btnTxt: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#fff',
  },
  circleView: {
    backgroundColor: 'white',
    // borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 25,
    position:  'absolute',
    left: 5
  },
  numberTxt: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
