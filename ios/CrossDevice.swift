
import Foundation
import ios_trusted_device_v2

@objc(CrossDevice)
open class CrossDevice: RCTEventEmitter {

    var hasListener: Bool = false
    let stream = Fazpass.shared.getCrossDeviceDataStreamInstance()

    open override func startObserving() {
        hasListener = true
        if (hasListener) {
            stream.listen { data in
                self.sendEvent(withName:"react_trusted_device_v2_cd_event", body:data.toNSDict())
            }
        }
    }

    open override func stopObserving() {
        hasListener = false
        stream.close()
    }

    @objc
    open override func supportedEvents() -> [String]! {
        return ["react_trusted_device_v2_cd_event"];
    }

}

extension CrossDeviceData {
    
    func toNSDict() -> NSDictionary {
        return [
            "merchant_app_id" as NSString: self.merchantAppId as NSString,
            "device_receive" as NSString: self.deviceReceive as NSString,
            "device_request" as NSString: self.deviceRequest as NSString,
            "device_id_receive" as NSString: self.deviceIdReceive as NSString,
            "device_id_request" as NSString: self.deviceIdRequest as NSString,
            "expired" as NSString: self.expired as NSString,
            "status" as NSString: self.status as NSString,
            "notification_id" as NSString: self.notificationId as NSString? ?? NSNull(),
            "action" as NSString: self.action as NSString? ?? NSNull()
        ]
    }
}
