import { NativeEventEmitter, type EmitterSubscription } from "react-native";
import CrossDeviceRequest from "./cross-device-request";
import Fazpass from "react-native-trusted-device-v2";

/**
 * An instance acquired from {@link Fazpass.getCrossDeviceRequestStreamInstance()} to start listening for
 * incoming cross device request notification.
 *
 * call `listen` method to start listening, and call `close` to stop.
 */
export default class CrossDeviceRequestStream {
    private static eventType = 'react_trusted_device_v2_cd_request';

    #emitter: NativeEventEmitter;
    #listener: EmitterSubscription | undefined;

    constructor(module: any) {
        this.#emitter = new NativeEventEmitter(module);
    }

    listen(callback: (request: CrossDeviceRequest) => void) {
        if (this.#listener !== undefined) {
            this.close()
        }
        this.#listener = this.#emitter.addListener(CrossDeviceRequestStream.eventType, (event) => {
            const data = new CrossDeviceRequest(event as Map<string, string>)
            callback(data)
        });
    }

    close() {
        this.#listener?.remove()
        this.#listener = undefined
    }
}