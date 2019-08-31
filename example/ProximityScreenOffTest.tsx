import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { ProximityScreenOffLock, Screen } from 'react-native-mo-screen';
import { Releaseable } from 'mo-core';

// @TODO: react-mo-core?
function releaseOnUnmount(self: React.Component, sub: Releaseable) {
  const prev = self.componentWillUnmount ? self.componentWillUnmount.bind(self) : undefined;
  self.componentWillUnmount = () => {
    sub.release();
    if (prev) prev();
  };
}

// @TODO: react-mo-core?
function SafeSetState<S>(self: React.Component<any, S>) {
  return (arg: Pick<S, keyof S>) => {
    // only if mounted
    self.setState(arg);
  };
}

export default class ProximityScreenOffTest extends React.PureComponent<NavigationInjectedProps, { log: string[] }> {
  public state: { log: string[] } = {
    log: [],
  };

  private safeSetState = SafeSetState(this);

  public componentDidMount() {
    const sub = Screen.proximity.subscribe((proxmity) => {
      console.log('got proximity info ' + proxmity);
      this.state.log = this.state.log.slice(0, 9);
      this.state.log.push('proximity is ' + proxmity + ' at ' + new Date());
      this.forceUpdate();
    });
    releaseOnUnmount(this, sub);
  }

  public componentWillUnmount() {
    console.log('real unmount');
    // if (this.sub) {
    //   this.sub.release();
    //   this.sub = undefined;
    // }
  }

  public render() {
    console.log('render');
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
