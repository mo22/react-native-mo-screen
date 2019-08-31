import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Screen } from 'react-native-mo-screen';

export default class BrightnessTest extends React.PureComponent<NavigationInjectedProps> {
  public render() {
    return (
      <ScrollView>

        <ListItem
          title="bright 1"
          chevron={true}
          onPress={() => {
            Screen.setScreenBrightness(1);
          }}
        />

        <ListItem
          title="bright 0.5"
          chevron={true}
          onPress={() => {
            Screen.setScreenBrightness(0.5);
          }}
        />

        <ListItem
          title="bright 0"
          chevron={true}
          onPress={() => {
            Screen.setScreenBrightness(0);
          }}
        />

      </ScrollView>
    );
  }
}
