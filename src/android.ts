import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

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

export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoScreen as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoScreen) as {
  addListener(eventType: 'ReactNativeMoScreenProximity', listener: (event: ProximityEvent) => void): EmitterSubscription;
} : undefined;
