package com.lanportscanner;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import androidx.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LanPortScannerPackage extends TurboReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(LanPortScannerModule.NAME)) {
      return new LanPortScannerModule(reactContext);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(
          LanPortScannerModule.NAME,
          new ReactModuleInfo(
              LanPortScannerModule.NAME,
              LanPortScannerModule.NAME,
              false, // canOverrideExistingModule
              false, // needsEagerInit
              false, // hasConstants
              false, // isCxxModule
              isTurboModule // isTurboModule
          ));
      return moduleInfos;
    };
  }
}
