import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Button,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Metrics from "../Themes/Metrics";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import firebase from "firebase";
import { Facebook } from "expo";
import Modal from "react-native-modal";
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { WebBrowser } from "expo";
import GenerateForm from "react-native-form-builder";
import { View, Text, Row } from "native-base";
import { globalStyles } from "../Themes/Styles";
import Functions from "../Themes/Functions";
import Colors from "../Themes/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const stripe_url = "https://api.stripe.com/v1/";
// const secret_key = firebase.config().stripe.token;
//create token
const stripe = require("stripe-client")("pk_test_qkgEe4JVlRcszR12vsEMODWU");

const fieldsSignUp = [
  {
    type: "text",
    name: "firstName",
    required: true,
    icon: "ios-person",
    label: "First Name"
  },
  {
    type: "text",
    name: "lastName",
    icon: "ios-lock",
    required: true,
    label: "Last Name"
  },
  {
    type: "text",
    name: "emailAddress",
    required: true,
    icon: "ios-person",
    label: "Email Address"
  },
  {
    type: "password",
    name: "password",
    icon: "ios-lock",
    required: true,
    label: "Password"
  },
  {
    type: "text",
    name: "skypeName",
    icon: "ios-lock",
    required: false,
    label: "Skype Username (if you have one)"
  }
];

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoginModalVisible: false,
      isSignUpModalVisible: false,
      signUpName: "",
      signUpEmail: "",
      signUpPassword: "",
      loginEmail: "",
      loginPassword: "",
      errorMessageSignUp: null,
      errorMessageLogin: "",
      skypeNameValid: false,
      skypeName: "",
      skypeAlertClear: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.checkIfUserLoggedIn();
  }

  toggleLoginModal = async () => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      this.setState({ isLoginModalVisible: false });
      alert("You are already logged user.");
    } else {
      this.setState({ isLoginModalVisible: true });
    }
  };

  toggleSignUpModal = () => {
    this.setState({ isSignUpModalVisible: !this.state.isSignUpModalVisible });
  };

  checkSkype = async () => {
    await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync(
      "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1533498381&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D360605%26redirect_uri%3Dhttps%253A%252F%252Fsecure.skype.com%252Fportal%252Flogin%253Freturn_url%253Dhttps%25253A%25252F%25252Fsecure.skype.com%25252Fportal%25252Foverview%26response_type%3Dpostgrant%26state%3DNECRz3UFw8Yx%26site_name%3Dlw.skype.com&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedFlight67"
    );
  };

  skypeAlert = async formValues => {
    if (formValues.skypeName == "") {
      await Alert.alert(
        "Skype",
        "You Will Need a Skype Username for Messaging",
        [
          { text: "Make One Now", onPress: () => this.makeSkype() },
          { text: "Check If I Have One", onPress: () => this.checkSkype() },
          {
            text: "Make One Later",
            onPress: () =>
              this.setState({ skypeAlertClear: true }, this.completeSignUp),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    } else {
      this.setState({ skypeAlertClear: true })
      return this.completeSignUp()
    }
  };

  makeSkype = async () => {
    await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync(
      "https://signup.live.com/signup?lcid=1033&wa=wsignin1.0&rpsnv=13&ct=1533497773&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3a%2f%2flw.skype.com%2flogin%2foauth%2fproxy%3fclient_id%3d578134%26redirect_uri%3dhttps%253A%252F%252Fweb.skype.com%26source%3dscomnav%26form%3dmicrosoft_registration%26site_name%3dlw.skype.com%26fl%3dphone2&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedF&fl=phone2&uaid=b20753c004f74358a6b9f4925476f546&lic=1"
    );
  };

  verifyEmail = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        // Verification email sent.
        //console.log("email Verification sent");
        Alert.alert(
          "Email Verification",
          "We've sent a user verification email. Please click the link in your email inbox to be verified as a user",
          [
            {
              text: "OK",
              onPress: () => this.setState({ skypeAlertClear: true }),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      })
      .catch(function(error) {
        // Error occurred. Inspect error.code.
      });
  };

  completeSignUp = async () => {
    const formValues = this.formGenerator.getValues();
    if (!this.state.skypeAlertClear) {
      this.skypeAlert(formValues);
      return;
    }
    this.verifyEmail();
    var user = firebase.auth().currentUser;
    const portalType = await AsyncStorage.getItem("portal");
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .child("firstName")
      .set(formValues.firstName);
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .child("lastName")
      .set(formValues.lastName);
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .child("portal")
      .set(portalType);
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .child("email")
      .set(this.state.signUpEmail);
    firebase
      .database()
      .ref("users")
      .child(user.uid)
      .child("skypeName")
      .set(this.state.skypeName);
    await AsyncStorage.setItem("hasLoggedIn", "true");
    this.toggleSignUpModal();

    this.props.navigation.navigate("Home");

    //create stripe account if he is a consultant
    const selectedPortal = await AsyncStorage.getItem("portal");
    if (selectedPortal === "consultant") {
      var consultantDetails = {
        type: "custom",
        email: formValues.emailAddress,
        business_name: formValues.firstName + " " + formValues.lastName
      };

      var formBody = [];
      for (var property in consultantDetails) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(consultantDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      var that = this;
      return fetch(stripe_url + "accounts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + "sk_test_api6b2ZD9ce6IRqwOLqaFbZU",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
      })
        .then(response => {
          response.json().then(solved => {
            //console.log("Account " + JSON.stringify(solved));
            Alert.alert(
              "Your custom stripe account is registered to this platform correctly."
            );
            firebase
              .database()
              .ref("stripe_customers")
              .child(firebase.auth().currentUser.uid)
              .child("account")
              .set({
                id: solved.id,
                email: solved.email,
                type: solved.type,
                created: solved.created
              });
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  onPressSaveNewUser = async () => {
    const formValues = this.formGenerator.getValues();
    //console.log('FORM VALUES', formValues);

    await this.setState({
      signUpEmail: formValues.emailAddress,
      signUpPassword: formValues.password,
      isLoading: true
    });
    //console.log("email " + this.state.signUpEmail);
    //console.log("password " + this.state.signUpPassword);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(
        this.state.signUpEmail,
        this.state.signUpPassword
      )
      .then(() => {
        this.setState({isLoading: false})
        return this.completeSignUp
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else if (errorCode == "auth/email-already-in-use") {
          alert("This email already has an account");
        } else if (errorCode == "auth/invalid-email") {
          alert("Please enter a valid email");
        } else {
          alert(errorMessage);
        }
        //console.log(error);
      });
  };

  onPressSaveLogin = async () => {
    this.setState({isLoading: true})
    var result = await firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.loginEmail,
        this.state.loginPassword
      )
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          alert("Wrong password.");
        } else {
          alert(errorMessage);
        }
        //console.log(error);
      });

    if (result) {
      //console.log("email " + this.state.loginEmail);
      //console.log("password " + this.state.loginPassword);
      // firebase.database().ref('users').child(user.uid).child('name');
      await AsyncStorage.setItem("hasLoggedIn", "true");

      /// pushnotification token save
      await Functions.registerForPushNotificationsAsync(result.user.uid);

      await this.setState({ isLoginModalVisible: false, isLoading: false });
      this.props.navigation.navigate("Home");
    }
  };

  onPressMakeAccount = async () => {
    await this.setState({ isLoginModalVisible: false });
    //console.log("login modal " + this.state.isLoginModalVisible);
    await this.setState({ isSignUpModalVisible: true });
    //console.log("sign up modal " + this.state.isSignUpModalVisible);
  };

  checkIfUserLoggedIn = async () => {
    var _this = this;
    var user = firebase.auth().currentUser;
    if (user) {
      // console.warn('user already logged in');
      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // console.warn('Prompt log in');
      // _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
    }
  };

  async logInWithFacebook() {
    //This line obtains a token. A good guide on how to set up Facebook login
    // could be found on Expo website https://docs.expo.io/versions/latest/sdk/facebook.html
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      "344994569331151",
      { permissions: ["public_profile", "email"] }
    );
    if (type === "success") {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      const name = (await response.json()).name;
      //Signs up the user in Firebase authentication. Before being able to use
      //this make sure that you have Facebook enabled in the sign-in methods
      // in Firebase
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      var result = await firebase.auth().signInWithCredential(credential);

      /// pushnotification token save
      await Functions.registerForPushNotificationsAsync(result.user.uid);

      //After signing in/up, we add some additional user info to the database
      //so that we can use it for other things, e.g. users needing to know
      //names of each other
      firebase
        .database()
        .ref("users")
        .child(result.uid)
        .child("name")
        .set(name);

      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // this.logInWithFacebook();
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.feedbackBox}>
          <Text style={styles.textStyles}>
            Here at MoveItMoveIt, we appreciate your usage of the app.{" "}
          </Text>

          <View style={styles.buttonsRow}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="shield"
              size={Metrics.icons.large}
              color={Colors.lightPurple}
              onPress={() => this.toggleLoginModal()}
            />
            <MaterialCommunityIcons
              style={styles.icon}
              name="facebook"
              size={Metrics.icons.large}
              color={Colors.lightPurple}
              onPress={() => this.logInWithFacebook()}
            />
          </View>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {this.state.isSignUpModalVisible === true ? (
              <Modal
                isVisible={this.state.isSignUpModalVisible}
                onBackdropPress={() =>
                  this.setState({ isSignUpModalVisible: false })
                }
                backdropColor={"grey"}
                style={styles.signupModalView}
              >
                <ScrollView>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Please Sign Up!</Text>
                    <View
                      style={{
                        width: Metrics.screenWidth - 40,
                        height: Metrics.screenHeight
                      }}
                    >
                      <GenerateForm
                        scrollViewProps={{ overScrollMode: "never" }}
                        fields={fieldsSignUp}
                        ref={async c => {
                          this.formGenerator = c;
                        }}
                      />
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <TouchableOpacity
                          style={styles.saveBtnView}
                          onPress={() => this.onPressSaveNewUser()}
                        >
                          <Text style={styles.saveBtn}>{this.state.isLoading ? <ActivityIndicator /> : null} SAVE</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </Modal>
            ) : (
              <Modal
                isVisible={this.state.isLoginModalVisible}
                onBackdropPress={() =>
                  this.setState({ isLoginModalVisible: false })
                }
                backdropColor={"grey"}
                style={styles.loginModalView}
              >
                <View style={globalStyles.modalContainer}>
                  <Text style={globalStyles.modalTitle}>Please Login!</Text>
                  <TextInput
                    style={globalStyles.defaultTextInput}
                    value={this.state.loginEmail}
                    onChangeText={loginEmail => this.setState({ loginEmail })}
                    placeholder="Email"
                    underlineColorAndroid="transparent"
                  />
                  <TextInput
                    style={globalStyles.defaultTextInput}
                    value={this.state.loginPassword}
                    secureTextEntry={true}
                    onChangeText={loginPassword =>
                      this.setState({ loginPassword })
                    }
                    placeholder="Password"
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={() => this.onPressSaveLogin()}
                  >
                    <Text style={globalStyles.btnText}>{this.state.isLoading ? <ActivityIndicator /> : null} SAVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={globalStyles.btn}
                    onPress={() => this.onPressMakeAccount()}
                  >
                    <Text style={globalStyles.btnText}>MAKE AN ACCOUNT</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
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
    alignItems: "center",
    justifyContent: "center"
  },
  feedbackBox: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.screenHeight * 0.3,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    borderStyle: "solid",
    borderColor: Colors.lightPurple,
    borderWidth: 0.5,
    borderRadius: Metrics.screenWidth * 0.05,
    backgroundColor: "white"
  },
  textStyles: {
    fontStyle: "italic",
    alignItems: "center",
    textAlign: "center",
    fontSize: 20
  },
  SaveBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40
  },
  logoutButton: {
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenHeight * 0.05,
    borderWidth: 1,
    marginBottom: 55,
    backgroundColor: Colors.lightPurple,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: Metrics.screenWidth * 0.5
  },
  modalView: {
    height: Metrics.screenHeight,
    borderStyle: "solid",
    borderWidth: 1.5,
    borderColor: Colors.lightPurple,
    borderTopWidth: 25,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: Colors.lightPurple,
    // marginBottom: 80,
    overflow: "hidden"
  },
  modalText: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold"
  },
  inputText: {
    alignItems: "center",
    minWidth: 200,
    height: 40,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    backgroundColor: "white"
  },
  modalBtn: {
    alignItems: "center",
    height: 40,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.lightPurple
  },
  btnText: {
    color: "white"
  },
  saveBtn: {
    color: "white"
  },
  saveBtnView: {
    // position: "absolute",
    // bottom: 20,
    alignItems: "center",
    height: 40,
    width: Metrics.screenWidth * 0.8,
    marginBottom: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.lightPurple
  },
  loginModalView: {
    position: "absolute",
    width: Metrics.screenWidth * 0.9,
    top: Metrics.screenHeight / 17
  },
  signupModalView: {
    // position: "absolute",
    // width: Metrics.screenWidth * 0.9,
    // top: Metrics.screenHeight / 20
  }
});
