import 'react-native-gesture-handler';
import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  Menu: {
    screen: require('./Menu').default,
    navigationOptions: {
      title: 'Menu',
    },
  },
  ScreenOnTest: {
    screen: require('./ScreenOnTest').default,
    navigationOptions: {
      title: 'Screen On Test',
    },
  },
  ProximityScreenOffTest: {
    screen: require('./ProximityScreenOffTest').default,
    navigationOptions: {
      title: 'Proximity Screen Off Test',
    },
  },
  BrightnessTest: {
    screen: require('./BrightnessTest').default,
    navigationOptions: {
      title: 'Brightness Test',
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.PureComponent<{}> {
  public render() {
    return (
      <AppContainer />
    );
  }
}
