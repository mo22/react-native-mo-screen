#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

@interface ReactNativeMoScreen : RCTEventEmitter {
    BOOL _verbose;
}
@end

@implementation ReactNativeMoScreen

RCT_EXPORT_MODULE()

// we are interacting with UI
- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[ @"ReactNativeMoScreenProximity", @"ReactNativeMoScreenBrightness" ];
}

RCT_EXPORT_METHOD(setVerbose:(BOOL)verbose) {
    _verbose = verbose;
}

- (BOOL)verbose {
    return _verbose;
}

RCT_EXPORT_METHOD(setIdleTimerDisabled:(BOOL)value) {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.setIdleTimerDisabled %d", value);
    [RCTSharedApplication() setIdleTimerDisabled:value];
}

RCT_EXPORT_METHOD(setScreenBrightness:(CGFloat)value) {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.setScreenBrightness %f", value);
    [[UIScreen mainScreen] setBrightness:value];
}

RCT_EXPORT_METHOD(getScreenBrightness:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  resolve(@([[UIScreen mainScreen] brightness]));
}

RCT_EXPORT_METHOD(enableProximityMonitoring:(BOOL)enable) {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.enableProximityMonitoring %d", enable);
    if (enable) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(proximityChanged:) name:UIDeviceProximityStateDidChangeNotification object:nil];
        [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
    } else {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceProximityStateDidChangeNotification object:nil];
        [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
    }
}

- (void)proximityChanged:(NSNotificationCenter *)notification {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.proximityChanged %d", [[UIDevice currentDevice] proximityState]);
    [self sendEventWithName:@"ReactNativeMoScreenProximity" body:@{
        @"proximity": @([[UIDevice currentDevice] proximityState]),
    }];
}

RCT_EXPORT_METHOD(enableScreenBrightnessMonitoring:(BOOL)enable) {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.enableScreenBrightnessMonitoring %d", enable);
    if (enable) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(screenBrightnessChanged:) name:UIScreenBrightnessDidChangeNotification object:nil];
    } else {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIScreenBrightnessDidChangeNotification object:nil];
    }
}

- (void)screenBrightnessChanged:(NSNotification*)notification {
    if (self.verbose) NSLog(@"ReactNativeMoScreen.screenBrightnessChanged %f", [[UIScreen mainScreen] brightness]);
    [self sendEventWithName:@"ReactNativeMoScreenBrightness" body:@{
        @"screenBrightness": @([[UIScreen mainScreen] brightness]),
    }];
}

- (void)stopObserving {
    [self enableProximityMonitoring:NO];
    [self enableScreenBrightnessMonitoring:NO];
}

@end
