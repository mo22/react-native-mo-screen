import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
import { AppState, AppStateStatus } from 'react-native';



export class Screen {
  /**
   * native ios functions. use with caution
   */
  public static readonly ios = ios;

  /**
   * native android functions. use with caution
   */
  public static readonly android = android;

  /**
   * be verbose
   */
  public static setVerbose(verbose: boolean) {
    if (ios.Module) {
      ios.Module.setVerbose(verbose);
    } else if (android.Module) {
      android.Module.setVerbose(verbose);
    }
  }

  /**
   * proximity subscription. subscribe to get feedback calls about the state of
   * the proximity sensor.
   * please note that on IOS this will also darken the screen on proximity.
   */
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

  /**
   * screen brightness subscription. subscribe to get calls if screen brightness
   * has changed.
   */
  public static readonly screenBrightness = new StatefulEvent<number>(0, (emit) => {
    if (ios.Events) {
      ios.Module!.enableScreenBrightnessMonitoring(true);
      const sub = ios.Events.addListener('ReactNativeMoScreenBrightness', (rs) => {
        emit(rs.screeBrightness);
      });
      return () => {
        sub.remove();
        ios.Module!.enableScreenBrightnessMonitoring(false);
      };
    // } else if (android.Events) {
      // android.Module!.enableProximityEvent(true);
      // const sub = android.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
      //   emit(rs.proximity);
      // });
      // return () => {
      //   sub.remove();
      //   android.Module!.enableProximityEvent(false);
      // };
    } else {
      return () => {
      };
    }
  });

  private static screenOnCounter = 0;

  /**
   * start screen on lock. the screen wont get dark after idle time.
   * returns Releasable, call result.release() to release the lock.
   */
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

  /**
   * run async function callback with screen on lock held.
   */
  public static async runWithScreenOn<T>(callback: () => Promise<T>): Promise<T> {
    const v = this.pushScreenOn();
    try {
      return await callback();
    } finally {
      v.release();
    }
  }

  private static proximityScreenOffCounter = 0;
  private static proximityScreenOffBackground = 0;
  private static proximityScreenOffSubscription?: Releaseable;

  private static setProximityScreenOff(enabled: boolean) {
    if (enabled) {
      if (ios.Module) {
        if (!this.proximityScreenOffSubscription) {
          this.proximityScreenOffSubscription = this.proximity.subscribe(() => {});
        }
      } else if (android.Module) {
        android.Module.setProximityScreenOff(true);
      }
    } else {
      if (ios.Module) {
        if (this.proximityScreenOffSubscription) {
          this.proximityScreenOffSubscription.release();
          this.proximityScreenOffSubscription = undefined;
        }
      } else if (android.Module) {
        android.Module.setProximityScreenOff(false);
      }
    }
  }

  private static appStateListener = (state: AppStateStatus) => {
    if (state === 'background') {
      Screen.setProximityScreenOff(Screen.proximityScreenOffBackground > 0);
    } else {
      Screen.setProximityScreenOff(Screen.proximityScreenOffCounter > 0);
    }
  }

  private static updateProximityScreenOff() {
    this.setProximityScreenOff(this.proximityScreenOffCounter > 0);
    AppState.addEventListener('change', this.appStateListener);
  }

  /**
   * obtain proximity screen off lock. while this is held, the screen will go
   * dark on proximity. call result.release() to release lock.
   * is background is true the screen will also be turned off on proximity if
   * the app is not in foreground any more.
   */
  public static pushProximityScreenOff(background = false): Releaseable {
    this.proximityScreenOffCounter++;
    if (background) this.proximityScreenOffBackground++;
    this.updateProximityScreenOff();
    return {
      release: () => {
        this.proximityScreenOffCounter--;
        if (background) this.proximityScreenOffBackground--;
        this.updateProximityScreenOff();
      },
    };
  }

  /**
   * set screen brightness to value between 0 and 1.
   */
  public static setScreenBrightness(value: number) {
    if (ios.Module) {
      ios.Module.setScreenBrightness(value);
    } else if (android.Module) {
      android.Module.setScreenBrightness(value);
    }
  }

  /**
   * get screen brightness as value between 0 and 1.
   */
  public static async getScreenBrightness(): Promise<number> {
    if (ios.Module) {
      return await ios.Module.getScreenBrightness();
    } else if (android.Module) {
      return 1;
    } else {
      return 1;
    }
  }
}



/**
 * will hold a screen on lock while mounted
 */
export class ScreenOnLock extends React.PureComponent<{ children?: never; }> {
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



/**
 * will hold a screen off on proximity lock while mounted
 */
export class ProximityScreenOffLock extends React.PureComponent<{ children?: never; background?: boolean; }> {
  private lock?: Releaseable;

  public componentDidMount() {
    this.lock = Screen.pushProximityScreenOff(this.props.background || false);
  }

  public componentDidUpdate() {
    if (this.lock) {
      this.lock.release();
      this.lock = undefined;
    }
    this.lock = Screen.pushProximityScreenOff(this.props.background || false);
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
