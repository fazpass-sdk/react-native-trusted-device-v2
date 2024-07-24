
import Foundation
import ios_trusted_device_v2

@objc(TrustedDeviceV2)
class TrustedDeviceV2: NSObject {
    
    @objc(initz:fcmAppId:withResolver:)
    func initz(assetName: NSString, fcmAppId: NSString, resolve: RCTPromiseResolveBlock) {
        Fazpass.shared.`init`(
            publicAssetName: assetName as String,
            application: UIApplication.shared,
            fcmAppId: fcmAppId as String)
        resolve(nil)
    }
    
    @objc(generateMeta:withResolver:withRejecter:)
    func generateMeta(accountIndex: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Fazpass.shared.generateMeta { meta, err in
            guard let err: FazpassError = err else {
                resolve(meta)
                return
            }
            
            switch err {
            case .uninitialized:
                reject("uninitialized", err.localizedDescription, nil)
            case .biometricNoneEnrolled:
                reject("biometricNoneEnrolled", err.localizedDescription, nil)
            case .biometricAuthFailed:
                reject("biometricAuthFailed", err.localizedDescription, nil)
            case .biometricNotAvailable(message: let message):
                reject("biometricNotAvailable", message, nil)
            case .biometricNotInteractive:
                reject("biometricNotInteractive", err.localizedDescription, nil)
            case .encryptionError(message: let message):
                reject("encryptionError", message, nil)
            case .publicKeyNotExist:
                reject("publicKeyNotExist", err.localizedDescription, nil)
            }
        }
    }
    
    @objc(generateNewSecretKey:withRejecter:)
    func generateNewSecretKey(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            try Fazpass.shared.generateNewSecretKey()
            resolve(nil)
        } catch {
            reject("ErrorGenerateNewSecretKey", error.localizedDescription, nil)
        }
    }
    
    @objc(setSettings:settings:withResolver:)
    func setSettings(accountIndex: NSNumber, settings: NSString, resolve: RCTPromiseResolveBlock) {
        Fazpass.shared.setSettings(
            accountIndex: Int(truncating: accountIndex),
            settings: FazpassSettings.fromString(settings as String))
        resolve(nil)
    }
    
    @objc(getSettings:withResolver:)
    func getSettings(accountIndex: NSNumber, resolve: RCTPromiseResolveBlock) {
        let settings = Fazpass.shared.getSettings(accountIndex: Int(truncating: accountIndex))
        resolve(settings?.toString())
    }
    
    @objc(getCrossDeviceDataFromNotification:)
    func getCrossDeviceDataFromNotification(resolve: RCTPromiseResolveBlock) {
        let data = Fazpass.shared.getCrossDeviceDataFromNotification(userInfo: nil)
        resolve(data?.toNSDict())
    }
}
