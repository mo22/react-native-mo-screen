import * as React from 'react';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export class Screen {
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
    /**
     * obtain proximity screen off lock. while this is held, the screen will go
     * dark on proximity. call result.release() to release lock.
     */
    static pushProximityScreenOff() {
        if (this.proximityScreenOffCounter === 0) {
            if (ios.Module) {
                this.proximityScreenOffSubscription = this.proximity.subscribe(() => { });
            }
            else if (android.Module) {
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
                    }
                    else if (android.Module) {
                        android.Module.setProximityScreenOff(false);
                    }
                }
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
}
/**
 * native ios functions. use with caution
 */
Screen.ios = ios;
/**
 * native android functions. use with caution
 */
Screen.android = android;
/**
 * proximity subscription. subscribe to get feedback calls about the state of
 * the proximity sensor.
 * please note that on IOS this will also darken the screen on proximity.
 */
Screen.proximity = new StatefulEvent(false, (emit) => {
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
Screen.screenOnCounter = 0;
Screen.proximityScreenOffCounter = 0;
/**
 * will hold a screen on lock while mounted
 */
export class ScreenOnLock extends React.PureComponent {
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
    componentDidMount() {
        this.lock = Screen.pushProximityScreenOff();
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