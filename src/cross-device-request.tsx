import Fazpass from "react-native-trusted-device-v2";

/**
 * An object containing data from cross device notification request.
 *
 * This object is only used as data retrieved from {@link Fazpass.getCrossDeviceRequestStreamInstance()}
 * and {@link Fazpass.getCrossDeviceRequestFromNotification()}.
 */
export default class CrossDeviceRequest {
    readonly merchantAppId : string;
    readonly expired : number;
    readonly deviceReceive : string;
    readonly deviceRequest : string;
    readonly deviceIdReceive : string;
    readonly deviceIdRequest : string;

    constructor(data: Map<string, string>) {
        this.merchantAppId = data.get("merchant_app_id") as string;
        this.expired = Number.parseInt(data.get("expired") as string) ?? 0;
        this.deviceReceive = data.get("device_receive") as string;
        this.deviceRequest = data.get("device_request") as string;
        this.deviceIdReceive = data.get("device_id_receive") as string;
        this.deviceIdRequest = data.get("device_id_request") as string;
    }
}