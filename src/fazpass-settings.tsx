import { SensitiveData } from "./sensitive-data";
import Fazpass from "react-native-trusted-device-v2";

/**
 * An object to be used as settings for {@link Fazpass.setSettings()} method.
 *
 * To construct this object, use it's builder class.
 * 
 * @see {@link FazpassSettingsBuilder} for implementation details.
 */
export default class FazpassSettings {
    readonly sensitiveData: SensitiveData[];
    readonly isBiometricLevelHigh: boolean;

    private constructor(sensitiveData: SensitiveData[],  isBiometricLevelHigh: boolean) {
        this.sensitiveData = sensitiveData;
        this.isBiometricLevelHigh = isBiometricLevelHigh;
    }

    static fromBuilder(builder: FazpassSettingsBuilder): FazpassSettings {
        return new FazpassSettings(builder.sensitiveData, builder.isBiometricLevelHigh)
    }

    static fromString(settingsString: string): FazpassSettings {
        const splitter = settingsString.split(";");
        const sensitiveData = splitter[0]!.split(",")
            .filter((it) => it != "")
            .map<SensitiveData>((it) => SensitiveData[it as keyof typeof SensitiveData]);
        const isBiometricLevelHigh = splitter[1] === 'true';

        return new FazpassSettings(sensitiveData ?? [], isBiometricLevelHigh);
    }
    
    toString(): string {
        return this.sensitiveData.map<string>((it) => it).join(",") + ';' + (this.isBiometricLevelHigh === true ? 'true' : 'false');
    };
}

/**
 * A builder to create {@link FazpassSettings} object.
 *
 * To enable specific sensitive data collection, call `enableSelectedSensitiveData` method
 * and specify which data you want to collect.
 * Otherwise call `disableSelectedSensitiveData` method
 * and specify which data you don't want to collect.
 * To set biometric level to high, call `setBiometricLevelToHigh`. Otherwise call
 * `setBiometricLevelToLow`.
 * To create {@link FazpassSettings} object with this builder configuration, use {@link FazpassSettings.fromBuilder()} method.
 * ```typescript
 * // create builder
 * const builder: FazpassSettingsBuilder = FazpassSettingsBuilder()
 *   .enableSelectedSensitiveData([SensitiveData.location])
 *   .setBiometricLevelToHigh();
 * 
 * // construct FazpassSettings with the builder
 * const settings: FazpassSettings = FazpassSettings.fromBuilder(builder);
 * ```
 *
 * You can also copy settings from {@link FazpassSettings} by using the secondary constructor.
 * ```typescript
 * const builder: FazpassSettingsBuilder =
 *   FazpassSettingsBuilder(settings);
 * ```
 */
export class FazpassSettingsBuilder {
   #sensitiveData: SensitiveData[];
   #isBiometricLevelHigh: boolean;

   get sensitiveData() {
       return this.#sensitiveData.map((v) => v);
   }
   get isBiometricLevelHigh() { 
       return this.#isBiometricLevelHigh;
   }

   constructor(settings?: FazpassSettings) {
       this.#sensitiveData = settings ? [...settings.sensitiveData] : [];
       this.#isBiometricLevelHigh = settings?.isBiometricLevelHigh ?? false;
   }

   enableSelectedSensitiveData(sensitiveData: SensitiveData[]): this  {
       for (const data in sensitiveData) {
           const key = data as keyof typeof SensitiveData;
           if (this.#sensitiveData.includes(SensitiveData[key])) {
               continue;
           } else {
               this.#sensitiveData.push(SensitiveData[key]);
           }
       }
       return this;
   }

   disableSelectedSensitiveData(sensitiveData: SensitiveData[]): this {
       for (const data in sensitiveData) {
           const key = data as keyof typeof SensitiveData;
           const willRemoveIndex = this.#sensitiveData.indexOf(SensitiveData[key], 0);
           if (willRemoveIndex > -1) {
               this.#sensitiveData.splice(willRemoveIndex, 1);
           } else {
               continue;
           }
       }
       return this;
   }

   setBiometricLevelToHigh(): this {
       this.#isBiometricLevelHigh = true;
       return this;
   }

   setBiometricLevelToLow(): this {
       this.#isBiometricLevelHigh = false;
       return this;
   }
}