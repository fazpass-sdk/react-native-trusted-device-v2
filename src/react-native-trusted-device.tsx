import Fazpass, {CrossDeviceRequest, CrossDeviceRequestStream, FazpassSettings} from "react-native-trusted-device-v2";

export default interface ReactNativeTrustedDevice {
  
  /** Initializes everything.
  *
  * Required to be called once at the start of application, otherwise
  * unexpected error may occur.
  * For Android, put the public key in your assets folder,
  * then fill the `androidAssetName` with your file's name (Example: "public_key.pub").
  * For iOS, reference the public key in your XCode project assets as data set,
  * then fill the `iosAssetName` with your asset's name (Example: "FazpassPublicKey").
  * Finally, fill the `iosFcmAppId` with FCM App ID that you get from fazpass
  * after submitting your apple push notifications key.
  *
  * If your application only targets specific platform (Android only / iOS only),
  * you can fill the unused platform's parameter with null.
  */
  init(androidAssetName?: string, iosAssetName?: string, iosFcmAppId?: string): Promise<any>;
  
  /**
   * Retrieves application signatures.
   * 
   * Only works in android. Will return empty list in iOS.
   */
  getAppSignatures(): Promise<Array<string> | undefined>;
  
  /**
   * Collects specific data according to settings and generate meta from it as Base64 string.
   *
   * You can use this meta to hit Fazpass API endpoint. Calling this method will automatically launch
   * local authentication (biometric / password). Any rules that have been set in method {@link Fazpass.setSettings()}
   * will be applied according to the `accountIndex` parameter.
   *
   * Throws any {@link FazpassException} if an error occurred.
   */
  generateMeta(accountIndex: number): Promise<string>;
  
  /** 
   * Generates new secret key for high level biometric settings.
   *
   * Before generating meta with "High Level Biometric" settings, You have to generate secret key first by
   * calling this method. This secret key will be invalidated when there is a new biometric enrolled or all
   * biometric is cleared, which makes your active fazpass id to get revoked when you hit Fazpass Check API
   * using meta generated with "High Level Biometric" settings. When secret key has been invalidated, you have
   * to call this method to generate new secret key and enroll your device with Fazpass Enroll API to make
   * your device trusted again.
   *
   * Might throws exception when generating new secret key. Report this exception as a bug when that happens.
   */
  generateNewSecretKey(): Promise<void>;

  /**
   * Sets rules for data collection in{@link Fazpass.generateMeta()} method.
   *
   * Sets which sensitive information is collected in {@link Fazpass.generateMeta()} method
   * and applies them according to `accountIndex` parameter. Accepts {@link FazpassSettings} for `settings`
   * parameter. Settings will be stored in SharedPreferences (UserDefaults in iOS), so it will
   * not persist when application data is cleared / application is uninstalled. To delete
   * stored settings, pass undefined on `settings` parameter.
   */
  setSettings(accountIndex: number, settings?: FazpassSettings): Promise<void>;

  /**
   * Retrieves the rules that has been set in {@link Fazpass.setSettings()} method.
   *
   * Retrieves a stored {@link FazpassSettings} object based on the `accountIndex` parameter.
   * Returns null if there is no stored settings for this `accountIndex`.
   */
  getSettings(accountIndex: number): Promise<FazpassSettings | undefined>;

  /**
   * Retrieves the stream instance of cross device request.
   *
   * Before you listen to cross device login request stream, make sure these requirements
   * have been met:
   * - Device has been enrolled.
   * - Device is currently trusted (See Fazpass documentation for the definition of "trusted").
   * - Application is in "Logged In" state.
   */
  getCrossDeviceRequestStreamInstance(): CrossDeviceRequestStream;

  /**
   * Retrieves a {@link CrossDeviceRequest} object obtained from notification.
   *
   * If user launched the application from notification, this method will return data
   * contained in that notification. Will return null if user launched the application
   * normally.
   */
  getCrossDeviceRequestFromNotification(): Promise<CrossDeviceRequest | undefined>;
}