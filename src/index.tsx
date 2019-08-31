import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';



export class Screen {
  public static readonly proximity = new BehaviorSubjectWithCallback<boolean>(false, (active) => {
    Screen.proximitySubscribe(active);
  });

  private static proximitySubscription?: EmitterSubscription;

  private static proximitySubscribe(active: boolean) {
    if (this.proximitySubscription) {
      this.proximitySubscription.remove();
      this.proximitySubscription = undefined;
    }
    if (active) {
      if (ios.Events) {
        this.proximitySubscription = ios.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
          this.proximity.next(rs.proximity);
        });
      } else if (android.Events) {
        this.proximitySubscription = android.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
          this.proximity.next(rs.proximity);
        });
      }
    }
  }

  private static screenOnCounter = 0;
  public static pushScreenOn() {
    if (this.screenOnCounter === 0) {
      if (ios.Module) {
        ios.Module.setIdleTimerDisabled(true);
      } else if (android.Module) {
        android.Module.setKeepScreenOn(true);
      }
    }
    this.screenOnCounter++;
    return {
      remove: () => {
        this.screenOnCounter--;
        if (this.screenOnCounter === 0) {
          if (ios.Module) {
            ios.Module.setIdleTimerDisabled(false);
          } else if (android.Module) {
            android.Module.setKeepScreenOn(false);
          }
        }
      },
    };
  }

  public static async runWithScreenOn<T>(callback: () => Promise<T>): Promise<T> {
    const v = this.pushScreenOn();
    try {
      return await callback();
    } finally {
      v.remove();
    }
  }

  private static proximityScreenOffCounter = 0;
  private static proximityScreenOffSubscription?: Subscription;
  public static pushProximityScreenOff() {
    if (this.proximityScreenOffCounter === 0) {
      if (ios.Module) {
        if (!this.proximityScreenOffSubscription) {
          this.proximityScreenOffSubscription = this.proximity.subscribe();
        }
      } else if (android.Module) {
        android.Module.setProximityScreenOff(true);
      }
    }
    this.proximityScreenOffCounter++;
    return {
      remove: () => {
        this.proximityScreenOffCounter--;
        if (this.proximityScreenOffCounter === 0) {
          if (ios.Module) {
            if (this.proximityScreenOffSubscription) {
              this.proximityScreenOffSubscription.unsubscribe();
              this.proximityScreenOffSubscription = undefined;
            }
          } else if (android.Module) {
            android.Module.setProximityScreenOff(false);
          }
        }
      },
    };
  }
}



export class ScreenOnLock extends React.PureComponent<{}> {
  private lock?: Releaseable;

  public componentDidMount() {
    this.lock = Screen.pushScreenOn();
  }

  public componentWillUnmount() {
    if (this.lock) {
      this.lock.release();
      this.lock = undefined;
    }
  }

  public render() {
    return null;
  }
}



export class ProximityScreenOffLock extends React.PureComponent<{}> {
  private lock?: Releaseable;

  public componentDidMount() {
    this.lock = Screen.pushProximityScreenOff();
  }

  public componentWillUnmount() {
    if (this.lock) {
      this.lock.release();
      this.lock = undefined;
    }
  }

  public render() {
    return null;
  }
}
