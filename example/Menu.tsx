import * as React from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';

export default class Menu extends React.PureComponent<NavigationInjectedProps> {
  public render() {
    return (
      <ScrollView>

        <ListItem
          title="ScreenOnTest"
          chevron={true}
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'ScreenOnTest' }));
          }}
        />

        <ListItem
          title="ProximityScreenOffTest"
          chevron={true}
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'ProximityScreenOffTest' }));
          }}
        />

      </ScrollView>
    );
  }
}
