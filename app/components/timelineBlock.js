import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'


export default class TimelineBlock extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSelected: false,
      time: '',
      userID: '',
    }
    console.log(JSON.stringify("timelineBlock props " + JSON.stringify(props)));
  }



  render() {
    return (
      <View style={styles.cardView}>
        <Text style = {styles.itemTxt}>{this.props.jedi.item}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth-20,
    marginLeft: 10,
    borderRadius: Metrics.buttonRadius,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 15,
    justifyContent: 'center',
    minHeight: 60,
    borderWidth: 1,
    borderColor: Colors.lightPurple

  },
  itemTxt: {
    fontSize: 18,
  },
});
