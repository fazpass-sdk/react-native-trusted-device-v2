
import Foundation
import ios_trusted_device_v2

@objc(TrustedDeviceV2)
class TrustedDeviceV2: NSObject {
    
    @objc(initz:withResolver:withRejecter:)
    func initz(assetName: NSString, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        Fazpass.shared.`init`(assetName: assetName as String)
        resolve(nil)
    }
    
    @objc(generateMeta:withRejecter:)
    func generateMeta(resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        Task {
            await Fazpass.shared.generateMeta { meta in
                resolve(meta)
            }
        }
    }
    
    @objc(enableSelected:withResolver:withRejecter:)
    func enableSelected(args: NSArray, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        for arg in args {
            if let sensitiveData = SensitiveData(rawValue: arg as! String) {
                Fazpass.shared.enableSelected(sensitiveData)
            }
        }
        resolve(nil)
    }
}
