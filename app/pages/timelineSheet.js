
import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, 
  SectionList, ActivityIndicator, FlatList, TextInput, AsyncStorage} from 'react-native';
import { Input
  } from "native-base";
import * as firebase from 'firebase'
import TimelineBlock from '../components/timelineBlock';
import { Button } from 'react-native-elements'
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Metrics from '../Themes/Metrics';
import { globalStyles } from '../Themes/Styles';
import Colors from '../Themes/Colors'
import AddGoalModal from '../components/addGoalModal'


export default class TimelineSheet extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate, state } = navigation;
    return {
      headerTitle: params.year + " Year",
      title: 'Timeline',
      headerRight: (
        <Feather
          style={{ marginRight: 15}}
          onPress={state.params.handleAdd}
          name="plus-circle"
          size={Metrics.icons.medium}
          color={Colors.lightPurple}
        />
      ),
      }
  };

  constructor(props) {
     super(props);
     this.state ={
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
       goalsArray: [],
       isModalVisible: false,
       goalText: '',
       year: '',
       placeholder: 'Apply to 10 Schools?',
       blockSelected: false,
     }
     //console.log("timeline " + JSON.stringify(props));
   }

   _keyExtractor = (item) => item.key;

   componentWillMount =async() => {
     this.props.navigation.setParams({handleAdd : this.toggleModal});
     await this.setState({ year: this.props.navigation.state.params.year});
     var goalsArrayRetrieved = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     //console.log("goals array retrieved " + goalsArrayRetrieved);
     //console.log("type goals array pre " + typeof goalsArrayRetrieved);
     goalsArrayRetrieved = await JSON.parse(goalsArrayRetrieved);
     //console.log("type goals array post " + typeof goalsArrayRetrieved);
     if ((goalsArrayRetrieved !== null) && (goalsArrayRetrieved.length !== 0)) {
       await this.setState({goalsArray: goalsArrayRetrieved});
   }
   //await console.log("goals array state post " + this.state.goalsArray);
 }

   toggleModal = async() => {
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressPushGoal = async() => {
     var goals = this.state.goalsArray;
     if (!this.state.blockSelected) {
      goals.push(this.state.goalText);
     } else {
       var indexWord = goals.indexOf(this.state.placeholder);
       console.log("indexWord " + indexWord);
       await goals.splice(indexWord,1);
       console.log("goals array spliced " + goals);
       goals.push(this.state.goalText);
       console.log("goals spliced post/'" + JSON.stringify(this.state.goalsArray));
       await this.setState({blockSelected: false});
     }
     await this.setState({ goalsArray: goals});
     //console.log("goals array on push" + JSON.stringify(this.state.goalsArray));
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressSaveGoals = async() => {
     //console.log("goals array pre " + JSON.stringify(this.state.goalsArray));
     await AsyncStorage.setItem(JSON.stringify(this.state.year), JSON.stringify(this.state.goalsArray));
     var testArray = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     //console.log("goals array post " + JSON.stringify(testArray));
   }

   listItemRenderer =(item) => {
     var that = this;
    //  console.log("item " + JSON.stringify(item));
    //  console.log("item " + item.item);
     return (
       <TouchableOpacity onPress={() => that.editBlock(item)}>
          <TimelineBlock
          jedi={item}/>
       </TouchableOpacity>
     );

   }

   editBlock = async(item) => {
    console.log("item " + item.item);
    await this.setState({placeholder: item.item, blockSelected: true});
    this.toggleModal();
  }


  // _onPressBack(){
  //   const {goBack} = this.props.navigation
  //   goBack()
  // }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <FlatList
          data={this.state.goalsArray}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.listItemRenderer}
        />
        <TouchableOpacity style = {styles.saveBtn} onPress={(item) => this.onPressSaveGoals(item)}>
          <Text style = {styles.saveTxt}>SAVE</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  
        <Modal
        isVisible={this.state.isModalVisible}
        onBackdropPress={() => this.setState({ isModalVisible: false })}
        
        onPress={() => this.onPressPushGoal()}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Add a Goal
          </Text>
          <Input style={ styles.inputText }
              placeholder={this.state.placeholder}
              underlineColorAndroid="transparent"
              multiline={true}
              onChangeText={(text) => this.setState({goalText: text})}
              onSubmitEditing={(text) => this.setState({goalText: text})}
              />
          <Button
            buttonStyle={styles.addBtn}
            title='Add'
            onPress={() => this.onPressPushGoal()}/>
        </View>
      </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalView: {
    height: Metrics.screenHeight/3,
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
  addBtn: {
    backgroundColor : Colors.lightPurple, 
    width : Metrics.screenWidth * .8, 
    borderColor : 'transparent', 
    borderWidth : 0, 
    borderRadius : 20, margin : 10
  },
  inputText: {
    width: '100%',
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
  },
  saveBtn: {
    width: Metrics.screenWidth,
    height: 70,
    backgroundColor: Colors.lightPurple,
    alignItems:'center',
    justifyContent: 'center'
  },
  saveTxt: {
    color: 'white',
    fontSize: 20,
  },
});
