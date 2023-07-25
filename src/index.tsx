import { NativeModules, Platform } from 'react-native';

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

export default class Fazpass {
  private constructor() {}

  static instance = new Fazpass();

  init(assetName: string): Promise<any> {
    return TrustedDeviceV2.initz(assetName);
  }
  
  generateMeta(): Promise<string> {
    return TrustedDeviceV2.generateMeta();
  }
  
  enableSelected(selected: Array<SensitiveData>): Promise<any> {
    return TrustedDeviceV2.enableSelected(selected.map((v,_,__) => v.toString()))
  }
}

export enum SensitiveData {
  location,
  vpn,
  simOperatorsAndNumbers,
}