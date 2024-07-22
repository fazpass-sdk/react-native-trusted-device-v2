package com.trusteddevicev2

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.fazpass.android_trusted_device_v2.Fazpass
import com.fazpass.android_trusted_device_v2.`object`.FazpassSettings

class TrustedDeviceV2Module(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "TrustedDeviceV2"
  }

  override fun getName(): String = NAME

  @ReactMethod
  fun initz(androidAssetName: String, promise: Promise) {
    Fazpass.instance.init(reactApplicationContext.applicationContext, androidAssetName);
    promise.resolve(null)
  }

  @ReactMethod
  fun generateMeta(accountIndex: Double, promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject(NullPointerException("Activity not found!"))
      return
    }

    UiThreadUtil.runOnUiThread {
      Fazpass.instance.generateMeta(activity, accountIndex.toInt()) { meta, e ->
        if (e != null) {
          promise.reject(e.exception)
          return@generateMeta
        }

        promise.resolve(meta)
      }
    }
  }

  @ReactMethod
  fun generateNewSecretKey(promise: Promise) {
    Fazpass.instance.generateNewSecretKey(reactApplicationContext.applicationContext)
    promise.resolve(null)
  }

  @ReactMethod
  fun setSettings(accountIndex: Double, settingsString: String?, promise: Promise) {
    val settings = if (settingsString != null) FazpassSettings.fromString(settingsString) else null
    Fazpass.instance.setSettings(reactApplicationContext.applicationContext, accountIndex.toInt(), settings)
    promise.resolve(null)
  }

  @ReactMethod
  fun getSettings(accountIndex: Double, promise: Promise) {
    val settings = Fazpass.instance.getSettings(accountIndex.toInt())
    promise.resolve(settings?.toString())
  }

  @ReactMethod
  fun getCrossDeviceDataFromNotification(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject(NullPointerException("Activity not found!"))
      return
    }

    val data = Fazpass.instance.getCrossDeviceDataFromNotification(activity.intent)
    val map = if (data != null) CrossDeviceDataMapper(data).value else null
    promise.resolve(map)
  }

  @ReactMethod
  fun getAppSignatures(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject(NullPointerException("Activity not found!"))
      return
    }

    val signatures = Fazpass.helper.getAppSignatures(activity)
    val array = Arguments.createArray()
    signatures.forEach { item -> array.pushString(item) }
    promise.resolve(array)
  }
}
