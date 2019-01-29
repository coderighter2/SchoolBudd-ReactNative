import { createStackNavigator, createDrawerNavigator, TabNavigator } from 'react-navigation'
import { createNavigationReducer } from 'react-navigation-redux-helpers'
import * as pages from '../pages'

const ProfileNavStudent = TabNavigator({
  ProfileCard: { screen: pages.StudentProfileCard },
  StudentBasicInfo: { screen: pages.StudentBasicInfo },
  Feedback: { screen: pages.Feedback },
}, {
    // Default config for all screens
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled: true,
    initialRouteName: 'StudentBasicInfo',
    tabBarOptions: {
      labelStyle: {
        fontSize: 17
      },
    }
  });

const UpcomingNav = createStackNavigator({
  UpcomingScreen: { screen: pages.UpcomingScreen },
  InputCreditCard: { screen: pages.InputCreditCard }
}, {
  headerMode: 'none'
})

const ForumNav = createStackNavigator({
  ForumScreen: { screen: pages.Forum },
  QuestionResponsesScreen: { screen: pages.QuestionResponses },
  AnswerScreen: { screen: pages.AnswerScreen },
  AddQuestionScreen: { screen: pages.AddQuestionScreen }
}, {
  headerMode: 'none'
});

const FindConsultantNav = createStackNavigator({
  FindConsultantScreen: { screen: pages.FindConsultant },
  SelectConsultant: { screen: pages.SelectConsultant },
  MessagesScreen: { screen: pages.Messages },
  CalendarOtherScreen: { screen: pages.CalendarOtherScreen },
  MakeAppointmentsScreen: { screen: pages.MakeAppointmentsScreen },
  InputCreditCard: { screen: pages.InputCreditCard }
}, {
  headerMode: 'none'
});


const InternshipsNav = createStackNavigator({
  Internships: { screen: pages.Internships },
  ResourcesScreen: { screen: pages.Resources },
}, {
    headerMode: 'none',
});

const StudyMaterialsNav = createStackNavigator({
  StudyMaterials: { screen: pages.StudyMaterial },
  ResourcesScreen: { screen: pages.Resources },
}, {
    headerMode: 'none',
});

const GoalsTimelineNav = createStackNavigator({
  GoalsTimeline: { screen: pages.GoalsTimeline },
  ResourcesScreen: { screen: pages.Resources },
  TimelineSheet: { screen: pages.TimelineSheet },
}, {
    headerMode: 'none',
});

const SATACTNav = createStackNavigator({
  SATACT: { screen: pages.SATACTPrep },
  ResourcesScreen: { screen: pages.Resources },
}, {
    headerMode: 'none',
});

const CollegPrepNav = createStackNavigator({
  CollegePrep: { screen: pages.CollegePrep },
  ResourcesScreen: { screen: pages.Resources },
}, {
    headerMode: 'none',
  });

const ResourcesNav = createStackNavigator({
  ResourcesScreen: { screen: pages.Resources },
  Internships: { screen: InternshipsNav },
  StudyMaterials: { screen: StudyMaterialsNav },
  GoalsTimeline: { screen: GoalsTimelineNav },
  SATACT: { screen: SATACTNav },
  CollegePrep: { screen: CollegPrepNav },
}, {
  headerMode: 'none'
});

const AccountInfoNav = createStackNavigator({
  AccountInfo: { screen: pages.AccountInfo }
}, {
  headerMode: 'none'
})

const HomeNavigation = createDrawerNavigator({
  Home: { screen: pages.Feedback },
  Profile: { screen: ProfileNavStudent },
  FindConsultant: { screen: FindConsultantNav },
  Forum: { screen: ForumNav },
  Resources: { screen: ResourcesNav },
  Upcoming: { screen: UpcomingNav },
  AccountInfo: { screen: AccountInfoNav },
  Blank: { screen: pages.Blank2 },
  Logout: { screen: pages.Logout }
}, {
  initialRouteName: 'Home',
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerWidth: 250,
})

const RootNavigation = createStackNavigator({
  OnboardingScreen: { screen: pages.Onboarding },
  SelectPortalScreen: { screen: pages.SelectPortal },
  LoginScreen: { screen:  pages.Login },
  HomeNav: { screen: HomeNavigation }
}, {
  title: 'Root',
  initialRouteName: 'OnboardingScreen'
})

export const navReducer = createNavigationReducer(RootNavigation)

export default RootNavigation