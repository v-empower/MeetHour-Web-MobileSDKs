package com.meethoursdktest;

import android.app.Application;

import androidx.annotation.Nullable;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags;
import com.facebook.react.internal.featureflags.ReactNativeNewArchitectureFeatureFlagsDefaults;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected @Nullable String getBundleAssetName() {
          return "index.android.bundle";
        }

        // NOTE: isHermesEnabled() and isNewArchEnabled() are deliberately NOT overridden.
        // React Native removed them from DefaultReactNativeHost; Hermes and the New
        // Architecture are now driven by gradle.properties and the feature flags set
        // in onCreate() below.
      };

  private @Nullable ReactHost mReactHost;

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public @Nullable ReactHost getReactHost() {
    if (mReactHost == null) {
      mReactHost =
          DefaultReactHost.getDefaultReactHost(getApplicationContext(), mReactNativeHost, null);
    }
    return mReactHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // SoLoader must be initialised before any React Native feature-flag access.
    try {
      SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
    ReactNativeFeatureFlags.INSTANCE.override(new ReactNativeNewArchitectureFeatureFlagsDefaults());
  }
}
