import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
export declare class Screen {
    static readonly proximity: StatefulEvent<boolean>;
    private static screenOnCounter;
    /**
     * start screen on lock. the screen wont get dark after idle time.
     * returns Releasable, call result.release() to release the lock.
     */
    static pushScreenOn(): Releaseable;
    /**
     * run async function callback with screen on lock held.
     */
    static runWithScreenOn<T>(callback: () => Promise<T>): Promise<T>;
    private static proximityScreenOffCounter;
    private static proximityScreenOffSubscription?;
    /**
     * obtain proximity screen off lock. while this is held, the screen will go
     * dark on proximity. call result.release() to release lock.
     */
    static pushProximityScreenOff(): Releaseable;
    /**
     * set screen brightness to value between 0 and 1.
     */
    static setScreenBrightness(value: number): void;
}
export declare class ScreenOnLock extends React.PureComponent<{}> {
    private lock?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): null;
}
export declare class ProximityScreenOffLock extends React.PureComponent<{}> {
    private lock?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): null;
}
