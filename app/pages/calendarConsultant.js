import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Metrics from '../Themes/Metrics';
import LoggedOut from '../components/loggedOutScreen';
import firebase from 'firebase';
import Colors from '../Themes/Colors'

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoggedIn: false,
      emailVerification: true,
    };
    this.onDayPress = this.onDayPress.bind(this);
    console.log("calendar consultant props " + JSON.stringify(props));
  }

  componentDidMount =async() => {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async () => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
    const emailVerification = firebase.auth().currentUser.emailVerified;
    if (emailVerification == true) {
      await this.setState({ emailVerified: true});
    }
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    console.log("pressed " + JSON.stringify(this.state));
    this.props.navigation.navigate('SetAvailabilityScreen', { bookingDate : day })
  }
  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack();
  }
  render() {
    if (!this.state.hasLoggedIn || !this.state.emailVerified) {
      return (<LoggedOut />);
    } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View style = {styles.calendarView}>
          <Calendar
            onDayPress={this.onDayPress}
            style={styles.calendar}
            minDate={Date()-1}
            markedDates={{[this.state.selected]: {selected: true}}}
            theme={{
              selectedDayBackgroundColor: 'purple',
              todayTextColor: 'purple',
              arrowColor: 'purple',
            }}
          />
        </View>
      </View>
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    paddingTop: 5,
    height: 350
  },
  calendarView: {
    marginTop: 50,
    width: Metrics.screenWidth*.9,
    flex: 1,
    marginLeft: Metrics.screenWidth*.05
  },
});
