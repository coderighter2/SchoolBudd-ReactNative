import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList} from 'react-native';
import * as firebase from 'firebase'
import ResourceBlock from '../components/resourceBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors'

//image, name, navigationPath
const dataTimes =
[
  {key: 'Goals Timeline', navigationPath: 'GoalsTimeline'},
  {key: 'College Prep', navigationPath: 'CollegePrep'},
  {key: 'SAT/ACT', navigationPath: 'SATACT'},
  {key: 'Study Material', navigationPath: 'StudyMaterials'},
  {key: 'Internships', navigationPath: 'Internships'},
]


export default class Resources extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Resources',
      title: 'Resources',
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
     this.state ={
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
     }
     console.log("resource screen props " + JSON.stringify(props));
   }

   _keyExtractor = (item, index) => item.key;

   componentWillMount() {
     // this.setState({ bookingDate: this.props.navigation.state.params.bookingDate })
   }

   listItemRenderer =(item) => {
     return (
       <ResourceBlock
       jedi={item}
       navigation={this.props.navigation}/>
     );
   }

  render() {
    return (
      <View style={styles.container}>
          <FlatList
            data={dataTimes}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this.listItemRenderer}
            ItemSeparatorComponent = {() => (<View style={{height: 10}}/>)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
