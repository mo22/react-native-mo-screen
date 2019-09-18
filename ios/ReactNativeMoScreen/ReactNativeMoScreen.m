#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUIManager.h>

@interface ReactNativeMoScreen : RCTEventEmitter {
    BOOL _verbose;
}
@end

@implementation ReactNativeMoScreen

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[ @"ReactNativeMoScreenProximity" ];
}

RCT_EXPORT_METHOD(setVerbose:(BOOL)verbose) {
    _verbose = verbose;
}

RCT_EXPORT_METHOD(setIdleTimerDisabled:(BOOL)value) {
    if (_verbose) NSLog(@"ReactNativeMoScreen.setIdleTimerDisabled %d", value);
    [RCTSharedApplication() setIdleTimerDisabled:value];
}

RCT_EXPORT_METHOD(setScreenBrightness:(CGFloat)value) {
    if (_verbose) NSLog(@"ReactNativeMoScreen.setScreenBrightness %f", value);
    [[UIScreen mainScreen] setBrightness:value];
}

RCT_EXPORT_METHOD(enableProximityMonitoring:(BOOL)enable) {
    if (_verbose) NSLog(@"ReactNativeMoScreen.enableProximityMonitoring %d", enable);
    if (enable) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(proximityChanged:) name:@"UIDeviceProximityStateDidChangeNotification" object:nil];
        [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
    } else {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:@"UIDeviceProximityStateDidChangeNotification" object:nil];
        [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
    }
}

- (void)stopObserving {
    [self enableProximityMonitoring:NO];
}

- (void)proximityChanged:(NSNotificationCenter *)notification {
    if (_verbose) NSLog(@"ReactNativeMoScreen.proximityChanged %d", [[UIDevice currentDevice] proximityState]);
    [self sendEventWithName:@"ReactNativeMoScreenProximity" body:@{
        @"proximity": @([[UIDevice currentDevice] proximityState]),
    }];
}

@end
