
import Foundation
import ios_trusted_device_v2

@objc(CrossDevice)
open class CrossDevice: RCTEventEmitter {

    var hasListener: Bool = false
    let stream: CrossDeviceRequestStream = Fazpass.shared.getCrossDeviceRequestStreamInstance()

    open override func startObserving() {
        hasListener = true
        if (hasListener) {
            stream.listen { request in
                self.sendEvent(withName:"react_trusted_device_v2_cd_request", body:request.toNSDict())
            }
        }
    }

    open override func stopObserving() {
        hasListener = false
        stream.close()
    }

    @objc
    open override func supportedEvents() -> [String]! {
        return ["react_trusted_device_v2_cd_request"];
    }

}

private extension CrossDeviceRequest {
    
    func toNSDict() -> NSDictionary {
        return [
            "merchantAppId" as NSString: self.merchantAppId as NSString,
            "expired" as NSString: self.expired as NSNumber,
            "deviceRequest" as NSString: self.deviceRequest as NSString,
            "deviceReceive" as NSString: self.deviceReceive as NSString,
            "deviceIdRequest" as NSString: self.deviceIdRequest as NSString,
            "deviceIdReceive" as NSString: self.deviceIdReceive as NSString
        ]
    }
}
