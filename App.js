import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  AsyncStorage,
  SafeAreaView
} from "react-native";
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator
} from "react-navigation";
import { Facebook } from "expo";
import * as pages from "./app/pages";
import firebase from "firebase";
import Stripe from "firebase";
import SelectPortal from "./app/pages/selectPortal";
import Functions from "./app/Themes/Functions";
import { Provider } from "react-redux";
import { store } from "./app/state/store";
import Colors from "./app/Themes/Colors";

var config1 = {
  apiKey: "AIzaSyBUcTA24OEVHAoOGOUCAJwsG77rOBU-LdQ",
  authDomain: "schoolbudd-ac7fc.firebaseapp.com",
  databaseURL: "https://schoolbudd-ac7fc.firebaseio.com",
  projectId: "schoolbudd-ac7fc",
  storageBucket: "gs://schoolbudd-ac7fc.appspot.com",
  messagingSenderId: "1092951149798"
};
firebase.initializeApp(config1);
// Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');

const MessagesNav = StackNavigator(
  {
    MessagesScreen: { screen: pages.Messages },
    MessageTableViewScreen: { screen: pages.MessagesList }
  },
  {
    initialRouteName: "MessageTableViewScreen",
    title: "Messages"
  }
);

const ProfileNavStudent = TabNavigator(
  {
    ProfileCard: { screen: pages.StudentProfileCard },
    StudentBasicInfo: { screen: pages.StudentBasicInfo },
    Feedback: { screen: pages.Feedback }
  },
  {
    // Default config for all screens
    tabBarPosition: "top",
    animationEnabled: true,
    swipeEnabled: true,
    initialRouteName: "StudentBasicInfo",
    tabBarOptions: {
      labelStyle: {
        fontSize: 17
      }
    }
  }
);

const ProfileNavConsultant = TabNavigator(
  {
    Profile: { screen: pages.ConsultantProfileCard },
    BasicInfo: { screen: pages.ProfileConsultantBasicInfo },
    Preferences: { screen: pages.ConsultantProfilePreferences }
  },
  {
    tabBarPosition: "top",
    animationEnabled: true,
    swipeEnabled: true,
    initialRouteName: "BasicInfo",
    tabBarOptions: {
      labelStyle: {
        fontSize: 17
      }
    }
  }
);

const HomeStackNav = StackNavigator(
  {
    Home: { screen: pages.Feedback }
  },
  {
    title: "Home"
  }
);

const LoginStackNav = StackNavigator({
  Login: { screen: pages.Login },
  Home: { screen: pages.Feedback }
});

const LogoutNav = StackNavigator(
  {
    Logout: { screen: pages.Logout },
    SelectPortalScreen: { screen: pages.SelectPortal },
    LoginScreen: { screen: pages.Login }
  },
  {
    initialRouteName: "Logout",
    title: "Logout"
  }
);

const UpcomingNav = StackNavigator({
  UpcomingScreen: { screen: pages.UpcomingScreen },
  InputCreditCard: { screen: pages.InputCreditCard }
});

const navigationConfig = {
  navigationOptions:  {
    headerTitle: 'Find A Consultant',
    title: 'Find A Consultant',
    headerTintColor: Colors.lightPurple,
    headerTitleStyle: {
      color: Colors.lightPurple
    }
  }
}

const FindConsultantNav = StackNavigator({
  FindConsultantScreen: { screen: pages.FindConsultant },
  SelectConsultant: { screen: pages.SelectConsultant },
  MessagesScreen: { screen: pages.Messages },
  CalendarOtherScreen: { screen: pages.CalendarOtherScreen },
  MakeAppointmentsScreen: { screen: pages.MakeAppointmentsScreen },
  InputCreditCard: { screen: pages.InputCreditCard }
}, navigationConfig);

const ForumNav = StackNavigator({
  ForumScreen: { screen: pages.Forum },
  QuestionResponsesScreen: { screen: pages.QuestionResponses },
  AnswerScreen: { screen: pages.AnswerScreen },
  AddQuestionScreen: { screen: pages.AddQuestionScreen }
});

const SetAvailabilityNav = StackNavigator({
  CalendarConsultant: { screen: pages.CalendarConsultantScreen },
  SetAvailabilityScreen: { screen: pages.SetAvailabilityScreen }
});

const InternshipsNav = StackNavigator(
  {
    Internships: { screen: pages.Internships },
    ResourcesScreen: { screen: pages.Resources }
  },
  {
    headerMode: "none"
  }
);

const StudyMaterialsNav = StackNavigator(
  {
    StudyMaterials: { screen: pages.StudyMaterial },
    ResourcesScreen: { screen: pages.Resources }
  },
  {
    headerMode: "none"
  }
);

const GoalsTimelineNav = StackNavigator(
  {
    GoalsTimeline: { screen: pages.GoalsTimeline },
    ResourcesScreen: { screen: pages.Resources },
    TimelineSheet: { screen: pages.TimelineSheet }
  },
  {
    headerMode: "none"
  }
);

const SATACTNav = StackNavigator(
  {
    SATACT: { screen: pages.SATACTPrep },
    ResourcesScreen: { screen: pages.Resources }
  },
  {
    headerMode: "none"
  }
);

const CollegPrepNav = StackNavigator(
  {
    CollegePrep: { screen: pages.CollegePrep },
    ResourcesScreen: { screen: pages.Resources }
  },
  {
    headerMode: "none"
  }
);

const ResourcesNav = StackNavigator({
  ResourcesScreen: { screen: pages.Resources },
  Internships: { screen: InternshipsNav },
  StudyMaterials: { screen: StudyMaterialsNav },
  GoalsTimeline: { screen: GoalsTimelineNav },
  SATACT: { screen: SATACTNav },
  CollegePrep: { screen: CollegPrepNav }
});

const AccountInfoNav = StackNavigator({
  AccountInfo: { screen: pages.AccountInfo }
});

const ConsultantNav = DrawerNavigator(
  {
    Home: { screen: HomeStackNav },
    Login: { screen: LoginStackNav },
    Profile: { screen: ProfileNavConsultant },
    Forum: { screen: ForumNav },
    Upcoming: { screen: UpcomingNav },
    AccountInfo: { screen: AccountInfoNav },
    Logout: { screen: LogoutNav },
    SetAvailability: { screen: SetAvailabilityNav }
  },
  {
    initialRouteName: "Home",
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerWidth: 250
  }
);

const StudentNav = DrawerNavigator(
  {
    Home: { screen: HomeStackNav },
    Login: { screen: LoginStackNav },
    Profile: { screen: ProfileNavStudent },
    FindConsultant: { screen: FindConsultantNav },
    Forum: { screen: ForumNav },
    Resources: { screen: ResourcesNav },
    Upcoming: { screen: UpcomingNav },
    AccountInfo: { screen: AccountInfoNav },
    Blank: { screen: pages.Blank2 },
    Logout: { screen: LogoutNav }
  },
  {
    initialRouteName: "Home",
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerWidth: 250
  }
);

const ParentNav = DrawerNavigator(
  {
    Home: { screen: HomeStackNav },
    Login: { screen: pages.Login },
    FindConsultant: { screen: FindConsultantNav },
    Forum: { screen: ForumNav },
    Logout: { screen: pages.Logout }
  },
  {
    initialRouteName: "Home",
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerWidth: 250
  }
);

const SchoolNav = DrawerNavigator(
  {
    Home: { screen: HomeStackNav },
    Login: { screen: pages.Login },
    FindConsultant: { screen: FindConsultantNav },
    Logout: { screen: pages.Logout }
  },
  {
    initialRouteName: "Home",
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerWidth: 250
  }
);

class App extends React.Component {
  state = {
    hasDoneOnboarding: false,
    hasLoggedIn: true,
    selectedPortalStudent: false,
    selectedPortalParent: false,
    selectedPortalSchool: false,
    selectedPortalConsultant: false,
    protal: ""
  };

  componentDidMount() {
    const { protal } = this.state;
    store.subscribe(() => {
      const storeState = store.getState();
      const { drawerType } = storeState.DrawerReducer;

      switch (drawerType) {
        case "student":
          return this.setState({
            selectedPortalStudent: true,
            selectedPortalConsultant: false,
            selectedPortalSchool: false,
            selectedPortalParent: false,
            portal: drawerType
          });
        case "consultant":
          return this.setState({
            selectedPortalStudent: false,
            selectedPortalConsultant: true,
            selectedPortalSchool: false,
            selectedPortalParent: false,
            portal: drawerType
          });
        case null:
          return this.setState({
            selectedPortalStudent: false,
            selectedPortalConsultant: false,
            selectedPortalSchool: false,
            selectedPortalParent: false,
            portal: drawerType
          });
        default:
          break;
      }
    });
    this.rememberOnboarding();
    this.rememberPortal();
    console.disableYellowBox = true;
  }

  componentWillReceiveProps(nextProps) {
    console.log(store);
  }

  rememberOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem("onboarding");
      await this.setState({ hasDoneOnboarding: JSON.parse(completed) });
    } catch (error) {
      //console.log(error);
    }
  };

  rememberPortal = async () => {
    try {
      const selectedPortal = await AsyncStorage.getItem("portal");
      //console.log("selectedPortal test " + JSON.stringify(selectedPortal));
      if (selectedPortal === "student") {
        await this.setState({
          selectedPortalStudent: true,
          selectedPortalConsultant: false,
          selectedPortalSchool: false,
          selectedPortalParent: false
        });
      } else if (selectedPortal === "consultant") {
        await this.setState({
          selectedPortalStudent: false,
          selectedPortalConsultant: true,
          selectedPortalSchool: false,
          selectedPortalParent: false
        });
      } else if (selectedPortal === "school") {
        await this.setState({
          selectedPortalStudent: false,
          selectedPortalConsultant: false,
          selectedPortalSchool: true,
          selectedPortalParent: false
        });
      } else if (selectedPortal === "parent") {
        await this.setState({
          selectedPortalStudent: false,
          selectedPortalConsultant: false,
          selectedPortalSchool: false,
          selectedPortalParent: true
        });
      }
    } catch (error) {
      //console.log(error);
    }
  };

  _onDone = async () => {
    await this.setState({ hasDoneOnboarding: true });
    await AsyncStorage.setItem("onboarding", JSON.stringify(true));
  };

  _selectPortalStudent = async () => {
    await this.setState({
      selectedPortalStudent: true,
      selectedPortalConsultant: false,
      selectedPortalSchool: false,
      selectedPortalParent: false
    });
    await AsyncStorage.setItem("portal", "student");
  };

  _selectPortalConsultant = async () => {
    await this.setState({
      selectedPortalStudent: false,
      selectedPortalConsultant: true,
      selectedPortalSchool: false,
      selectedPortalParent: false
    });
    await AsyncStorage.setItem("portal", "consultant");
  };

  _selectPortalParent = async () => {
    await this.setState({
      selectedPortalStudent: false,
      selectedPortalConsultant: false,
      selectedPortalSchool: false,
      selectedPortalParent: true
    });
    await AsyncStorage.setItem("portal", "parent");
  };

  _selectPortalSchool = async () => {
    await this.setState({
      selectedPortalStudent: false,
      selectedPortalConsultant: false,
      selectedPortalSchool: true,
      selectedPortalParent: false
    });
    await AsyncStorage.setItem("portal", "school");
    //console.log(this.state.selectedPortalSchool);
  };

  changeRender = () => {
    const {
      hasDoneOnboarding,
      selectedPortalStudent,
      selectedPortalConsultant,
      selectedPortalSchool,
      selectedPortalParent
    } = this.state;

    if (hasDoneOnboarding && selectedPortalStudent) {
      //console.log(this.state.hasDoneOnboarding);
      return <StudentNav />;
    } else if (hasDoneOnboarding && selectedPortalConsultant) {
      //console.log(this.state.hasDoneOnboarding);
      return <ConsultantNav />;
    } else if (hasDoneOnboarding && selectedPortalSchool) {
      //console.log(this.state.hasDoneOnboarding);
      return <SchoolNav />;
    } else if (hasDoneOnboarding && selectedPortalParent) {
      //console.log(this.state.hasDoneOnboarding);
      return <ParentNav />;
    } else if (hasDoneOnboarding === null) {
      //console.log("onboarding check " + this.state.hasDoneOnboarding);
      return <pages.Onboarding onDone={this._onDone} />;
    } else {
      //console.log("onboarding console log " + this.state.hasDoneOnboarding);
      return (
        <pages.SelectPortal
          selectPortalStudent={this._selectPortalStudent}
          selectPortalConsultant={this._selectPortalConsultant}
          selectPortalSchool={this._selectPortalSchool}
          selectPortalParent={this._selectPortalParent}
        />
      );
    }
  };

  render() {
    return <Provider store={store}>{this.changeRender()}</Provider>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
