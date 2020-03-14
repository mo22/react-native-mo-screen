import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

export interface ProximityEvent {
  proximity: boolean;
}

export interface ScreenBrightnessEvent {
  screenBrightness: number;
}

export interface Module {
  setVerbose(verbose: boolean): void;
  setIdleTimerDisabled(value: boolean): void;
  setScreenBrightness(value: number): void;
  getScreenBrightness(): Promise<number>;
  enableScreenBrightnessMonitoring(enable: boolean): void;
  enableProximityMonitoring(enable: boolean): void;
}

export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoScreen as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoScreen) as {
  addListener(eventType: 'ReactNativeMoScreenProximity', listener: (event: ProximityEvent) => void): EmitterSubscription;
  addListener(eventType: 'ReactNativeMoScreenBrightness', listener: (event: ScreenBrightnessEvent) => void): EmitterSubscription;
} : undefined;
