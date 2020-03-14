import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { Screen } from 'react-native-mo-screen';
import { Releaseable } from 'mo-core';

export default class BrightnessTest extends React.PureComponent<NavigationInjectedProps, BrightnessTest['state']> {
  public state: {
    log: string[];
  } = {
    log: [],
  };

  private sub?: Releaseable;

  public async componentDidMount() {
    this.sub = Screen.screenBrightness.subscribe((screenBrightness) => {
      console.log('got screenBrightness info ' + screenBrightness);
      this.state.log = this.state.log.slice(0, 9);
      this.state.log.push('screenBrightness is ' + screenBrightness + ' at ' + new Date());
      this.forceUpdate();
    });
    const screenBrightness = await Screen.getScreenBrightness();
    console.log('initial', screenBrightness);
  }

  public componentWillUnmount() {
    if (this.sub) {
      this.sub.release();
      this.sub = undefined;
    }
  }

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

        {this.state.log.map((line, idx) => (
          <ListItem
            key={idx}
            title={line}
          />
        ))}

      </ScrollView>
    );
  }
}
