import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';



export class Screen {
  public static readonly proximity = new StatefulEvent<boolean>(false, (emit) => {
    if (ios.Events) {
      ios.Module!.enableProximityMonitoring(true);
      const sub = ios.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
        emit(rs.proximity);
      });
      return () => {
        sub.remove();
        ios.Module!.enableProximityMonitoring(false);
      };
    } else if (android.Events) {
      android.Module!.enableProximityEvent(true);
      const sub = android.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
        emit(rs.proximity);
      });
      return () => {
        sub.remove();
        android.Module!.enableProximityEvent(false);
      };
    } else {
      return () => {
      };
    }
  });

  private static screenOnCounter = 0;
  public static pushScreenOn(): Releaseable {
    if (this.screenOnCounter === 0) {
      if (ios.Module) {
        ios.Module.setIdleTimerDisabled(true);
      } else if (android.Module) {
        android.Module.setKeepScreenOn(true);
      }
    }
    this.screenOnCounter++;
    return {
      release: () => {
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
      v.release();
    }
  }

  private static proximityScreenOffCounter = 0;
  private static proximityScreenOffSubscription?: Releaseable;
  public static pushProximityScreenOff(): Releaseable {
    if (this.proximityScreenOffCounter === 0) {
      if (ios.Module) {
        this.proximityScreenOffSubscription = this.proximity.subscribe(() => {});
      } else if (android.Module) {
        android.Module.setProximityScreenOff(true);
      }
    }
    this.proximityScreenOffCounter++;
    return {
      release: () => {
        this.proximityScreenOffCounter--;
        if (this.proximityScreenOffCounter === 0) {
          if (ios.Module) {
            if (this.proximityScreenOffSubscription) {
              this.proximityScreenOffSubscription.release();
              this.proximityScreenOffSubscription = undefined;
            }
          } else if (android.Module) {
            android.Module.setProximityScreenOff(false);
          }
        }
      },
    };
  }

  public static setScreenBrightness(value: number) {
    if (ios.Module) {
      ios.Module.setScreenBrightness(value);
    } else if (android.Module) {
      android.Module.setScreenBrightness(value);
    }
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
