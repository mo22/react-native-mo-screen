import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { ProximityScreenOffLock, Screen } from 'react-native-mo-screen';
import { Releaseable } from 'mo-core';

// @TODO: react-mo-core?
export function onWillUnmount(self: React.Component, callback: () => void) {
  const prev = self.componentWillUnmount ? self.componentWillUnmount.bind(self) : undefined;
  self.componentWillUnmount = () => {
    if (prev) prev();
    callback();
  };
}

// @TODO: react-mo-core?
export function releaseOnWillUnmount(self: React.Component, sub: Releaseable) {
  onWillUnmount(self, () => sub.release());
}

// @TODO: react-mo-core?
export function SafeSetState<S>(self: React.Component<any, S>) {
  let mounted = true;
  onWillUnmount(self, () => {
    mounted = false;
  });
  return (arg: Pick<S, keyof S>) => {
    if (mounted) {
      self.setState(arg);
    }
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
    releaseOnWillUnmount(this, sub);
    this.safeSetState({ log: ['initial'] });
  }

  public componentWillUnmount() {
    console.log('real unmount');
    // if (this.sub) {
    //   this.sub.release();
    //   this.sub = undefined;
    // }
    setTimeout(() => {
      this.safeSetState({ log: ['after'] });
    }, 1000);
    setTimeout(() => {
      this.setState({ log: ['after2'] });
    }, 2000);
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
