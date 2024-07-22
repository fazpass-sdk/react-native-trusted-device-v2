package com.trusteddevicev2

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.fazpass.android_trusted_device_v2.Fazpass
import com.fazpass.android_trusted_device_v2.`object`.CrossDeviceDataStream

class CrossDeviceModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "CrossDevice"
  }

  override fun getName(): String = NAME

  private val streamInstance: CrossDeviceDataStream =
    Fazpass.instance.getCrossDeviceDataStreamInstance(reactApplicationContext.applicationContext)

  private var listenerCount = 0

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  @ReactMethod
  fun addListener(eventName: String) {
    if (listenerCount == 0) {
      // Set up any upstream listeners or background tasks as necessary
      streamInstance.listen {
        sendEvent(reactApplicationContext, eventName, CrossDeviceDataMapper(it).value)
      }
    }

    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount -= count
    if (listenerCount == 0) {
      streamInstance.close()
    }
  }
}
