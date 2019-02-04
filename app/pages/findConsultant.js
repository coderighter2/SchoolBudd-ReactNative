import React from 'react';
import {
  StyleSheet, Text, View, Image, ActivityIndicator, SectionList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage
} from 'react-native';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import SaleBlock from '../components/saleBlock';
import { Card, ListItem, Slider, Icon, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import SelectMultiple from 'react-native-select-multiple';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { globalStyles } from '../Themes/Styles';

const { width, height } = Dimensions.get('window');

const items = [
  {
    name: "Consultant Type",
    id: 0,
    children: [{
      name: "IECA",
      id: "IECA",
    }, {
      name: "Current College Student",
      id: "College Student",
    }]
  },
  {
    name: "Specialties",
    id: 1,
    children: [{
      name: "Extracurriculars in High School",
      id: "Extracurriculars in High School",
    }, {
      name: "Grades in College",
      id: "Grades in College",
    }, {
      name: "Fun in College",
      id: "Fun in College",
    }, {
      name: "Transitioning to College",
      id: "Transitioning to College",
    }, {
      name: "Internships",
      id: "Internships",
    }]
  },
  {
    name: "Hourly or Packages",
    id: 2,
    children: [{
      name: "Just Hourly",
      id: "Just Hourly",
    }, {
      name: "Just Packages",
      id: "Just Packages",
    }, {
      name: "Both Hourly and Packages",
      id: "Both Hourly and Packages",
    }]
  },
]

// because of the bad API of react-native-sectioned-multi-select we need to store keys and categories relations by ourselves
let itemsCategoriesDict = {};

items.forEach(item => {
  item.children.forEach(children => {
    itemsCategoriesDict[children.name] = item.name;
  });
});


/*
  Displays information about Jedi
*/
export default class FindConsultant extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Find A Consultant',
      title: 'Find A Consultant',
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
      jedisSectioned: [{ title: 'Jedis', data: [] }],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      hasLoggedIn: false,
      selectedItems: [],
      selectedItemsComparisonArray: [],
      selectedConsultantType: false,
      selectedSpecialties: false,
      selectedAvailabilityPreferences: false,
      selectedConsultantTypeArray: [],
      selectedSpecialtiesArray: [],
      selectedAvailabilityPreferencesArray: [],
      emailVerified: false,
    }
  }

  async appendJedis(count, start) {
    const {
      selectedSpecialties, 
      selectedSpecialtiesArray, 
      selectedConsultantType, 
      selectedConsultantTypeArray, 
      selectedAvailabilityPreferences,
      selectedAvailabilityPreferencesArray,
      searchText
    } = this.state;

    var jedisList = this.state.jedisSectioned[0].data.slice();
    //console.log("testing append jedis");

    const database = firebase.database();
    const consultants = firebase.database().ref('consultants');

    if (searchText) {
      consultants.on('value', snapshot => {

        const usersDict = {}, consultantsDict = {};
        const data = snapshot.val();

        const promisesArray = Object.keys(data).map(key => {
          const item = data[key];
          item.key = key;
          consultantsDict[key] = item;
          return database.ref('users').child(key).on('value', s => { 
            usersDict[key] = s.val();
          });
        });

        Promise.all(promisesArray)
          .then(() => {
            Object.keys(usersDict).forEach(key => {
              const user = usersDict[key];
              console.log("USER", user);
              const userName = user.name ? 
              user.name : 
              user.firstName + ' ' + user.lastName;
              const hometown = user.cityState || '';
              const affiliation = user.schoolName || '';
              if (userName.includes(searchText) 
                || hometown.includes(searchText) 
                || affiliation.includes(searchText)
              ) {
                jedisList.push(consultantsDict[key]);
              }

            });
            console.log("CONS", consultantsDict);
            this.setState({ 
              loading: false, 
              refreshing: false, 
              jedisSectioned: [{ title: 'Jedis', data: jedisList }] 
            });
          });
        
      });
      
      return;
    }
  
    consultants.orderByChild("price").endAt(this.state.price).on('value', snapshot => {
      const data = snapshot.val();
      Object.keys(data).map(key => {
        const item = data[key];
        item.key = key;
        let passed = true;
        if (selectedSpecialties) {
          let passedBySpeciality = false;
          selectedSpecialtiesArray.forEach(selectedSpecialty => {
            if (item.specialties && item.specialties.find(speciality => speciality.value === selectedSpecialty)) {
              passedBySpeciality = true;
            }
          });
          if (!passedBySpeciality) {
            passed = false;
          }
        }
        if (selectedConsultantType) {
          let passedByConsultantType = false;
          selectedConsultantTypeArray.forEach(type => {
            if (type === item.type) {
              passedByConsultantType = true;
            }
          });
          if (!passedByConsultantType) {
            passed = false;
          }
        }
        if (selectedAvailabilityPreferences) {
          let passedByAvailability = false;
          selectedAvailabilityPreferencesArray.forEach(preference => {
            if (preference === item.availabilityPreferences) {
              passedByAvailability = true;
            }
          });
          if (!passedByAvailability) {
            passed = false;
          }
        }
        if (passed) {
          jedisList.push(item);
        }
      }); 
      this.setState({ 
        loading: false, 
        refreshing: false, 
        jedisSectioned: [{ title: 'Jedis', data: jedisList }] 
      });
    })

  }

  onSelectionsChangeSpecialties = (selectedSpecialties) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedSpecialties });
  }

  onSelectionsChangeConsultantType = (selectedConsultantType) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedConsultantType });
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
    this.appendJedis(3, 1);
  }

  checkIfUserLoggedIn = async () => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      //console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
    const emailVerification = firebase.auth().currentUser.emailVerified;
    if (emailVerification == true) {
      await this.setState({ emailVerified: true});
    }
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  onPressCategory() {
    this.toggleModal();
  }

  listItemRenderer(item) {
    return (
      <SaleBlock
        filterName={this.state.searchText}
        jedi={item}
        bookAppointment={this.bookAppointment}
        selectConsultant={this.selectConsultant} />
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({ loading: true });
      await this.appendJedis(count, start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({ refreshing: true, jedisSectioned: [{ title: 'Jedis', data: [] }] });
    this.appendJedis(3, 1);
    //console.log("selectedItems " + JSON.stringify(this.state.selectedItems));
  }

  onPressMiscellaneous = async () => {
    await this.setState({ isModalVisible: false, currentCategory: 'Miscellaneous' });
    //console.log(this.state.currentCategory);

    this.resetList();
  }

  onSelectedItemsChange = async (selectedItems) => {
    const selectedConsultantTypeArray = [], 
    selectedSpecialtiesArray = [],
    selectedAvailabilityPreferencesArray =  [];
    let selectedConsultantType = false,
    selectedSpecialties = false,
    selectedAvailabilityPreferences = false;
    selectedItems.forEach(item => {
      const category = itemsCategoriesDict[item];
      if (category === "Consultant Type") {
        selectedConsultantType = true;
        selectedConsultantTypeArray.push(item);
      }
      if (category === "Specialties") {
        selectedSpecialties = true;
        selectedSpecialtiesArray.push(item);
      }
      if (category === "Hourly or Packages") {
        selectedAvailabilityPreferences = true;
        selectedAvailabilityPreferencesArray.push(item);
      }
    });
    this.setState({
      selectedItems,
      selectedConsultantType, 
      selectedAvailabilityPreferences, 
      selectedSpecialties,
      selectedConsultantTypeArray,
      selectedAvailabilityPreferencesArray,
      selectedSpecialtiesArray
    });
  }

  // onSelectedItemsChange = async (selectedItems) => {
  //   this.setState({ selectedItems });
  //   console.log("SELECTED ITEMS", selectedItems);
  //   //console.log("typeof " + typeof this.state.selectedItems);
  //   var selectedItemsString = JSON.stringify(selectedItems);
  //   //console.log("selectedItemsString " + selectedItemsString);
  //   //console.log("typeof string" + typeof selectedItemsString);
  //   if (selectedItemsString.includes("IECA") || selectedItemsString.includes("Current College Student")) {
  //     await this.setState({ selectedConsultantType: true });
  //   } else {
  //     await this.setState({ selectedConsultantType: false });
  //   }
  //   if (selectedItemsString.includes("Just Hourly") || selectedItemsString.includes("Just Packages") || selectedItemsString.includes("Both")) {
  //     await this.setState({ selectedAvailabilityPreferences: true });
  //   } else {
  //     await this.setState({ selectedAvailabilityPreferences: false });
  //   }
  //   if (selectedItemsString.includes("Extracurriculars in High School") || selectedItemsString.includes("Grades in College") || selectedItemsString.includes("Internships")
  //     || selectedItemsString.includes("Transitioning to College") || selectedItemsString.includes("Fun in College")) {
  //     await this.setState({ selectedSpecialties: true });
  //   } else {
  //     await this.setState({ selectedSpecialties: false });
  //   }
  //   //console.log("type " + this.state.selectedConsultantType);
  //   //console.log("availabilityPreferences " + this.state.selectedAvailabilityPreferences);
  //   //console.log("specialties " + this.state.selectedSpecialties);
  // }

  bookAppointment = async (item) => {
    console.log("bookAppointment : "+ JSON.stringify(item) );
    this.props.navigation.navigate('CalendarOtherScreen', { item: item });
  }

  selectConsultant = async (key) => {
    this.props.navigation.navigate('SelectConsultant', { key: key });
  }

  changeFilterValue = price => {
    this.setState({ price }, () => {
      this.resetList();
    });
  }

  render() {

    if (!this.state.hasLoggedIn || !this.state.emailVerified) {
      return (<LoggedOut />);
    } else {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.container}>
            <View style={styles.purchaseBox}>
              <SearchBar
                lightTheme
                round
                onChangeText={(searchText) => this.setState({ searchText })}
                onClearText={console.log('')}
                onSubmitEditing={() => this.resetList()}
                icon={{ type: 'font-awesome', name: 'search' }}
                containerStyle={{ width: Metrics.screenWidth * .95, marginTop: 10}}
                placeholder='Search For Consultant...'
              />

              <View style={{ width: Metrics.screenWidth * .9, justifyContent: 'center' }}>
                <Slider
                  value={this.state.price}
                  thumbTintColor={Colors.lightPurple}
                  minimumValue={5}
                  maximumValue={250}
                  value={140}
                  step={1}
                  onSlidingComplete={this.changeFilterValue}
                />
                <Text>Maximum Price: ${this.state.price}</Text>

                <SectionedMultiSelect
                  ref={SectionedMultiSelect => { this.SectionedMultiSelect = SectionedMultiSelect }}
                  items={items}
                  uniqueKey='id'
                  subKey='children'
                  selectText='Choose some things...'
                  styles={{
                    container: {
                      height: Metrics.screenHeight*0.5
                    },
                    selectToggle: {
                      marginVertical: 15,
                      alignItems: 'center',
                      padding: 20,
                      borderRadius: 10,
                      backgroundColor: Colors.lightPurple,
                    },
                    selectToggleText: {
                      fontSize: 15,
                      height: 20,
                      color: 'white'
                    },
                    selectedSubItemText: {
                      color: Colors.lightPurple,
                    },
                    button: {
                      backgroundColor: Colors.lightPurple,
                    }
                  }}
                  showDropDowns={true}
                  readOnlyHeadings={true}
                  onSelectedItemsChange	={this.onSelectedItemsChange}
                  selectedItems={this.state.selectedItems}
                  showCancelButton={true}
                  showChips={true}
                  onConfirm={this.resetList}
                />
              </View>
            </View>

            <View style={styles.itemList}>
              <SectionList
                sections={this.state.jedisSectioned}
                // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                renderItem={({ item }) => this.listItemRenderer(item)}
                ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={{ alignItems: 'center' }}
                onRefresh={() => this.resetList()}
                refreshing={this.state.refreshing}
                removeClippedSubviews={true}
                ListFooterComponent={this.state.refreshing ? <ActivityIndicator /> : <View />}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: "#ff8080",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.width * .9,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
    height: Metrics.screenHeight * .7,
    width: Metrics.screenWidth,
    paddingTop: 10,
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
  icon: {
    marginLeft: 15,
  }
});
