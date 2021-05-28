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

## Required Files - Git LFS

PLEASE INSTALL GIT LFS FROM THIS LOCATION - https://git-lfs.github.com/

After Git LFS installation from above link, in your project directory run this command to initialize it - `git lfs install` 
(Note: You should above command before `pod install` command)

## Using the SDK

The recommended way for using the SDK is by using [CocoaPods](https://cocoapods.org/pods/MeetHourSDK). In order to
do so, add the `MeetHourSDK` dependency to your existing `Podfile` or create
a new one following this example:

```
platform :ios, '12.1'

target 'MeetHourSDKTest' do
    pod 'MeetHourSDK', '~> 3.5.2'

    post_install do |installer|
        installer.pods_project.targets.each do |target|
            target.build_configurations.each do |config|
                config.build_settings['ENABLE_BITCODE'] = 'NO'
            end
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


# POD INSTALL
```
pod install
```

## General Error - MeetHourSDKTest.app/Frameworks/WebRTC.framework/WebRTC: file too short

As Github doesn't allow to upload file more than 100 MB and our WebRTC file is almost about 600 MB. We have used Git LFS to keep track of big files on Github. If you are not able to download the full version of WebRTC. Please use below command to reset it.

```

rm -rf ~/Library/Caches/CocoaPods/*
rm -rf ~/Library/Developer/Xcode/DerivedData/*
pod deintegrate 
pod setup 
pod cache clean --all
git lfs install // Check whether git lfs has been downloaded before install pod. See above
pod install

```

## API

The API is documented [here](API.md).

## Issues

Please report all issues related to this SDK to the [Meet Hour]() repository.

[CocoaPods]: https://cocoapods.org/pods/MeetHourSDK
[DownloadSDK]: https://github.com/v-empower/MeetHour-MobileSDKs
