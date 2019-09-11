import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
export declare class Screen {
    /**
     * native ios functions. use with caution
     */
    static readonly ios: typeof ios;
    /**
     * native android functions. use with caution
     */
    static readonly android: typeof android;
    /**
     * be verbose
     */
    static setVerbose(verbose: boolean): void;
    /**
     * proximity subscription. subscribe to get feedback calls about the state of
     * the proximity sensor.
     * please note that on IOS this will also darken the screen on proximity.
     */
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
/**
 * will hold a screen on lock while mounted
 */
export declare class ScreenOnLock extends React.PureComponent<{
    children?: never;
}> {
    private lock?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): null;
}
/**
 * will hold a screen off on proximity lock while mounted
 */
export declare class ProximityScreenOffLock extends React.PureComponent<{
    children?: never;
}> {
    private lock?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): null;
}
