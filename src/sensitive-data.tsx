
/**
 * Sensitive data requires the user to grant certain permissions so they could be collected.
 * All sensitive data collection is disabled by default, which means you have to enable each of
 * them manually. Until their required permissions are granted, sensitive data won't
 * be collected even if they have been enabled. Required permissions for each sensitive data have been
 * listed in this member's documentation.
 */
export enum SensitiveData {
    /**
     * AVAILABILITY: ANDROID, IOS
     *
     * To enable location on android, make sure you ask user for these permissions:
     * - android.permission.ACCESS_COARSE_LOCATION or android.permission.ACCESS_FINE_LOCATION
     * - android.permission.FOREGROUND_SERVICE
     *
     * To enable location on ios, declare NSLocationWhenInUseUsageDescription in your Info.plist file
     */
    location = "location",
    
    /**
     * AVAILABILITY: IOS
     *
     * To enable vpn on ios, add Network Extensions capability in your project.
     */
    vpn = "vpn",
    
    /**
     * AVAILABILITY: ANDROID
     *
     * To enable sim numbers and operators on android, make sure you ask user for these permissions:
     * - android.permission.READ_PHONE_NUMBERS
     * - android.permission.READ_PHONE_STATE
     */
    simOperatorsAndNumbers = "simOperatorsAndNumbers"
}