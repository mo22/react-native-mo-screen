import { EmitterSubscription } from 'react-native';
export interface ProximityEvent {
    proximity: boolean;
    distance: number;
}
export interface ScreenBrightnessEvent {
    screenBrightness: number;
    mode: 'automatic' | 'manual';
}
export interface Module {
    setVerbose(verbose: boolean): void;
    setKeepScreenOn(value: boolean): void;
    setWindowFlags(flag: number, value: boolean): void;
    setProximityScreenOff(value: boolean): void;
    enableProximityEvent(enable: boolean): void;
    setScreenBrightness(value: number): void;
    getScreenBrightness(): Promise<ScreenBrightnessEvent>;
    enableScreenBrightnessEvent(enable: boolean): void;
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: 'ReactNativeMoScreenProximity', listener: (event: ProximityEvent) => void): EmitterSubscription;
    addListener(eventType: 'ReactNativeMoScreenBrightness', listener: (event: ScreenBrightnessEvent) => void): EmitterSubscription;
} | undefined;
