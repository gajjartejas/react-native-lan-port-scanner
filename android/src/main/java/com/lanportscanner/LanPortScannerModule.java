package com.lanportscanner;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

import java.math.BigInteger;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.util.List;
import java.util.Locale;

@ReactModule(name = LanPortScannerModule.NAME)
public class LanPortScannerModule extends NativeLanPortScannerSpec {
    public static final String NAME = "LanPortScanner";

    private final ReactApplicationContext reactContext;

    public LanPortScannerModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public void getNetworkInfo(Promise promise) {
        WritableMap map = Arguments.createMap();

        try {
            // Get the IP address
            WifiManager mWifiManager = (WifiManager)
                    reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);

            if (mWifiManager != null) {
                WifiInfo wifiInfo = mWifiManager.getConnectionInfo();
                if (wifiInfo != null) {
                    byte[] ipAddressByteArray =
                            BigInteger.valueOf(wifiInfo.getIpAddress()).toByteArray();
                    NetInfoUtils.reverseByteArray(ipAddressByteArray);
                    InetAddress inetAddress = InetAddress.getByAddress(ipAddressByteArray);
                    String ipAddress = inetAddress.getHostAddress();
                    map.putString("ipAddress", ipAddress);

                    NetworkInterface netAddress = NetworkInterface.getByInetAddress(inetAddress);
                    if (netAddress != null) {
                        //Get subnet
                        List<InterfaceAddress> addresses = netAddress.getInterfaceAddresses();

                        short networkPrefixLength = 0;
                        for (InterfaceAddress address : addresses) {
                            boolean isIpV4 = address.getAddress().getAddress().length == 4;
                            if (isIpV4) {
                                networkPrefixLength = address.getNetworkPrefixLength();
                                break;
                            }
                        }

                        int mask = 0xffffffff << (32 - networkPrefixLength);
                        String subnet = String.format(
                                Locale.US,
                                "%d.%d.%d.%d",
                                (mask >> 24 & 0xff),
                                (mask >> 16 & 0xff),
                                (mask >> 8 & 0xff),
                                (mask & 0xff));

                        map.putString("subnetMask", subnet);
                    }
                }
            }
            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
