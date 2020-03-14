import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

export interface ProximityEvent {
  proximity: boolean;
  distance: number;
}

export interface ScreenBrightnessEvent {
  screenBrightness: number;
}

export interface Module {
  setVerbose(verbose: boolean): void;
  setKeepScreenOn(value: boolean): void;
  setWindowFlags(flag: number, value: boolean): void;
  setProximityScreenOff(value: boolean): void;
  enableProximityEvent(enable: boolean): void;
  setScreenBrightness(value: number): void;
  getScreenBrightness(): Promise<number>;
  enableScreenBrightnessEvent(enable: boolean): void;
}

export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoScreen as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoScreen) as {
  addListener(eventType: 'ReactNativeMoScreenProximity', listener: (event: ProximityEvent) => void): EmitterSubscription;
  addListener(eventType: 'ReactNativeMoScreenBrightness', listener: (event: ScreenBrightnessEvent) => void): EmitterSubscription;
} : undefined;
