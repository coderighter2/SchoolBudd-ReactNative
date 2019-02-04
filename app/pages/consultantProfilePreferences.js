import React from 'react';
import {
  Button,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ImagePicker, Permissions} from 'expo';
import * as _ from 'lodash';
import firebase from 'firebase';
import {CheckBox, Slider} from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import LoggedOut from '../components/loggedOutScreen';
import Colors from '../Themes/Colors'


/*
for scaling, can use sql, or use a backend developer (firebase)
*/

const specialties = [
  { label: 'Extracurriculars in High School', value: 'Extracurriculars in High School' },
  { label: 'Grades in College', value: 'Grades in College' },
  { label: 'Fun in College', value: 'Fun in College' },
  { label: 'Internships', value: 'Internships' },
  { label: 'Transitioning to College', value: 'Transitioning to College' },
]

export default class ProfileConsultantPreferences extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Preferences',
    title: 'Preferences',
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

  constructor(props) {
    super(props);

    this.state = {
      availabilityPreferences: 'Set Availability Preferences',
      bio: '',
      isTypeModalVisible: false,
      isYearsModalVisible: false,
      typeConsultant: 'Type of Consultant',
      yearsConsultant: 'Select Years as Consultant',
      isPreferencesModalVisible: false,
      isTimesModalVisible: false,
      isSpecialtyModalVisible: false,
      imageUri: '',
      test: '',
      hasLoggedIn: false,
      selectedSpecialties: [],
      price: 140,
    }
  }

  onSelectionsChange = (selectedSpecialties) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedSpecialties });
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      //console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
   }

  onPressSaveObject = async () => {
    if ((this.state.availabilityPreferences !== 'Set Availability Preferences') && (this.state.bio !== '')) {
      await this.storeItem();
      //console.log("navigation " + JSON.stringify(this.props.navigation));
      this.props.navigation.navigate("Home");
    } else {
      alert('Please Fill in All Categories');
    }
  };

  onSubmitEditingBio = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingPrice = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingDescription = () => {
    Keyboard.dismiss();
  };

  storeItem = async () => {

    await firebase.database().ref('consultants').child(firebase.auth().currentUser.uid).update({
        specialties: this.state.selectedSpecialties,
        availabilityPreferences: this.state.availabilityPreferences,
        typeConsultant: this.state.typeConsultant,
        yearsConsultant: this.state.yearsConsultant,
        bio: this.state.bio,
        price: this.state.price,
      });

    // const pointsRef = firebase.database().ref('users').child(uid).child('points');
  };

  togglePreferencesModal = () => {
    this.setState({isPreferencesModalVisible: !this.state.isPreferencesModalVisible});
  };

  onPressPreferences() {
    this.togglePreferencesModal();
  }

  toggleSpecialtyModal = () => {
    this.setState({isSpecialtyModalVisible: !this.state.isSpecialtyModalVisible});
  };

  onPressSpecialty() {
    this.toggleSpecialtyModal();
  }


  toggleYearsModal = () => {
    this.setState({isYearsModalVisible: !this.state.isYearsModalVisible});
  };

  onPressYears() {
    this.toggleYearsModal();
  }

  toggleTypeModal = () => {
    this.setState({isTypeModalVisible: !this.state.isTypeModalVisible});
  };

  onPressType() {
    this.toggleTypeModal();
  }

  onPressIECA = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'IECA'});
    //console.log(this.state.typeConsultant);
  };

  onPressCurrentStudent = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'College Student'});
    //console.log(this.state.typeConsultant);
  };

  onPressZeroToOne = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '0-1'});
    //console.log(this.state.yearsConsultant);
  };

  onPressTwoToThree = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '2-3'});
    //console.log(this.state.yearsConsultant);
  };

  onPressFourToFive = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '4-5'});
    //console.log(this.state.yearsConsultant);
  };

  onPressGreaterThanFive = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '< 5'});
    //console.log(this.state.yearsConsultant);
  };

  onPressHourly = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Just Hourly'});
    //console.log(this.state.availabilityPreferences);
  };

  onPressPackages = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Just Packages'});
    //console.log(this.state.availabilityPreferences);
  };

  onPressBoth = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Both Hourly and Packages'});
    //console.log(this.state.availabilityPreferences);
  };

  render() {

    let {image} = this.state;

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.container}>

            <View style={styles.itemInformation}>

            <CheckBox
                      center
                      title={'Set Consultant Specialties'}
                      iconRight
                      iconType='material'
                      uncheckedIcon='add'
                      textStyle={{fontWeight: 'normal', color: 'gray'}}
                      containerStyle={{width: Metrics.screenWidth * .85}}
                      onPress={() => this.onPressSpecialty()}
                    />

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Modal
                        isVisible={this.state.isSpecialtyModalVisible}
                        onBackdropPress={() => this.setState({isSpecialtyModalVisible: false})}
                        backdropColor={'black'}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          Set Specialties!
                        </Text>
                        <Text style={styles.modalText}>

                        </Text>
                          <SelectMultiple
                           items={specialties}
                           selectedItems={this.state.selectedSpecialties}
                           onSelectionsChange={this.onSelectionsChange} />
                        </View>
                      </Modal>
                    </View>

                    <CheckBox
                        center
                        title={this.state.availabilityPreferences}
                        iconRight
                        iconType='material'
                        uncheckedIcon='add'
                        textStyle={{fontWeight: 'normal', color: 'gray'}}
                        containerStyle={{width: Metrics.screenWidth * .85}}
                        onPress={() => this.onPressPreferences()}
                      />

                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Modal
                          isVisible={this.state.isPreferencesModalVisible}
                          onBackdropPress={() => this.setState({isPreferencesModalVisible: false})}
                          backdropColor={'black'}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                              Availability Preferences!
                            </Text>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Just Hourly or Less'
                              onPress={() => this.onPressHourly()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Just Packages (10+ hours)'
                              onPress={() => this.onPressPackages()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Both Hourly and Packages'
                              onPress={() => this.onPressBoth()}/>
                          </View>
                        </Modal>
                      </View>

                <CheckBox
                  center
                  title={this.state.typeConsultant}
                  iconRight
                  iconType='material'
                  uncheckedIcon='add'
                  textStyle={{fontWeight: 'normal', color: 'gray'}}
                  containerStyle={{width: Metrics.screenWidth * .85}}
                  onPress={() => this.onPressType()}
                />

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Modal
                    isVisible={this.state.isTypeModalVisible}
                    onBackdropPress={() => this.setState({isTypeModalVisible: false})}
                    backdropColor={'black'}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>
                        Pick a Category!
                      </Text>
                      <Button
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                        title='IECA Consultant'
                        onPress={() => this.onPressIECA()}/>
                      <Button
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                        title='Current College Student'
                        onPress={() => this.onPressCurrentStudent()}/>
                    </View>
                  </Modal>
                </View>

                 <CheckBox
                        center
                        title={this.state.yearsConsultant}
                        iconRight
                        iconType='material'
                        uncheckedIcon='add'
                        textStyle={{fontWeight: 'normal', color: 'gray'}}
                        containerStyle={{width: Metrics.screenWidth * .85}}
                        onPress={() => this.onPressYears()}
                      />

                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Modal
                          isVisible={this.state.isYearsModalVisible}
                          onBackdropPress={() => this.setState({isYearsModalVisible: false})}
                          backdropColor={'black'}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                              Years as Consultant!
                            </Text>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='0 - 1 Years'
                              onPress={() => this.onPressZeroToOne()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='2 - 3 Years'
                              onPress={() => this.onPressTwoToThree()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='4 - 5 Years'
                              onPress={() => this.onPressFourToFive()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='> 5 Years'
                              onPress={() => this.onPressGreaterThanFive()}/>
                          </View>
                        </Modal>
                      </View>


  `                  <Slider
                      value={this.state.price}
                      thumbTintColor= {Colors.lightPurple}
                      minimumValue= {5}
                      maximumValue= {250}
                      value = {140}
                      step={1}
                      onValueChange={(price) => this.setState({price})}
                      onSlidingComplete={(price) => this.setState({price})}
                      />
                    <Text>Price Per Hour: ${this.state.price}</Text>`

                  <TextInput style={styles.inputText}
                    placeholder="Bio"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.setState({bio: text})}
                    onSubmitEditing={() => this.onSubmitEditingBio(this.state.searchText)}
                  />



            </View>


            <TouchableOpacity style={styles.postButton}
                              onPress={() => this.onPressSaveObject()}>
              <View>
                <Text style={styles.postButtonText}>
                  Update Profile
                </Text>
              </View>
            </TouchableOpacity>

          </SafeAreaView>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>


    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 5,
  },
  itemInformation: {
    flex: 1,
    flexDirection: 'column',
    margin: 20,
    backgroundColor: 'white',
  },
  pictureBox: {
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 70,
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: .5,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  picture: {
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 20,
  },
  inputText: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  bigInputText: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  postButton: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 55,
    backgroundColor: Colors.lightPurple,
  },
  postButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  keyboardAction: {
    flex: 1,
  },
  modalView: {
    height: Metrics.screenHeight * .6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
