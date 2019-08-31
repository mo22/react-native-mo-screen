#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>

@interface ReactNativeMoScreen : RCTEventEmitter
@end

@implementation ReactNativeMoScreen

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[ @"ReactNativeMoScreenProximity" ];
}

RCT_EXPORT_METHOD(setIdleTimerDisabled:(BOOL)value) {
    [RCTSharedApplication() setIdleTimerDisabled:value];
}

RCT_EXPORT_METHOD(setScreenBrightness:(CGFloat)value) {
    [[UIScreen mainScreen] setBrightness:value];
}

RCT_EXPORT_METHOD(enableProximityMonitoring:(BOOL)enable) {
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
    [self sendEventWithName:@"ReactNativeMoScreenProximity" body:@{
        @"proximity": @([[UIDevice currentDevice] proximityState]),
    }];
}

@end
