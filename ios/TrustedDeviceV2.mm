#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TrustedDeviceV2, NSObject)

RCT_EXTERN_METHOD(initz:(NSString)assetName
                  fcmAppId:(NSString)fcmAppId
                  withResolver:(RCTPromiseResolveBlock)resolve)

RCT_EXTERN_METHOD(generateMeta:(NSNumber)accountIndex
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateNewSecretKey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setSettings:(NSNumber)accountIndex
                  settings:(NSString)settings
                  withResolver:(RCTPromiseResolveBlock)resolve)

RCT_EXTERN_METHOD(getSettings:(NSNumber)accountIndex
                  withResolver:(RCTPromiseResolveBlock)resolve)

RCT_EXTERN_METHOD(getCrossDeviceRequestFromNotification:(RCTPromiseResolveBlock)resolve)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
