import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Screen } from 'react-native-mo-screen';

export default class BrightnessTest extends React.PureComponent<NavigationInjectedProps> {
  public componentDidMount() {
    Screen.setScreenBrightness(1);
  }

  public componentWillUnmount() {
    Screen.setScreenBrightness(0.1);
  }

  public render() {
    return (
      <View>
      </View>
  );
  }
}
