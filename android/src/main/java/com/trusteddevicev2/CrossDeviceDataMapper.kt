package com.trusteddevicev2

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.fazpass.android_trusted_device_v2.`object`.CrossDeviceData

class CrossDeviceDataMapper(data: CrossDeviceData) {

  val value: WritableMap

  init {
      value = Arguments.createMap().apply {
        putString("merchant_app_id", data.merchantAppId)
        putString("device_receive", data.deviceReceive)
        putString("device_request", data.deviceRequest)
        putString("device_id_receive", data.deviceIdReceive)
        putString("device_id_request", data.deviceIdRequest)
        putString("expired", data.expired)
        putString("status", data.status)
        if (data.notificationId != null) putString("notification_id", data.notificationId)
        if (data.action != null) putString("action", data.action)
      }
  }
}
