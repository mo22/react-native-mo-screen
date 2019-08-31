import * as React from 'react';
import * as ios from './ios';
import * as android from './android';
export class Screen {
    static proximitySubscribe(active) {
        if (this.proximitySubscription) {
            this.proximitySubscription.remove();
            this.proximitySubscription = undefined;
        }
        if (active) {
            if (ios.Events) {
                this.proximitySubscription = ios.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
                    this.proximity.next(rs.proximity);
                });
            }
            else if (android.Events) {
                this.proximitySubscription = android.Events.addListener('ReactNativeMoScreenProximity', (rs) => {
                    this.proximity.next(rs.proximity);
                });
            }
        }
    }
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
            remove: () => {
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
    static async runWithScreenOn(callback) {
        const v = this.pushScreenOn();
        try {
            return await callback();
        }
        finally {
            v.remove();
        }
    }
    static pushProximityScreenOff() {
        if (this.proximityScreenOffCounter === 0) {
            if (ios.Module) {
                if (!this.proximityScreenOffSubscription) {
                    this.proximityScreenOffSubscription = this.proximity.subscribe();
                }
            }
            else if (android.Module) {
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
                    }
                    else if (android.Module) {
                        android.Module.setProximityScreenOff(false);
                    }
                }
            },
        };
    }
}
Screen.proximity = new BehaviorSubjectWithCallback(false, (active) => {
    Screen.proximitySubscribe(active);
});
Screen.screenOnCounter = 0;
Screen.proximityScreenOffCounter = 0;
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