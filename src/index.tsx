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

export function multiply(a: number, b: number): Promise<number> {
  return TrustedDeviceV2.multiply(a, b);
}
