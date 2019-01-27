import React from 'react';
import {
    StyleSheet, Text, View, Image, ActivityIndicator, SectionList, KeyboardAvoidingView,
    SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, AsyncStorage
} from 'react-native';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Avatar, Button } from 'react-native-elements'
import { Input } from "native-base";
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import firebase from 'firebase';
import UpcomingBlock from '../components/upcomingBlock'
import Metrics from '../Themes/Metrics';
import * as Expo from "expo";
import LoggedOut from '../components/loggedOutScreen';

export default class UpcomingScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        return {
            headerTitle: 'Upcoming Appointments',
            title: 'Upcoming Appointments',
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

    constructor(props) {
        super(props);
        this.state = {
            portal: '',
            loading: false,
            refreshing: false,
            userId: '',
            upcomingApts: [{ title: 'upcoming', data: [] }],
            hasLoggedIn: false,
            amount: 0
        }
    }


    componentWillMount = async () => {
        await this.checkIfUserLoggedIn();
        var userUID = firebase.auth().currentUser.uid;
        var that = this;
        await firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                //console.log(" User is signed in.", that.state.portal);

                await firebase.database().ref('users').child(userUID).on('value', async function (snapshot) {
                    var childKey = snapshot.key;
                    var childData = snapshot.val();
                    childData.key = childKey;
                    //console.log("portal1 : " + childData.portal);
                    await that.setState({ portal: childData.portal });
                    that.appendUpcoming(3, 1);
                    //   that.setState({ userName: name, profileImage : childData.profilePicture});
                });
            } else {
                //console.log(" User is not signed in.");
            }
        });

    }
    checkIfUserLoggedIn = async () => {
        const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
        if (loginCheck === "true") {
            await this.setState({ hasLoggedIn: true });
            await this.setState({ userId: firebase.auth().currentUser.uid })
            //console.log("hasLoggedIn" + this.state.hasLoggedIn);
        }
    }

    async appendUpcoming(count, start) {
        
        await this.setState({ loading: true, refreshing: true });
        var upcomingList = this.state.upcomingApts[0].data.slice();
        await firebase.database().ref('appointments').on('child_added', async (snapshot) => {
            var childKey = snapshot.key;
            var childData = snapshot.val();
            childData.key = childKey;

            if (this.state.portal == 'student') {
                console.log("studentId : " + childData.studentID + " currentID : " + this.state.userId);
                if (this.state.userId == childData.studentID) {
                    //
                    upcomingList.push(childData);
                }
            } else {
                if (this.state.userId == childData.consultantID) {
                    upcomingList.push(childData);
                }
            }
            
            await this.setState({ loading: false, refreshing: false, upcomingApts: [{ title: 'upcoming', data: upcomingList }] });
        })

    };


    _keyExtractor = (item, index) => index;
    resetList = async () => {
        await this.setState({ refreshing: true, jedisSectioned: [{ title: 'upcoming', data: [] }] });
        this.appendUpcoming(3, 1);
    }
    listItemRenderer(item) {
        const { navigation } = this.props
        return (
            <UpcomingBlock navigation = {navigation} upcoming={item}
                portal={this.state.portal} />
        );
    }

    _onChange = (formData) => //console.log(JSON.stringify(formData, null, " "));
    _onFocus = (field) => console.log("focusing", field);

    render() {
        if (!this.state.hasLoggedIn) {
            return (<LoggedOut />);
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.itemList}>
                        <SectionList
                            sections={this.state.upcomingApts}
                            // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                            renderItem={({ item }) => this.listItemRenderer(item)}
                            // renderItem={this.renderItem}
                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                            keyExtractor={this._keyExtractor}
                            contentContainerStyle={{ alignItems: 'center' }}
                            onRefresh={() => this.resetList()}
                            refreshing={this.state.refreshing}
                            removeClippedSubviews={true}
                        />
                    </View>
                </View>

            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.snow,
    },
    itemList: {
        height: Metrics.screenHeight * 0.9,
        width: Metrics.screenWidth,
        paddingTop: 10,
    },
    cardView: {
        alignSelf: "center",
        height: Metrics.screenHeight * 0.5,
        width: Metrics.screenWidth,
        marginTop: 20
    },
    input: {
        fontSize: 16,
        color: "black",
    },
    inputText: {
        width: '60%',
        alignContent: "flex-start",
        justifyContent: "flex-start",
        minHeight: 40,
        marginLeft: 20,
        textAlignVertical: "top",
        padding: 10,
        fontSize: 16,
        textDecorationLine: 'none',
        lineHeight: 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    inputAmount: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        marginTop : 10
    }, 
    label: {
        color: "black",
        fontSize: 12,
    }
});
