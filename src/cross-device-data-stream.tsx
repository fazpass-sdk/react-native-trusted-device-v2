import { NativeEventEmitter, type EmitterSubscription } from "react-native";
import CrossDeviceData from "./cross-device-data";
import Fazpass from "react-native-trusted-device-v2";

/**
 * An instance acquired from {@link Fazpass.getCrossDeviceDataStreamInstance()} to start listening for
 * incoming cross device request notification.
 *
 * call `listen` method to start listening, and call `close` to stop.
 */
export default class CrossDeviceDataStream {
    private static eventType = 'react_trusted_device_v2_cd_event';

    #emitter: NativeEventEmitter;
    #listener: EmitterSubscription | undefined;

    constructor(module: any) {
        this.#emitter = new NativeEventEmitter(module);
    }

    listen(callback: (request: CrossDeviceData) => void) {
        if (this.#listener !== undefined) {
            this.close()
        }
        this.#listener = this.#emitter.addListener(CrossDeviceDataStream.eventType, (event) => {
            const data = new CrossDeviceData(event)
            callback(data)
        });
    }

    close() {
        this.#listener?.remove()
        this.#listener = undefined
    }
}