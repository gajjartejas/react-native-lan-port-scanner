package com.lanportscanner;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;
import androidx.annotation.NonNull;
import org.json.JSONObject;
import java.math.BigInteger;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Locale;

@ReactModule(name = LanPortScannerModule.NAME)
public class LanPortScannerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "LanPortScanner";

  private static ReactApplicationContext reactContext;

  public LanPortScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext = context;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

    @ReactMethod
    public void getNetworkInfo(Promise promise) {
      WritableMap map = Arguments.createMap();

      // Get the IP address
      WifiManager mWifiManager = (WifiManager)
              reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);

      WifiInfo wifiInfo = mWifiManager.getConnectionInfo();
      if (wifiInfo != null) {
        try {
          byte[] ipAddressByteArray =
                  BigInteger.valueOf(wifiInfo.getIpAddress()).toByteArray();
          NetInfoUtils.reverseByteArray(ipAddressByteArray);
          InetAddress inetAddress = InetAddress.getByAddress(ipAddressByteArray);
          String ipAddress = inetAddress.getHostAddress();
          map.putString("ipAddress", ipAddress);


          //Get subnet
          NetworkInterface netAddress =
                  NetworkInterface.getByInetAddress(inetAddress);
          int mask =
                  0xffffffff
                          << (32
                          - netAddress
                          .getInterfaceAddresses()
                          .get(1)
                          .getNetworkPrefixLength());
          String subnet =
                  String.format(
                          Locale.US,
                          "%d.%d.%d.%d",
                          (mask >> 24 & 0xff),
                          (mask >> 16 & 0xff),
                          (mask >> 8 & 0xff),
                          (mask & 0xff));
          map.putString("subnetMask", subnet);

          promise.resolve(map);
        } catch (Exception e) {
          // Ignore errors
        }
        }
    }
}
