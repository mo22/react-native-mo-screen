import { EmitterSubscription } from 'react-native';
export interface Module {
    setKeepScreenOn(value: boolean): void;
    setWindowFlags(flag: number, value: boolean): void;
    setProximityScreenOff(value: boolean): void;
    enableProximityEvent(enable: boolean): void;
    setScreenBrightness(value: number): void;
}
export interface ProximityEvent {
    proximity: boolean;
    distance: number;
}
export declare const Module: Module | undefined;
export declare const Events: {
    addListener(eventType: "ReactNativeMoScreenProximity", listener: (event: ProximityEvent) => void): EmitterSubscription;
} | undefined;
