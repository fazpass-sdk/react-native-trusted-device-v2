package com.trusteddevicev2

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.fazpass.android_trusted_device_v2.Fazpass
import com.fazpass.android_trusted_device_v2.SensitiveData


class TrustedDeviceV2Module(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun init(assetName: String, promise: Promise) {
    Fazpass.instance.init(reactApplicationContext.applicationContext, assetName);
    promise.resolve(null)
  }

  @ReactMethod
  fun generateMeta(promise: Promise) {
    Fazpass.instance.generateMeta(reactApplicationContext.applicationContext) { meta ->
      promise.resolve(meta)
    }
  }

  @ReactMethod
  fun enableSelected(arguments: ReadableArray, promise: Promise) {
    val selected = arguments.toArrayList().mapNotNull {
      try {
        SensitiveData.valueOf(it as String)
      } catch (_: IllegalArgumentException) {
        null
      }
    }
    Fazpass.instance.enableSelected(*selected.toTypedArray())
    promise.resolve(null)
  }

  companion object {
    const val NAME = "TrustedDeviceV2"
  }
}
