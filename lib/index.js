import * as React from 'react';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
import { AppState } from 'react-native';
export class Screen {
    /**
     * native ios functions. use with caution
     */
    static ios = ios;
    /**
     * native android functions. use with caution
     */
    static android = android;
    /**
     * be verbose
     */
    static setVerbose(verbose) {
        if (ios.Module) {
            ios.Module.setVerbose(verbose);
        }
        else if (android.Module) {
            android.Module.setVerbose(verbose);
        }
    }
    /**
     * proximity subscription. subscribe to get feedback calls about the state of
     * the proximity sensor.
     * please note that on IOS this will also darken the screen on proximity.
     */
    static proximity = new StatefulEvent(false, (emit) => {
        if (ios.Events) {
            ios.Module.enableProximityMonitoring(true);
            const sub = ios.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
                emit(rs.proximity);
            });
            return () => {
                sub.remove();
                ios.Module.enableProximityMonitoring(false);
            };
        }
        else if (android.Events) {
            android.Module.enableProximityEvent(true);
            const sub = android.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
                emit(rs.proximity);
            });
            return () => {
                sub.remove();
                android.Module.enableProximityEvent(false);
            };
        }
        else {
            return () => {
            };
        }
    });
    /**
     * screen brightness subscription. subscribe to get calls if screen brightness
     * has changed.
     */
    static screenBrightness = new StatefulEvent(0, (emit) => {
        if (ios.Events) {
            ios.Module.enableScreenBrightnessMonitoring(true);
            const sub = ios.Events.addListener('ReactNativeMoScreenBrightness', (rs) => {
                emit(rs.screenBrightness);
            });
            return () => {
                sub.remove();
                ios.Module.enableScreenBrightnessMonitoring(false);
            };
        }
        else if (android.Events) {
            android.Module.enableScreenBrightnessEvent(true);
            const sub = android.Events.addListener('ReactNativeMoScreenBrightness', (rs) => {
                emit(rs.screenBrightness);
            });
            return () => {
                sub.remove();
                android.Module.enableScreenBrightnessEvent(false);
            };
        }
        else {
            return () => {
            };
        }
    });
    static screenOnCounter = 0;
    /**
     * start screen on lock. the screen wont get dark after idle time.
     * returns Releasable, call result.release() to release the lock.
     */
    static pushScreenOn() {
        if (this.screenOnCounter === 0) {
            if (ios.Module) {
                ios.Module.setIdleTimerDisabled(true);
            }
            else if (android.Module) {
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
                    }
                    else if (android.Module) {
                        android.Module.setKeepScreenOn(false);
                    }
                }
            },
        };
    }
    /**
     * run async function callback with screen on lock held.
     */
    static async runWithScreenOn(callback) {
        const v = this.pushScreenOn();
        try {
            return await callback();
        }
        finally {
            v.release();
        }
    }
    static proximityScreenOffCounter = 0;
    static proximityScreenOffBackground = 0;
    static proximityScreenOffSubscription;
    static setProximityScreenOff(enabled) {
        if (enabled) {
            if (ios.Module) {
                if (!this.proximityScreenOffSubscription) {
                    this.proximityScreenOffSubscription = this.proximity.subscribe(() => { });
                }
            }
            else if (android.Module) {
                android.Module.setProximityScreenOff(true);
            }
        }
        else {
            if (ios.Module) {
                if (this.proximityScreenOffSubscription) {
                    this.proximityScreenOffSubscription.release();
                    this.proximityScreenOffSubscription = undefined;
                }
            }
            else if (android.Module) {
                android.Module.setProximityScreenOff(false);
            }
        }
    }
    static appStateListener = (state) => {
        if (state === 'background') {
            Screen.setProximityScreenOff(Screen.proximityScreenOffBackground > 0);
        }
        else {
            Screen.setProximityScreenOff(Screen.proximityScreenOffCounter > 0);
        }
    };
    static updateProximityScreenOff() {
        this.setProximityScreenOff(this.proximityScreenOffCounter > 0);
        AppState.addEventListener('change', this.appStateListener);
    }
    /**
     * obtain proximity screen off lock. while this is held, the screen will go
     * dark on proximity. call result.release() to release lock.
     * is background is true the screen will also be turned off on proximity if
     * the app is not in foreground any more.
     */
    static pushProximityScreenOff(background = false) {
        this.proximityScreenOffCounter++;
        if (background)
            this.proximityScreenOffBackground++;
        this.updateProximityScreenOff();
        return {
            release: () => {
                this.proximityScreenOffCounter--;
                if (background)
                    this.proximityScreenOffBackground--;
                this.updateProximityScreenOff();
            },
        };
    }
    /**
     * set screen brightness to value between 0 and 1.
     */
    static setScreenBrightness(value) {
        if (ios.Module) {
            ios.Module.setScreenBrightness(value);
        }
        else if (android.Module) {
            android.Module.setScreenBrightness(value);
        }
    }
    /**
     * get screen brightness as value between 0 and 1.
     */
    static async getScreenBrightness() {
        if (ios.Module) {
            return await ios.Module.getScreenBrightness();
        }
        else if (android.Module) {
            return (await android.Module.getScreenBrightness()).screenBrightness;
        }
        else {
            return 1;
        }
    }
}
/**
 * will hold a screen on lock while mounted
 */
export class ScreenOnLock extends React.PureComponent {
    lock;
    componentDidMount() {
        this.lock = Screen.pushScreenOn();
    }
    componentWillUnmount() {
        if (this.lock) {
            this.lock.release();
            this.lock = undefined;
        }
    }
    render() {
        return null;
    }
}
/**
 * will hold a screen off on proximity lock while mounted
 */
export class ProximityScreenOffLock extends React.PureComponent {
    lock;
    componentDidMount() {
        this.lock = Screen.pushProximityScreenOff(this.props.background || false);
    }
    componentDidUpdate() {
        if (this.lock) {
            this.lock.release();
            this.lock = undefined;
        }
        this.lock = Screen.pushProximityScreenOff(this.props.background || false);
    }
    componentWillUnmount() {
        if (this.lock) {
            this.lock.release();
            this.lock = undefined;
        }
    }
    render() {
        return null;
    }
}
//# sourceMappingURL=index.js.map