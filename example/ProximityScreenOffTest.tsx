import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ProximityScreenOffLock } from 'react-native-mo-screen';

export default class ProximityScreenOffTest extends React.PureComponent<NavigationInjectedProps> {
  public render() {
    return (
      <React.Fragment>
        <ProximityScreenOffLock><View /></ProximityScreenOffLock>
        <View>
        </View>
      </React.Fragment>
    );
  }
}
