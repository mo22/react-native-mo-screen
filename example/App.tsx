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
      title: 'ScreenOnTest',
    },
  },
  ProximityScreenOffTest: {
    screen: require('./ProximityScreenOffTest').default,
    navigationOptions: {
      title: 'ProximityScreenOffTest',
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
