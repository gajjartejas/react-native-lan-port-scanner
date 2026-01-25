package com.lanportscanner;

import androidx.annotation.Nullable;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class LanPortScannerPackage extends BaseReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (LanPortScannerModule.NAME.equals(name)) {
      return new LanPortScannerModule(reactContext);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();

      moduleInfos.put(
        LanPortScannerModule.NAME,
        new ReactModuleInfo(
          LanPortScannerModule.NAME,
          LanPortScannerModule.NAME,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // hasConstants
          false,  // isCxxModule
          true // isTurboModule
        )
      );

      return moduleInfos;
    };
  }
}
