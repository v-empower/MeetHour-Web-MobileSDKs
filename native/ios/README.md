# Meet Hour iOS SDK releases

---
id: dev-guide-ios-sdk
title: Meet Hour iOS SDK
---

This repository contains the binaries for the **[Meet Hour]() iOS SDK**. Each
release is tagged in this repository and is composed of 2 frameworks:

- MeetHourSDK.xcframework
- WebRTC.xcframework

It is **strongly advised** to use the provided WebRTC framework and not
replace it with any other build, since the provided one is known to work
with the SDK.

## Using the SDK

The recommended way for using the SDK is by using [CocoaPods](). In order to
do so, add the `MeetHourSDK` dependency to your existing `Podfile` or create
a new one following this example:

```
platform :ios, '11.0'

workspace 'MeetHourSDKTest.xcworkspace'

target 'MeetHourSDKTest' do
  project 'MeetHourSDKTest.xcodeproj'

  pod 'MeetHourSDK'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end
end
```

Replace `MeetHourSDKTest` with your project and target names.

Bitcode is not supported, so turn it off for your project.

The SDK uses Swift code, so make sure you select `Always Embed Swift Standard Libraries`
in your project.

Since the SDK requests camera and microphone access, make sure to include the
required entries for `NSCameraUsageDescription` and `NSMicrophoneUsageDescription`
in your `Info.plist` file.

In order for app to properly work in the background, select the "audio" and "voip"
background modes.

Last, since the SDK shows and hides the status bar based on the conference state,
you may want to set `UIViewControllerBasedStatusBarAppearance` to `NO` in your
`Info.plist` file.

## API

The API is documented [here](API.md).

## Issues

Please report all issues related to this SDK to the [Meet Hour]() repository.

[CocoaPods]: https://cocoapods.org/pods/MeetHourSDK
[Meet Hour]: https://github.com/v-empower/meethour-ios-sdk-releases