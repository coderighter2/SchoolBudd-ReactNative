import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Avatar } from 'react-native-elements'
import Images from '../Themes/Images';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../Themes/Colors'
import Metrics from '../Themes/Metrics';

export default class AnswerScreen extends React.Component {
    
  static navigationOptions = {
    headerTitle: 'Answer',
  };

  constructor(props) {
    super(props);
    this.state = {
      profileName: '',
      profileImage : '',
      userID: firebase.auth().currentUser.uid,
      question: '',
      topic : '',
      answer: '',
      totalVotes: 0,
      upVotes : 0,
      downVotes : 0,
      voted : false,
      key: '',
      forumLocation: '',
      upVoted : false,
      downVoted : false,
    }
  }

  componentWillMount= async() => {

    item = this.props.navigation.state.params.item;

    await this.setState({
      question : this.props.navigation.state.params.question, 
      topic : this.props.navigation.state.params.topic,
      profileName: item.author, 
      profileImage : item.profileImage, 
      answer : item.answer,
      upVotes: item.upvotes,
      downVotes: item.downvotes,
      forumLocation: this.props.navigation.state.params.forumLocation,
      key: item.key
    })
  } 
  restoreVote = async() => {
    await firebase.database().ref('forum').child(this.state.forumLocation).child('answers')
    .child(this.state.key).child('voted').on('value',async(snapshots)=> {
      if(snapshots.hasChild(firebase.auth().currentUser.uid)){
        await this.setState({voted: true});
        if (snapshots.child(firebase.auth().currentUser.uid).val().val == "up") {
          console.log("snapshot " + JSON.stringify(snapshots.child(firebase.auth().currentUser.uid).val().val));
          await this.setState({upVoted : true, downVoted: false});
        } else {
          console.log("snapshot " + JSON.stringify(snapshots.child(firebase.auth().currentUser.uid).val().val));
          await this.setState({downVoted : true, upVoted: false});
        }
      } else await this.setState({upVoted: false, downVoted: false});

      let upVotes = 0;
      let downVotes = 0;
      await this.setState({totalVotes : snapshots.numChildren()});
      snapshots.forEach(snapshot=>{
        let result = snapshot.val();
        if(result.val=="up"){
          upVotes++;
        } else if(result.val=="down") {
          downVotes++;
        }
      });
      await firebase.database().ref('forum').child(this.state.forumLocation).child('answers')
      .child(this.state.key).update({
        upvotes : upVotes, downvotes : downVotes, totalUpvotes : upVotes-downVotes
      })
      await this.setState({upVotes : upVotes, downVotes : downVotes})
    })
  }

  onPressUpvote =async() => {
    if(!this.state.voted){
      console.log("up1");
      await this.setState({upVoted : true, downVoted: false});
      this.saveVote("up");
    } else {
      if (this.state.upVoted) {
        var vote = "up";
        this.removeVote(vote);
        //remove vote
      } else {
        console.log("up2");
        await this.setState({upVoted : true, downVoted: false});
        this.saveVote("up");
      }   
    }    
  }

  onPressDownvote =async() => {
    if(!this.state.voted){
      console.log("down");
      await this.setState({downVoted : true, upVoted: false});
      this.saveVote("down");
    } else {
      if (this.state.downVoted) {
        var vote = "down";
        this.removeVote(vote);
        //remove vote
      } else {
        console.log("down");
        await this.setState({downVoted : true, upVoted: false});
        this.saveVote("down");
      }   
    }
  }

  removeVote = async(vote) => {
    var ref = firebase.database().ref('forum').child(this.state.forumLocation).child('answers')
    .child(this.state.key).child('voted');
    await ref.remove();
    if (vote == "up") {
      var upVotes = this.state.upVotes;
      await this.setState({upVotes: upVotes});
    } else if (vote == "down") {
      var downVotes = this.state.downVotes;
      await this.setState({downVotes: downVotes});
    }
  }

  saveVote = (val) => {
    firebase.database().ref('forum').child(this.state.forumLocation).child('answers')
    .child(this.state.key).child('voted').child(firebase.auth().currentUser.uid).set(
      { val : val}
    );
  }
 
  render() {
    return( 
      <View style={styles.container}>
          <View>
            <Text style={{fontSize : 28, width : '100%', fontWeight : 'bold'}}>{this.state.question}</Text>
            <Text style={{fontSize: 13, color : '#595959', marginTop: 10}}>Topic : {this.state.topic}</Text>
          </View>
          
          <View style={{flexDirection : 'row', marginTop: 15}}>
            <Avatar
              size="large"
              source={this.state.profileImage?{uri : this.state.profileImage} : Images.profile}
              activeOpacity={0.7}
              rounded
            />
            <Text style={{fontSize : 15, marginLeft :20, fontWeight : 'bold', lineHeight : 30}}>{this.state.profileName}</Text>
          </View>
          <View style={{marginTop :15}}>
            <Text style={styles.cardText}>
              {this.state.answer}
            </Text>                
          </View>
          <View style = {styles.votesView}>
            <Text style={styles.textStyles}>
              <FontAwesome style={this.state.upVoted ? styles.buttonPressed : styles.buttonNotPressed} 
                  name="thumbs-o-up"
                  size={24}
                  color={Colors.lightPurple}
                  onPress={() => this.onPressUpvote()}
                  />&nbsp;&nbsp; {this.state.upVotes} &nbsp;&nbsp;&nbsp;
                <FontAwesome style={this.state.downVoted ? styles.buttonPressed : styles.buttonNotPressed}
                  name="thumbs-o-down"
                  size={24}
                  color={Colors.lightPurple}
                  onPress={() => this.onPressDownvote()}
                />&nbsp;&nbsp; {this.state.downVotes}
              </Text> 
          </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding : 20,
    backgroundColor : 'white'
    // alignItems: 'center',
  },
  votesView:{
    flexDirection: 'row',
    width: Metrics.screenWidth,
    height: 50,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingLeft: 30,
    backgroundColor: Colors.silver
  },
  buttonPressed: {
    fontWeight : 'bold',
    color: '#03A9F4'
  },
  buttonNotPressed: {
    fontWeight : 'bold',
    color: '#999999'
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 17,
  },
});