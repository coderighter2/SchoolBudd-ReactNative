import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


export default class AvailabilityBlock extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cardSelected: false,
      time: '',
      userID: '',
    }
    //console.log(JSON.stringify("AvailabilityBlock props " + JSON.stringify(props)));
  }

  navigateResource() {
    this.props.navigation.navigate(this.props.jedi.item.navigationPath);
  }

  componentDidMount() {
    this.setState({ time: this.props.jedi.item.key })
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.navigateResource()}>
        <View style={styles.cardView}>
          <Card
            containerStyle={this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            wrapperStyle={this.state.cardSelected ? styles.cardSelected : styles.cardNotSelected}
            title={this.props.jedi.item.key}
            titleStyle={this.state.cardSelected ? styles.cardTitleSelected : styles.cardTitleNotSelected}>
          </Card>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth - 30,
    height: Metrics.screenHeight * .1,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: Metrics.buttonRadius,
  },
  cardSelected: {
    margin: 0,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.lightPurple,
  },
  cardNotSelected: {
    margin: 0,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: 'white',
    borderColor: Colors.lightPurple,
  },
});
