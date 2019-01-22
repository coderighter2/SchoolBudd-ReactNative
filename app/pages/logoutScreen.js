import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import Colors from '../Themes/Colors'

export default class Logout extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
        headerTitle: 'Logout',
        title: 'Logout',
        headerLeft: (
            <Feather style={{marginLeft: 15}}
                name="menu"
                size={Metrics.icons.medium}
                color={Colors.lightPurple}
                onPress={() => navigate('DrawerToggle')}
            />
        )
    }        
  };

  onPressLogout = async() => {
    console.log("props " + JSON.stringify(this.props));
    await AsyncStorage.setItem("hasLoggedIn", "false");
    const logoutCheck = await AsyncStorage.getItem("hasLoggedIn");
    console.log("hasLoggedOut" + logoutCheck);
    console.log("jimmmmmmmmm");
    await firebase.auth().signOut();
    await AsyncStorage.setItem('portal', '');
    this.props.navigation.navigate("SelectPortalScreen", this.props.screenProps);
  }

  render() {
    const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
          <View style={styles.feedbackBox}>
            <Text style={styles.textStyles}>Here at MoveItMoveIt, we appreciate your usage of the app. </Text>
            <View style={styles.buttonsRow}>
              <View>
                <Button
                  title="Logout"
                  onPress={() => this.onPressLogout()}
                  color={Colors.lightPurple}/>
              </View>
            </View>
          </View>
        </View>
      );
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
      width: Metrics.screenWidth*.9,
      height: Metrics.screenHeight*.3,
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
      fontSize: 20,
    },
    logoutButton: {
      width: Metrics.screenWidth*.7,
      height: Metrics.screenHeight*.05,
      borderWidth: 1,
      marginBottom: 55,
      backgroundColor: Colors.lightPurple,
      alignItems: 'center',
      justifyContent: 'center',
    },
})
