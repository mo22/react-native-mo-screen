import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoScreen : undefined;
export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoScreen) : undefined;
//# sourceMappingURL=android.js.map