import { EmitterSubscription } from 'react-native';
export interface ProximityEvent {
    proximity: boolean;
}
export interface ScreenBrightnessEvent {
    screeBrightness: number;
}
export interface Module {
    setVerbose(verbose: boolean): void;
    setIdleTimerDisabled(value: boolean): void;
    setScreenBrightness(value: number): void;
    getScreenBrightness(): Promise<number>;
    enableScreenBrightnessMonitoring(enable: boolean): void;
    enableProximityMonitoring(enable: boolean): void;
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: "ReactNativeMoScreenProximity", listener: (event: ProximityEvent) => void): EmitterSubscription;
    addListener(eventType: "ReactNativeMoScreenBrightness", listener: (event: ScreenBrightnessEvent) => void): EmitterSubscription;
} | undefined;
