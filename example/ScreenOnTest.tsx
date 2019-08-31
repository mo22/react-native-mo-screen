import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { ScreenOnLock } from 'react-native-mo-screen';

export default class ScreenOnTest extends React.PureComponent<NavigationInjectedProps> {
  public render() {
    return (
      <React.Fragment>
        <ScreenOnLock />
        <ScrollView>

          <ListItem
            title="Your Screen should stay on"
          />

        </ScrollView>
      </React.Fragment>
    );
  }
}
