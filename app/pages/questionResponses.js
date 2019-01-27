import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, AsyncStorage, SectionList, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import AnswerBlock from '../components/answerBlock';
import Modal from "react-native-modal";
import { globalStyles } from '../Themes/Styles';
import { Button } from 'react-native-elements'

export default class QuestionResponses extends React.Component {
  static navigationOptions = {
    headerTitle: 'Responses',
  };

  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{title: 'Jedis',data:[]}],
      profileName: '',
      profileImage : '',
      userID: firebase.auth().currentUser.uid,
      loading: false,
      refreshing: false,
      question: '',
      topic : '',
      answer: '',
      isAnswerModalVisible: false,
      key: '',
      userName: '',
    }
    // //console.log("props QuestionResponsesScreen " + JSON.stringify(props));
  }

  componentWillMount= async() => {

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
        that.setState({ userName: name, profileImage : childData.profilePicture});
      });
    } else {
      //console.log(" User is not signed in.");
    }
  });
  item = this.props.navigation.state.params.item;

  // //console.log("QuestionResponsesScreen item " + JSON.stringify(this.props.navigation.state.params.item));
  // //console.log("QuestionResponsesScreen key " + JSON.stringify(this.props.navigation.state.params.item.key));
  await this.setState({profileName: item.author, profileImage : item.profileImage, question: item.question, topic : item.topic, key: this.props.navigation.state.params.item.key });
  // //console.log("question key " + this.state.key);
  this.appendJedis(3,1);
  }

  async appendJedis(count, start) {

    await this.setState({loading : true, refreshing: true});
    var jedisList = this.state.jedisSectioned[0].data.slice();
    await firebase.database().ref('forum').child(this.state.key).child('answers').on('child_added', async(snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
     
      await jedisList.push(childData);
    });

    jedisList.sort(function(a,b) { 
      if(a.totalUpvotes == b.totalUpvotes) return 0;
      var direction = 1;
      return b.totalUpvotes>a.totalUpvotes?direction:-direction;
    });
    //console.log("result : " + JSON.stringify(jedisList));
    await this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});

  }

  listItemRenderer(item) {
    return (
      <AnswerBlock
      jedi={item}
      forumLocation={this.state.key}
      purchaseItem={this.purchaseItem}
      messageBlock={this.messageBlock}/>
    );
  }

  purchaseItem= async (item) => {
    this.props.navigation.navigate('AnswerScreen', {item: item, question: this.state.question, topic : this.state.topic, forumLocation: this.state.key});
  }
  resetList = async () => {
    await this.setState({refreshing: true, jedisSectioned: [{title: 'Jedis', data:[]}]});
    this.appendJedis(3,1);
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({loading: true});
      await this.appendJedis(count,start);
    }
  }

  onPressAnswerQuestion() {
    //console.log("pressed answer");
    this.setState({ isAnswerModalVisible: true});
  }

  onPressPostAnswer = async() => {
    //console.log("pressed answer");
    //console.log("author " + JSON.stringify(firebase.auth().currentUser));
    await this.setState({ isAnswerModalVisible: false});
    await firebase.database().ref('forum').child(this.state.key).child('answers').push({
        answer: this.state.answer,
        author: this.state.userName,
        downvotes : 0,
        totalUpvotes : 0,
        upvotes : 0,
        profileImage : '',
      });
    
  }

  _keyExtractor = (item, index) => index;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileView}>
            <View style={{flexDirection : 'row', marginBottom : 15, alignItems: 'center', marginTop: 10}}>
              <Avatar
                size="large"
                source={this.state.profileImage? {uri : this.state.profileImage} : Images.profile}
                activeOpacity={0.7}
                rounded
              />
              <Text style={{fontSize :17, marginLeft: 15, fontWeight : '200'}}>
                {this.state.profileName}
              </Text>
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.question}</Text>
          
            <Text style={{fontSize: 13, color : '#888', marginVertical: 15}}>Topic : {this.state.topic}</Text>
            
            <TouchableOpacity
              style={globalStyles.btn}
              onPress={() => this.onPressAnswerQuestion()} >
              <Text style={styles.btnText}>Answer</Text>
            </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Modal
            isVisible={this.state.isAnswerModalVisible}
            onBackdropPress={() => this.setState({ isAnswerModalVisible: false })}
            backdropColor={'black'}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Ask a Question!
              </Text>
              <TextInput style={ styles.inputText }
                  placeholder="Ex: When are the common app essays released?"
                  underlineColorAndroid="transparent"
                  multiline={true}
                  onChangeText={(text) => this.setState({answer: text})}
                  onSubmitEditing={(text) => this.setState({answer: text})}
              />
              <Button
                buttonStyle={styles.addBtn}
                title='Post'
                onPress={() => this.onPressPostAnswer()}/>
              <Button
                buttonStyle={styles.addBtn}
                title='Cancel'
                onPress={() => this.setState({ isAnswerModalVisible: false})}/>
            </View>
          </Modal>
        </View>

        <View style={styles.itemList}>
          <SectionList
            sections={this.state.jedisSectioned}
            // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
            renderItem={({item}) => this.listItemRenderer(item)}
            ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
            keyExtractor={this._keyExtractor}
            contentContainerStyle = {{alignItems: 'center'}}
            onRefresh = {() => this.resetList()}
            refreshing = {this.state.refreshing}
            removeClippedSubviews = {true}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  profileView: {
    width: Metrics.screenWidth,
    backgroundColor:'white',
    padding: 15,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  itemList: {
    height: Metrics.screenHeight*.65,
    width: Metrics.screenWidth,
    paddingTop: 10
  },
  modalView: {
    height: Metrics.screenHeight/2,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 40
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 18
  },
  inputText: {
    width: '100%',
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top",
    padding: 10,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    backgroundColor: 'white',
    marginVertical: 10
  },
  addBtn: {
    backgroundColor : Colors.lightPurple, 
    width : Metrics.screenWidth * .8, 
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 20, margin : 10
  },
});
