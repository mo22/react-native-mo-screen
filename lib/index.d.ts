import * as React from 'react';
export declare class Screen {
    static readonly proximity: any;
    private static proximitySubscription?;
    private static proximitySubscribe;
    private static screenOnCounter;
    static pushScreenOn(): {
        remove: () => void;
    };
    static runWithScreenOn<T>(callback: () => Promise<T>): Promise<T>;
    private static proximityScreenOffCounter;
    private static proximityScreenOffSubscription?;
    static pushProximityScreenOff(): {
        remove: () => void;
    };
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
