import Fazpass from "react-native-trusted-device-v2";

/**
 * An object containing data from cross device notification request.
 *
 * This object is only used as data retrieved from {@link Fazpass.getCrossDeviceDataStreamInstance()}
 * and {@link Fazpass.getCrossDeviceDataFromNotification()}.
 */
export default class CrossDeviceData {
    readonly merchantAppId : string;
    readonly deviceReceive : string;
    readonly deviceRequest : string;
    readonly deviceIdReceive : string;
    readonly deviceIdRequest : string;
    readonly expired : string;
    readonly status : string;
    readonly notificationId: string | undefined;
    readonly action: string | undefined;

    constructor(data: any) {
        this.merchantAppId = data["merchant_app_id"] as string;
        this.deviceReceive = data["device_receive"] as string;
        this.deviceRequest = data["device_request"] as string;
        this.deviceIdReceive = data["device_id_receive"] as string;
        this.deviceIdRequest = data["device_id_request"] as string;
        this.expired = data["expired"] as string;
        this.status = data["status"] as string;
        this.notificationId = data["notification_id"] as string | undefined;
        this.action = data["action"] as string | undefined;
    }
}