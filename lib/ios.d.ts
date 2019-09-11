import { EmitterSubscription } from 'react-native';
export interface ProximityEvent {
    proximity: boolean;
}
export interface Module {
    setVerbose(verbose: boolean): void;
    setIdleTimerDisabled(value: boolean): void;
    setScreenBrightness(value: number): void;
    enableProximityMonitoring(enable: boolean): void;
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: "ReactNativeMoScreenProximity", listener: (event: ProximityEvent) => void): EmitterSubscription;
} | undefined;
