import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { ProximityScreenOffLock, Screen } from 'react-native-mo-screen';
import { Releaseable } from 'mo-core';

export default class ProximityScreenOffTest extends React.PureComponent<NavigationInjectedProps, { log: string[]; background: boolean; }> {
  public state: { log: string[]; background: boolean; } = {
    log: [],
    background: false,
  };

  private sub?: Releaseable;

  public componentDidMount() {
    this.sub = Screen.proximity.subscribe((proxmity) => {
      console.log('got proximity info ' + proxmity);
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
    console.log('render');
    return (
      <React.Fragment>
        <ProximityScreenOffLock background={this.state.background} />
        <ScrollView>

        <ListItem
          title="Your Screen should turn off on proximity"
        />

        <ListItem
          title="background"
          switch={{
            value: this.state.background || false,
            onValueChange: (value) => {
              this.setState({ background: value });
            },
          }}
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
