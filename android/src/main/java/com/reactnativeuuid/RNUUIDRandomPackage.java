package com.reactnativeuuid;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.Collections;

// BaseReactPackage requires React Native 0.74+
public class RNUUIDRandomPackage extends BaseReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(
      @NonNull String name, @NonNull ReactApplicationContext reactContext) {
    if (RNUUIDRandomModule.NAME.equals(name)) {
      return new RNUUIDRandomModule(reactContext);
    }
    return null;
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () ->
        Collections.singletonMap(
            RNUUIDRandomModule.NAME,
            new ReactModuleInfo(
                RNUUIDRandomModule.NAME,
                RNUUIDRandomModule.class.getName(),
                false, // canOverrideExistingModule
                false, // needsEagerInit
                false, // isCxxModule
                false)); // isTurboModule: legacy module, exposed via the interop layer
  }
}
