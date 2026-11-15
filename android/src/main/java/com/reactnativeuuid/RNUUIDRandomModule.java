package com.reactnativeuuid;

import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.SecureRandom;

/**
 * Supplies cryptographically secure random bytes to react-native-uuid when the
 * JS runtime has no crypto.getRandomValues (e.g. Hermes without a polyfill).
 */
public class RNUUIDRandomModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RNUUIDRandom";

  // SecureRandom is thread-safe and self-seeding
  private static final SecureRandom RANDOM = new SecureRandom();

  RNUUIDRandomModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  /** Returns `length` random bytes as base64, or null for an invalid length. */
  @Nullable
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getRandomBase64(double length) {
    int count = (int) length;
    if (count <= 0 || count > 65536) {
      return null;
    }

    byte[] bytes = new byte[count];
    RANDOM.nextBytes(bytes);
    return Base64.encodeToString(bytes, Base64.NO_WRAP);
  }
}
