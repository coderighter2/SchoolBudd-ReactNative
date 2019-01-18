
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
import AskQuestionModal from '../components/askQuestionModal'


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
     }
     console.log("timeline " + JSON.stringify(props));
   }

   _keyExtractor = (item, index) => item.key;

   componentWillMount =async() => {
     this.props.navigation.setParams({handleAdd : this.toggleModal});
     await this.setState({ year: this.props.navigation.state.params.year});
     var goalsArrayRetrieved = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     console.log("goals array retrieved " + goalsArrayRetrieved);
     console.log("type goals array pre " + typeof goalsArrayRetrieved);
     goalsArrayRetrieved = await JSON.parse(goalsArrayRetrieved);
     console.log("type goals array post " + typeof goalsArrayRetrieved);
     if ((goalsArrayRetrieved !== null) && (goalsArrayRetrieved.length !== 0)) {
       await this.setState({goalsArray: goalsArrayRetrieved});
   }
   await console.log("goals array state post " + this.state.goalsArray);
 }

   toggleModal = async() => {
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressPushGoal = async() => {
     var goals = this.state.goalsArray;
     goals.push(this.state.goalText);
     await this.setState({ goalsArray: goals});
     console.log("goals array on push" + JSON.stringify(this.state.goalsArray));
     this.setState({isModalVisible: !this.state.isModalVisible});
   }

   onPressSaveGoals = async() => {
     console.log("goals array pre " + JSON.stringify(this.state.goalsArray));
     await AsyncStorage.setItem(JSON.stringify(this.state.year), JSON.stringify(this.state.goalsArray));
     var testArray = await AsyncStorage.getItem(JSON.stringify(this.state.year));
     console.log("goals array post " + JSON.stringify(testArray));
   }

   listItemRenderer =(item) => {
     return (
       <TimelineBlock
       jedi={item}/>
     );
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
        <TouchableOpacity style = {styles.saveBtn} onPress={() => this.onPressSaveGoals()}>
          <Text style = {styles.saveTxt}>SAVE</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <AskQuestionModal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            onChangeText={(text) => this.setState({goalText: text})}
            onSubmitEditing={(text) => this.setState({goalText: text})}
            onPress={() => this.onPressPushGoal()}
          />
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
    height: Metrics.screenHeight*.3,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 15,
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
