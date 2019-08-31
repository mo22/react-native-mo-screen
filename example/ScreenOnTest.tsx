import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ScreenOnLock } from 'react-native-mo-screen';

export default class ScreenOnTest extends React.PureComponent<NavigationInjectedProps> {
  public render() {
    return (
      <React.Fragment>
        <ScreenOnLock />
        <View>
        </View>
      </React.Fragment>
    );
  }
}
