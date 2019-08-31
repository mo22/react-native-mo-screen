import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

export interface ProximityEvent {
  proximity: boolean;
}

export interface Module {
  setIdleTimerDisabled(value: boolean): void;
  setScreenBrightness(value: number): void;
  enableProximityMonitoring(enable: boolean): void;
}

export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoScreen as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoScreen) as {
  addListener(eventType: 'ReactNativeMoScreenProximity', listener: (event: ProximityEvent) => void): EmitterSubscription;
} : undefined;
