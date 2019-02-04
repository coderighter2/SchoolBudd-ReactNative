import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SectionList, TextInput, KeyboardAvoidingView, 
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, AsyncStorage, Button } from 'react-native';
import { Input } from "native-base";
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import * as Expo from "expo";
import Colors from '../Themes/Colors';
import QuestionBlock from '../components/questionBlock';
import { ListItem, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import { globalStyles } from '../Themes/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
 
const {width, height} = Dimensions.get('window');

//use renderdraggable type conditional rendering
export default class Forum extends React.Component {
 
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Forum',
      title: 'Forum',
      headerLeft: (
        <Feather style={{ marginLeft: 15}}
          name="menu"
          size={Metrics.icons.medium}
          color={Colors.lightPurple}
          onPress={() => navigate('DrawerToggle')}
        />
      ),
      headerRight: (
        <Feather style={{ marginRight: 15}}
          name="plus-circle"
          size={Metrics.icons.medium}
          color={Colors.lightPurple} 
          onPress={params.createQuestion}
        />
      ),
    }
  };


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isTopicModalVisible: false,
      isQuestionModalVisible: false,
      profileImage: '',
      currentTopic: 'Select a Question Topic',
      postQuestionTopic : 'Select a Question Topic',
      isPostTopic : false,
      hasLoggedIn: false,
      question: '',
      userName: '',
      portalQuestion: '',
      userPortal: '',
    }
    //see what props App.js is constructed with:
    //console.log("forum props " + JSON.stringify(props));
  }

  async appendJedis(count, start) {
    await this.setState({loading:true, refreshing : true});
    await firebase.database().ref('forum').on('child_added', async(snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      questionText = childData.question.toLowerCase();
      searchTextLowercase = this.state.searchText.toLowerCase();
      var jedisList = this.state.jedisSectioned[0].data.slice();
      //console.log("current topic " + this.state.currentTopic);
      //console.log("userPortal " + this.state.userPortal);
      // if (questionText.includes(searchTextLowercase) && (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase())) {
      if (questionText.includes(searchTextLowercase)) {
      //   &&
      // (this.state.userPortal.toLowerCase() == childData.portalQuestion.toLowerCase() || (this.state.userPortal == 'consultant'))) {
        if ((this.state.currentTopic == "Select a Question Topic" || this.state.currentTopic == "All Topics") 
        && !jedisList.indexOf(childData) > -1) {
          jedisList.push(childData);
        } else if (childData.topic == this.state.currentTopic && !jedisList.indexOf(childData) > -1) {
          jedisList.push(childData);
        }
      } 

      await this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
      //console.log("loading : " + this.state.loading);

    });

    this.state.jedisSectioned.forEach(function(element) {
      //console.log("jedi " + element.value)
    });
  }

  componentWillMount = async() => {
    this.checkIfUserLoggedIn();
    this.props.navigation.setParams({ createQuestion: () => this.props.navigation.navigate('AddQuestionScreen')});

    var userUID = firebase.auth().currentUser.uid;
    var name;
    var that = this;

    await firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //console.log(" User is signed in.");
        // //console.log("name " + firebase.database().ref('users').child(userUID).child('name'));
        firebase.database().ref('users').child(userUID).on('value', function(snapshot) {
          var childKey = snapshot.key;
          var childData = snapshot.val();
          childData.key = childKey;
          name = childData.name;
          that.setState({userName: name, userPortal: childData.portal, profileImage : childData.profilePicture},
             () => console.log("user portal in function " + that.state.userPortal));
        });
      } else {
        console.log(" User is not signed in.");
      }
    });
    this.appendJedis(3,1);

  }

  onPressPostQuestion = async() => {
    if ((this.state.postQuestionTopic !== 'Select a Question Topic') && (!this.state.question == '')) {
    await this.setState({ isQuestionModalVisible: false});

    await firebase.database().ref('forum').push({
        question: this.state.question,
        portalQuestion: this.state.userPortal,
        author: this.state.userName,
        topic: this.state.postQuestionTopic,
        profileImage : this.state.profileImage
      });
    } else {
      alert("Please choose the topic and fill the input.");
    }
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      //console.log("hasLoggedIn" + this.state.hasLoggedIn);
    }
   }

  toggleTopicModal = async() => {
    await this.setState({isTopicModalVisible: true});
    //console.log("topic " + this.state.isTopicModalVisible);
  }


  toggleQuestionModal = async() => {
    this.setState({isQuestionModalVisible: !this.state.isQuestionModalVisible});
  }

  onPressTopic = async() => {
      await this.setState({isQuestionModalVisible: false});
      this.setState({isPostTopic : false});
      await this.setState({isTopicModalVisible: true});
      //console.log("topic modal " + this.state.isTopicModalVisible);
  }

  onPressTopicPostQuestion = async() => {
    await this.setState({isQuestionModalVisible: false});
    this.setState({isPostTopic : true});
    await this.setState({isTopicModalVisible: true});
    //console.log("question modal " + this.state.isQuestionModalVisible);
    //console.log("topic modal " + this.state.isTopicModalVisible);
}

  listItemRenderer(item) {
    return (
      <QuestionBlock jedi={item}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      await this.setState({loading: true});
      //console.log("loading : " + this.state.loading);
      await this.appendJedis(count,start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
  }

  onPressCollegeLife = async() => {
    if(this.state.isPostTopic){
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'College Life'});
      await this.setState({isQuestionModalVisible: true});
    } else {
      await this.setState({ isTopicModalVisible: false, currentTopic: 'College Life'});
      //console.log(this.state.currentTopic);
  
      this.resetList();
    }    
  }

  onPressCollegeApplications = async() => {
    if(this.state.isPostTopic){
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'College Applications'});
      await this.setState({isQuestionModalVisible: true});
    } else {
      await this.setState({ isTopicModalVisible: false, currentTopic: 'College Applications'});
      //console.log(this.state.currentTopic);
  
      this.resetList();
    }
  }

  onPressResources = async() => {
    if(this.state.isPostTopic){
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'Resources'});
      await this.setState({isQuestionModalVisible: true});
    } else {

      await this.setState({ isTopicModalVisible: false, currentTopic: 'Resources'});
      //console.log(this.state.currentTopic);
  
      this.resetList();
    }
  }

  onPressAllTopics = async() => {
    if(this.state.isPostTopic){
      await this.setState({ isTopicModalVisible: false, postQuestionTopic : 'All Topics'});
      await this.setState({isQuestionModalVisible: true});
    } else {
      await this.setState({ isTopicModalVisible: false, currentTopic: 'All Topics'});
      //console.log(this.state.currentTopic);
  
      this.resetList();
    }
  }

  purchaseItem= async (item) => {
    this.props.navigation.navigate('QuestionResponsesScreen', {item: item});
  }

  messageBlock= async (key) => {
    this.props.navigation.navigate('MessagesScreen', {key: key});
  }

  render() {

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } 
    else {
      return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>

            <View style={styles.purchaseBox}>
              <SearchBar
                lightTheme
                round
                onChangeText={(searchText) => this.setState({searchText})}
                onClearText={console.log('')}
                onSubmitEditing={() => this.resetList()}
                icon={{ type: 'font-awesome', name: 'search' }}
                containerStyle={{width: Metrics.screenWidth*.95, marginBottom: 10}}
                placeholder='Search For Item...'
                />

                <CheckBox
                  center
                  title={this.state.currentTopic}
                  iconRight
                  iconType='material'
                  checkedIcon='clear'
                  uncheckedIcon='add'
                  checkedColor='red'
                  containerStyle={{width: Metrics.screenWidth*.95}}
                  checked={this.state.checked}
                  onPress={()=> this.onPressTopic()}
                />
                {
                  this.state.isQuestionModalVisible == true ? (
                    <KeyboardAvoidingView style={{flex : 1}}>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Modal
                            isVisible={this.state.isQuestionModalVisible}
                            onBackdropPress={() => this.setState({ isQuestionModalVisible: false })}
                            backdropColor={'black'}>   
                            <View
                              style={styles.modalViewQuestion}
                            >    
                              <View style={{flexDirection : 'row', marginTop : 10}}>
                                <Ionicons style={{ marginLeft: 15, fontWeight : 'bold'}}
                                  name="ios-close-circle-outline"
                                  size={Metrics.icons.medium}
                                  color={Colors.lightPurple}
                                  onPress={() => this.setState({ isQuestionModalVisible: false })}
                                />
                                <View style={{flex : 1, alignItems: 'center', width : '100%'}}>
                                  <Text style={styles.modalText}>
                                  Ask a Question!
                                  </Text>
                                </View>
                                <FontAwesome style={{ marginRight: 15, fontWeight : 'bold'}}
                                  name="send"
                                  size={Metrics.icons.medium}
                                  color={Colors.lightPurple}
                                  onPress={() => this.onPressPostQuestion()}
                                />
                              </View>
                              <View style={{
                                  flex: 1,
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                  width: "100%"
                                }}
                              >
                              <Input style={ styles.inputText }
                                placeholder="Ex: When are the common app essays released?"
                                underlineColorAndroid="transparent"
                                multiline={true}
                                onChangeText={(text) => this.setState({question: text})}
                                onSubmitEditing={(text) => this.setState({question: text})}
                                />
                            </View> 
                            <View style={{flexDirection: "row", margin : 10}}>
                              <Button
                                titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                                buttonStyle={{borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor : Colors.lightPurple}}
                                title={this.state.postQuestionTopic}
                                onPress={() => this.onPressTopic(1)}/>
                            </View>
                        </View>                         
                          
                    </Modal>
                  </View>
                  </KeyboardAvoidingView>
                  ) : null
                }
              
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Modal
                    isVisible={this.state.isTopicModalVisible}
                    onBackdropPress={() => this.setState({ isTopicModalVisible: false })}
                    backdropColor={'black'}>
                    <View style={styles.modalViewTopic}>
                      <Text style={styles.modalText}>
                        Pick a Category!
                      </Text>
                      <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Life'
                        onPress={() => this.onPressCollegeLife()}/>
                      <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Applications'
                        onPress={() => this.onPressCollegeApplications()}/>
                      <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='Resources'
                        onPress={() => this.onPressResources()}/>
                      <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='All Topics'
                        onPress={() => this.onPressAllTopics()}/>
                    </View>
                  </Modal>
                </View>

              </View>

            <View style={styles.itemList}>
              <SectionList
                sections={this.state.jedisSectioned}
                // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                renderItem={({item}) => this.listItemRenderer(item)}
                ItemSeparatorComponent = {() => (<View style={{height: 10, backgroundColor: '#e7e7e7'}}/>)}
                keyExtractor={this._keyExtractor}
                contentContainerStyle = {{alignItems: 'center'}}
                onRefresh = {() => this.resetList()}
                refreshing = {this.state.refreshing}
                removeClippedSubviews = {true}
                // ListFooterComponent = {<ActivityIndicator />}
              />
            </View>
          </View>
      </TouchableWithoutFeedback>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: Metrics.width*.9,
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
    flex: 1,
    width: Metrics.screenWidth,
    paddingTop: 10,
  },
  modalViewTopic: {
    height: Metrics.screenHeight*.5,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalViewQuestion: {
    width: Metrics.screenWidth*0.9,
    height: Metrics.screenHeight * .6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modal: {
    justifyContent: "flex-start",
    position : "absolute",
    zIndex: 4,
    elevation: 4,
    width : Metrics.screenWidth,
    height: Metrics.screenHeight,
    marginTop: Expo.Constants.statusBarHeight / 2
  },
  icon: {
    marginLeft: 15,
  },
  footerIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  modalFooter: {
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: 54,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5
  },
  inputText: {
    width: '100%',
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    minHeight: 40,
    textAlignVertical: "top",
    padding: 10,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    backgroundColor: 'white',
  }
});
