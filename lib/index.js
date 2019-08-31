import * as React from 'react';
import { StatefulEvent } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export class Screen {
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
    static async runWithScreenOn(callback) {
        const v = this.pushScreenOn();
        try {
            return await callback();
        }
        finally {
            v.release();
        }
    }
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
}
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