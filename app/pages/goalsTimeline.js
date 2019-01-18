import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements'
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'

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
        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateFreshmanYear()}
          title='Freshman Year'>
        </Button>

        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateSophomoreYear()}
          title='Sophomore Year'>
        </Button>

        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateJuniorYear()}
          title='Junior Year'>
        </Button>

        <Button
          buttonStyle={ styles.yearItem }
          onPress={() => this.navigateSeniorYear()}
          title='Senior Year'>
        </Button>
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
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 20, 
    margin : 15
  }
});
