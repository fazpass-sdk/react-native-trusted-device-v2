import { NativeModules, Platform } from 'react-native';
import { SensitiveData } from './sensitive-data';
import type ReactNativeTrustedDevice from './react-native-trusted-device';
import FazpassSettings, { FazpassSettingsBuilder } from './fazpass-settings';
import CrossDeviceDataStream from './cross-device-data-stream';
import CrossDeviceData from './cross-device-data';

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

  #getCrossDeviceDataStream: CrossDeviceDataStream;

  private constructor() {
    this.#getCrossDeviceDataStream = new CrossDeviceDataStream(CrossDevice);
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

  getCrossDeviceDataStreamInstance(): CrossDeviceDataStream {
    return this.#getCrossDeviceDataStream;
  }

  async getCrossDeviceDataFromNotification(): Promise<CrossDeviceData | undefined> {
    const data = await (TrustedDeviceV2.getCrossDeviceRequestFromNotification() as Promise<any>);
    return new CrossDeviceData(data);
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
export { CrossDeviceData }
export { CrossDeviceDataStream }