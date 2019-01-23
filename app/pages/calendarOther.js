import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    var date1 = new Date(day.dateString);
    var date2 = new Date(new Date());

    if(date1>date2 || date1==date2) {
      this.setState({
        selected: day.dateString
      });
      console.log("pressed " + JSON.stringify(this.state));
      this.props.navigation.navigate('MakeAppointmentsScreen', { 
        propsCalendar: this.props.navigation.state.params.item.key, 
        bookingDate : day 
      });
    } else {
      alert('You have to choose other day afer today!')
    }
  }

  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack()
  }
  render() {
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
