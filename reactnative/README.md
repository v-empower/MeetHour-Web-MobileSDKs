# React Native Meet Hour SDK.
Meet Hour Plugin for React Native. Supports Android & iOS platforms.

"Meet Hour is 100% free video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc." 

Example Project is here - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/reactnative/MeetHourSDKTest

## Install (Latest version 3.0.1)

```
  `npm install react-native-meet-hour-sdk --save` 
```

## MeetHour SDK Implementation - Steps

1. SDK Example Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

# Steps to Integrate:

1. Signup for Meet Hour (https://meethour.io) and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Once you signup for developer plan, and go to our Dashboard - (https://portal.meethour.io) and tap on "Developers" menu.
3. Now copy and Client ID & Client Secret and keep it handy with you.
4. Go to our API documentation and hit Login API to get oAuth Access Token - (https://bit.ly/3E2hKU7)
5. Once you get an access token, you can access any our API. Now you first thing you have to do is create a contact in our system as soon as user signup in your platform using this API (https://bit.ly/3LRehug). This will give you unique contact_id of that user. You require this id when you schedule a meeting below.
6. Later go to Schedule Meeting API -> Pass all the parameters needed to generate a new meetings - (https://bit.ly/3riFLkx)
7. Once the meeting is genereate, in order to join a meeting you require to Generate JWT Token using this API (https://bit.ly/3ur5pFR) and pass it to the conference URL via MT Parameter - https://meethour.io?mt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSlNVekkxTmlKOS5leUpoZFdRaU9pSTVNemxrWmpVeE5pMDJNekEzTFRRNVkyUXRPVGMxTXkwek1XRTNNemRrT1RGaE1HWWlMQ0pxZEdraU9pSmtNMlUyT

## Usage

The package can be invoked in two modes

1. As a new Activity/UIViewController on top of RN Application
2. As a RN View

```jsx
import MeetHour, { MeetHourView } from 'react-native-meet-hour-sdk';
import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';

const conferenceOptions = {
  room: 'ReactNativeMeetHourRoom',
  userInfo: {
    displayName: 'React Native Meet Hour Example',
    email: 'example@test.com',
    avatar: 'https://picsum.photos/200',
  },
  featureFlags: {
    'live-streaming.enabled': false,
  },
};

function App() {
  const [showMeetHourView, setShowMeetHourView] = useState(false);

  const startMeetHourAsNativeController = async () => {
    /* 
      Mode 1 - Starts a new MeetHour Activity/UIViewController on top of RN Application (outside of JS).
      It doesn't require rendering MeetHourView Component.
    */

    await MeetHour.launchMeetHourView(conferenceOptions);

    /*
      Note:
        MeetHour.launchMeetHourView will return a promise, which is resolved once the conference is terminated and the MeetHourView is dismissed.
    */
  };

  /*
    The localParticipant leaves the current conference.
  */
  const hangUp = () => {
    MeetHour.hangUp();
  };

  if (showMeetHourView) {
    /* Mode 2 - Starts MeetHour as a RN View */

    return (
      <MeetHourView
        style={styles.mHView}
        options={conferenceOptions}
        onConferenceTerminated={(_) => setShowMeetHourView(false)}
        onConferenceJoined={(e) => console.log(e.nativeEvent)}
        onConferenceWillJoin={(e) => console.log(e.nativeEvent)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={startMeetHourAsNativeController}
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Text style={styles.pressableText}>
          Start MeetHour on top of RN Application
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowMeetHourView(true)}
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Text style={styles.pressableText}>Start MeetHour as a RN View</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    width: '80%',
    borderRadius: 15,
    height: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  pressableText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  mHView: {
    flex: 1,
  },
});

export default App;
```

See [Options](#options) for further information.

## iOS install

1.) This library uses Swift code, so make sure that you have created the `Objective-C bridging header file`.

If not, open your project in Xcode and create an empty Swift file.

Xcode will ask if you wish to create the bridging header file, please choose yes.

For more information check [Create Objective-C bridging header file](https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift).

2.) Replace the following code in AppDelegate.m (ONLY required for mode 1. If you're using mode 2, skip this step):

```objective-c
UIViewController *rootViewController = [UIViewController new];
rootViewController.view = rootView;
self.window.rootViewController = rootViewController;
```

with this one

```objective-c
UIViewController *rootViewController = [UIViewController new];
UINavigationController *navigationController = [[UINavigationController alloc]initWithRootViewController:rootViewController];
navigationController.navigationBarHidden = YES;
rootViewController.view = rootView;
self.window.rootViewController = navigationController;
```

This will create a navigation controller to be able to navigate between the MeetHour component and your react native screens.

3.) Add the following lines to your `Info.plist`

```xml
<key>NSCameraUsageDescription</key>
<string>Camera Permission</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone Permission</string>
<key>NSCalendarUsageDescription</key>
<string>Calendar Permission</string>
```

4.) Modify your platform version in Podfile and Xcode to have platform version `12.0` or above.

![](https://firebasestorage.googleapis.com/v0/b/react-native-meet-hour-sdk.appspot.com/o/Captura%20de%20Tela%202021-12-16%20a%CC%80s%2016.44.57.png?alt=media&token=c653bdbb-f08b-4e6a-a571-0f0894a12997)

![](https://firebasestorage.googleapis.com/v0/b/react-native-meet-hour-sdk.appspot.com/o/Captura%20de%20Tela%202021-12-16%20a%CC%80s%2016.45.25.png?alt=media&token=d97bfa72-d583-4046-88fd-a3d1c290834d)

5.) In Xcode, under `Build settings` set `Enable Bitcode` to `No` and `Always Embed Swift Standard Libraries` to `Yes`.

6.) In Xcode, under `Signing & Capabilities` add the capability `Background Modes` and check `Voice over IP`. Otherwise, it won't work well in background.

7.) Clean your project and run `npx pod-install`.

## Android install

1.) In `android/app/build.gradle`, add/replace the following lines:

```groovy
project.ext.react = [
    entryFile: "index.js",
    bundleAssetName: "app.bundle",
    ...
]
```

2.) In `android/app/src/main/java/com/xxx/MainApplication.java` add/replace the following methods:

```java
  import androidx.annotation.Nullable; // <--- Add this line if not already existing
  ...
    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected @Nullable String getBundleAssetName() {
      return "app.bundle";
    }
```

3.) In `android/build.gradle`, add the following code

```groovy
allprojects {
    repositories {
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        maven {
            url "https://maven.google.com"
        }
        maven { // <---- Add this block
            url "https://repo.meethour.io/maven/releases/"
        }
    }
}
```

4.) In the `<application>` section of `android/app/src/main/AndroidManifest.xml`, add (ONLY required for mode 1. If you're using mode 2, skip this step)

```xml
<activity
    android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize"
    android:launchMode="singleTask"
    android:resizeableActivity="true"
    android:supportsPictureInPicture="true"
    android:windowSoftInputMode="adjustResize"
    android:name="go.meethour.io.react.sdk.MeetHourActivityExtended">
</activity>
```

5.) And set your minSdkVersion to be at least 24.

```groovy
buildscript {
    ext {
        buildToolsVersion = "29.0.3"
        minSdkVersion = 24 // <-- this line
        compileSdkVersion = 29
        targetSdkVersion = 29
        ndkVersion = "20.1.5948944"
    }
    ...
}
```

6.) Remove allow back up from Androidmanifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.sdktest">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false" <-- this line
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

## Options

| key          | Data type | Default             | Description                                                                                                     |
| ------------ | --------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| room         | string    | required            | Room name for Meet Hour                                                                                        |
| serverUrl    | string    | https://meethour.io | Valid server URL                                                                                                |
| token        | string    | ""                  | JWT token                                                                                                       |
| subject      | string    | ""                  | Conference subject (will change the global subject for all participants)                                        |
| audioOnly    | boolean   | false               | Controls whether the participant will join the conference in audio-only mode (no video is sent or recieved)     |
| audioMuted   | boolean   | false               | Controls whether the participant will join the conference with the microphone muted                             |
| videoMuted   | boolean   | false               | Controls whether the participant will join the conference with the camera muted                                 |
| userInfo     | object    | {}                  | Object that contains information about the participant starting the meeting. See [UserInfo](#userinfo)          |
| featureFlags | object    | {}                  | Object that contains information about which feature flags should be set. See below for more info.              |

### Feature Flags

For examples on how to set feature flags, see the [usage example](#usage) above.

## UserInfo

| key         | Data type | Default | Description              |
| ----------- | --------- | ------- | ------------------------ |
| displayName | string    | ""      | Participant's name       |
| email       | string    | ""      | Participant's e-mail     |
| avatar      | string    | ""      | Participant's avatar URL |

## Screen Sharing

It is already enabled by default on Android.

On iOS it requires a few extra steps. Set the flag `screenSharingEnabled` to true and follow this tutorial [Screen Sharing iOS] to get it working.

## Instructions to run the example app

1.) Clone this project

```bash
git clone https://github.com/v-empower/react-native-meet-hour-sdk.git
```

2.) Navigate to the project folder

```bash
cd react-native-meet-hour-sdk
```

3.) Install dependencies

```bash
yarn
```

4.) Run app

```bash
yarn example ios

or

yarn example android
```

## Troubleshooting

If your having problems with `duplicate_classes` errors, try exclude them from the react-native-meet-hour-sdk project implementation with the following code:

```groovy
implementation(project(':react-native-meet-hour-sdk')) {
  
      // Un-comment below if using hermes
//    exclude group: 'com.facebook',module:'hermes'

      // Un-comment any packages below that you have added to your project to prevent `duplicate_classes` errors
//     exclude group: 'com.facebook.react',module:'react-native-locale-detector'
//     exclude group: 'com.facebook.react',module:'react-native-vector-icons'
//     exclude group: 'com.facebook.react',module:'react-native-async-storage'
//     exclude group: 'com.facebook.react',module:'react-native-community_netinfo'
//     exclude group: 'com.facebook.react',module:'react-native-svg'
//     exclude group: 'com.facebook.react',module:'react-native-svg'
//     exclude group: 'com.facebook.react', module:'react-native-gesture-handler'
//     exclude group: 'com.facebook.react',module:'react-native-fetch-blob'
//     exclude group: 'com.facebook.react',module:'react-native-webview'
//     exclude group: 'com.facebook.react',module:'react-native-linear-gradient'
//     exclude group: 'com.facebook.react',module:'react-native-sound'
}
```
