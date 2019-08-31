import * as React from 'react';
import { StatefulEvent, Releaseable } from 'mo-core';
export declare class Screen {
    static readonly proximity: StatefulEvent<boolean>;
    private static screenOnCounter;
    static pushScreenOn(): Releaseable;
    static runWithScreenOn<T>(callback: () => Promise<T>): Promise<T>;
    private static proximityScreenOffCounter;
    private static proximityScreenOffSubscription?;
    static pushProximityScreenOff(): Releaseable;
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
