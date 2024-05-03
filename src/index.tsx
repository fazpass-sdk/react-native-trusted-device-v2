import { NativeModules, Platform } from 'react-native';
import { SensitiveData } from './sensitive-data';
import type ReactNativeTrustedDevice from './react-native-trusted-device';
import FazpassSettings, { FazpassSettingsBuilder } from './fazpass-settings';
import CrossDeviceRequestStream from './cross-device-request-stream';
import CrossDeviceRequest from './cross-device-request';

const LINKING_ERROR =
  `The package 'react-native-trusted-device-v2' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TrustedDeviceV2 = NativeModules.TrustedDeviceV2
  ? NativeModules.TrustedDeviceV2
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const CrossDevice = NativeModules.CrossDevice
  ? NativeModules.CrossDevice
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export default class Fazpass implements ReactNativeTrustedDevice {
  
  static instance = new Fazpass();

  #getCrossDeviceRequestStream: CrossDeviceRequestStream;

  private constructor() {
    this.#getCrossDeviceRequestStream = new CrossDeviceRequestStream(CrossDevice);
  }

  init(androidAssetName?: string, iosAssetName?: string, iosFcmAppId?: string): Promise<any> {
    if (Platform.OS === "android") {
      return TrustedDeviceV2.initz(androidAssetName);
    }

    return TrustedDeviceV2.initz(iosAssetName, iosFcmAppId);
  }

  generateMeta(accountIndex: number = -1): Promise<string> {
    return TrustedDeviceV2.generateMeta(accountIndex);
  }

  generateNewSecretKey(): Promise<void> {
    return TrustedDeviceV2.generateNewSecretKey();
  }

  setSettings(accountIndex: number, settings?: FazpassSettings | undefined): Promise<void> {
    return TrustedDeviceV2.setSettings(accountIndex, settings?.toString());
  }

  async getSettings(accountIndex: number): Promise<FazpassSettings | undefined> {
    const settingsString = await (TrustedDeviceV2.getSettings(accountIndex) as Promise<string | undefined>);
    return settingsString ? FazpassSettings.fromString(settingsString) : undefined;
  }

  getCrossDeviceRequestStreamInstance(): CrossDeviceRequestStream {
    return this.#getCrossDeviceRequestStream;
  }

  getCrossDeviceRequestFromNotification(): Promise<CrossDeviceRequest | undefined> {
    return TrustedDeviceV2.getCrossDeviceRequestFromNotification();
  }

  async getAppSignatures(): Promise<Array<string> | undefined> {
    if (Platform.OS === "android") {
      return await TrustedDeviceV2.getAppSignatures();
    }

    return undefined
  } 
}

export { SensitiveData }
export { FazpassSettings, FazpassSettingsBuilder }
export { CrossDeviceRequest }
export { CrossDeviceRequestStream }