import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import email from 'react-native-email';
import { Button } from 'react-native-elements';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Stripe from 'firebase';
import Colors from '../Themes/Colors'

export default class Feedback extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: 'Feedback',
      headerLeft: (
        <Feather style={styles.icon}
          name="menu"
          size={Metrics.icons.medium}
          color={Colors.lightPurple}
          onPress={() => navigate('DrawerToggle')}
        />
      )
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.feedbackBox}>
          <Text style={styles.textStyles}>Here at MoveItMoveIt, we love to improve. Your input can help us do that. :)</Text>
          <Button
            title="Give Feedback"
            onPress={this.handleEmail}
            backgroundColor={Colors.lightPurple} />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center'
  },
  feedbackBox: {
    width: Metrics.screenWidth * .9,
    height: Metrics.screenHeight * .2,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderRadius: Metrics.screenWidth * .05,
    backgroundColor: 'white',
  },
  textStyles: {
    fontStyle: 'italic',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    marginLeft: 15,
  }
})
