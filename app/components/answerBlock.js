import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  TextInput
} from "react-native";
import Metrics from "../Themes/Metrics";
import Colors from "../Themes/Colors";
import Images from "../Themes/Images";
import ReadMore from "react-native-read-more-text";
import {
  Card,
  ListItem,
  Button,
  Slider,
  CheckBox,
  SearchBar,
  Avatar
} from "react-native-elements";
import firebase from "firebase";
import Modal from "react-native-modal";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";

export default class AnswerBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      itemName: "",
      category: "",
      price: "",
      description: "",
      convoKey: "",
      userName: "",
      sellerName: "",
      previousMessage: false,
      isModalVisible: false,
      totalVotes: 0,
      upVotes: 0,
      downVotes: 0,
      upVoted: false,
      downVoted: false,
      voted: false
    };
  }

  componentWillMount() {
    this.restoreVote();
  }

  onPressUpvote = async () => {
    if (!this.state.voted) {
      // console.log("inside");
      await this.setState({ upVoted: true, downVoted: false });
      this.saveVote("up");
    } else {
      if (this.state.upVoted) {
        var vote = "up";
        this.removeVote(vote);
        //remove vote
      } else {
        //console.log("up");
        await this.setState({ upVoted: true, downVoted: false });
        this.saveVote("up");
      }
    }
  };

  onPressDownvote = async () => {
    if (!this.state.voted) {
      //console.log("down");
      await this.setState({ downVoted: true, upVoted: false });
      this.saveVote("down");
    } else {
      if (this.state.downVoted) {
        var vote = "down";
        this.removeVote(vote);
        //remove vote
      } else {
        //console.log("down");
        await this.setState({ downVoted: true, upVoted: false });
        this.saveVote("down");
      }
    }
  };

  removeVote = async vote => {
    var ref = firebase
      .database()
      .ref("forum")
      .child(this.props.forumLocation)
      .child("answers")
      .child(this.props.jedi.key)
      .child("voted")
      .child(firebase.auth().currentUser.uid)
      await ref.remove();
    if (vote == "up") {
      var upVotes = this.state.upVotes;
      await this.setState({ upVotes: upVotes });
    } else if (vote == "down") {
      var downVotes = this.state.downVotes;
      await this.setState({ downVotes: downVotes });
    }
  };

  openAnswerScreen() {
    //console.log('pressed ');
    this.props.purchaseItem(this.props.jedi);
  }

  saveVote = val => {
    firebase
      .database()
      .ref("forum")
      .child(this.props.forumLocation)
      .child("answers")
      .child(this.props.jedi.key)
      .child("voted")
      .child(firebase.auth().currentUser.uid)
      .set({ val });
  };

  restoreVote = async () => {
    await firebase
      .database()
      .ref("forum")
      .child(this.props.forumLocation)
      .child("answers")
      .child(this.props.jedi.key)
      .child("voted")
      .on("value", async snapshots => {
        if (snapshots.hasChild(firebase.auth().currentUser.uid)) {
          await this.setState({ voted: true });
          if (
            snapshots.child(firebase.auth().currentUser.uid).val().val == "up"
          ) {
            //console.log("snapshot" + JSON.stringify(snapshots.child(firebase.auth().currentUser.uid).val().val));
            await this.setState({ upVoted: true, downVoted: false });
          } else {
            //console.log("snapshot" + JSON.stringify(snapshots.child(firebase.auth().currentUser.uid).val().val));
            await this.setState({ downVoted: true, upVoted: false });
          }
        } else await this.setState({ upVoted: false, downVoted: false });

        let upVotes = 0;
        let downVotes = 0;
        await this.setState({ totalVotes: snapshots.numChildren() });
        snapshots.forEach(snapshot => {
          let result = snapshot.val();
          if (result.val == "up") {
            upVotes++;
          } else if (result.val == "down") {
            downVotes++;
          }
        });
        await firebase
          .database()
          .ref("forum")
          .child(this.props.forumLocation)
          .child("answers")
          .child(this.props.jedi.key)
          .update({
            upvotes: upVotes,
            downvotes: downVotes,
            totalUpvotes: upVotes - downVotes
          });
        await this.setState({ upVotes: upVotes, downVotes: downVotes });
      });
  };

  render() {
    return (
      <View>
        <View style={styles.cardView}>
          <Card style={styles.card}>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size="large"
                source={
                  this.props.jedi.profileImage
                    ? { uri: this.props.jedi.profileImage }
                    : Images.profile
                }
                activeOpacity={0.7}
                rounded
              />
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 20,
                  fontWeight: "bold",
                  lineHeight: 30
                }}
              >
                {this.props.jedi.author}
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}
              >
                <Text
                  style={styles.cardText}
                  onPress={() => this.openAnswerScreen()}
                  z
                >
                  {this.props.jedi.answer}
                </Text>
              </ReadMore>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text onPress={() => this.onPressUpvote()}>
                {/* totalUpvotes: {this.state.upVotes - this.state.downVotes}  */}
                <FontAwesome
                  style={
                    this.state.upVoted
                      ? styles.buttonPressed
                      : styles.buttonNotPressed
                  }
                  name="thumbs-o-up"
                  size={25}
                  color={Colors.lightPurple}
                />
                &nbsp;&nbsp; {this.state.upVotes} &nbsp;&nbsp;
              </Text>
              <Text onPress={() => this.onPressDownvote()}>
                <FontAwesome
                  style={
                    this.state.downVoted
                      ? styles.buttonPressed
                      : styles.buttonNotPressed
                  }
                  name="thumbs-o-down"
                  size={25}
                  color={Colors.lightPurple}
                />
                &nbsp;&nbsp; {this.state.downVotes}
              </Text>
            </View>
          </Card>
        </View>
      </View>
    );
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <Text style={{ color: "#888", marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text style={{ color: "#888", marginTop: 5 }} onPress={handlePress}>
        Show less
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
  },
  pictureDetails: {
    flexDirection: "column",
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  textStyles: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 15
  },
  ratingButtons: {
    flexDirection: "row"
  },
  buttonPressed: {
    fontWeight: "bold",
    color: "#03A9F4"
  },
  buttonNotPressed: {
    fontWeight: "bold",
    color: "#999999"
  }
});
