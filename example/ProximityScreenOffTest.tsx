import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { ProximityScreenOffLock, Screen } from 'react-native-mo-screen';
import { Releaseable } from 'mo-core';

export default class ProximityScreenOffTest extends React.PureComponent<NavigationInjectedProps> {
  public state = {
    log: [] as string[],
  };

  private sub?: Releaseable;

  public componentDidMount() {
    this.sub = Screen.proximity.subscribe((proxmity) => {
      console.log('got proximity info!');
      this.state.log = this.state.log.slice(0, 9);
      this.state.log.push('proximity is ' + proxmity + ' at ' + new Date());
      this.forceUpdate();
    });
  }

  public componentWillUnmount() {
    if (this.sub) {
      this.sub.release();
      this.sub = undefined;
    }
  }

  public render() {
    return (
      <React.Fragment>
        <ProximityScreenOffLock />
        <ScrollView>

        <ListItem
          title="Your Screen should turn off on proximity"
        />

        {this.state.log.map((line, idx) => (
          <ListItem
            key={idx}
            title={line}
          />
        ))}

        </ScrollView>
      </React.Fragment>
    );
  }
}
