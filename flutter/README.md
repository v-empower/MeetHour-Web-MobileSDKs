# Meet Hour Flutter SDK

Meet Hour Plugin for Flutter. Supports Android and iOS platforms.

"Meet Hour is 100% free video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc." 

Example Project is here - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/flutter/MeetHourSDKTest


Pub dev - https://pub.dev/packages/meet_hour

```
  meet_hour: '>=5.0.12'
```

# MeetHour SDK Implementation - Steps

1. SDK Examples Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

# Steps to Integrate:

1. Signup for Meet Hour (https://meethour.io) and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Once you signup for developer plan, and go to our Dashboard - (https://portal.meethour.io) and tap on "Developers" menu.
3. Now copy and Client ID & Client Secret and keep it handy with you.
4. Go to our API documentation and hit Login API to get oAuth Access Token - (https://bit.ly/3E2hKU7)
5. Once you get an access token, you can access any our API. Now you first thing you have to do is create a contact in our system as soon as user signup in your platform using this API (https://bit.ly/3LRehug). This will give you unique contact_id of that user. You require this id when you schedule a meeting below.
6. Later go to Schedule Meeting API -> Pass all the parameters needed to generate a new meetings - (https://bit.ly/3riFLkx)
7. Once the meeting is genereate, in order to join a meeting you require to Generate JWT Token using this API (https://bit.ly/3ur5pFR) and pass it to the conference URL via MT Parameter - https://meethour.io?mt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSlNVekkxTmlKOS5leUpoZFdRaU9pSTVNemxrWmpVeE5pMDJNekEzTFRRNVkyUXRPVGMxTXkwek1XRTNNemRrT1RGaE1HWWlMQ0pxZEdraU9pSmtNMlUyT


## For iOS - Pod Update

Always run below command if you want to get latest MeetHourSDK Pod file.

```
pod update MeetHourSDK
pod update MeetHourSDK or pod install --repo-update
```

```
For Apple M1 Silicon Chip
arch -x86_64 pod update MeetHourSDK or arch -x86_64 pod install --repo-update
```

## Table of Contents
  - [Configuration](#configuration)
    - [IOS](#ios)
      - [Podfile](#podfile)
      - [Info.plist](#infoplist)
    - [Android](#android)
      - [Gradle](#gradle)
      - [AndroidManifest.xml](#androidmanifestxml)
      - [Minimum SDK Version 23](#minimum-sdk-version-23)
      - [Proguard](#proguard)
  - [Join A Meeting](#join-a-meeting)
    - [MeetHourMeetingOptions](#meetHourMeetingoptions)
    - [FeatureFlag](#featureflag)
    - [MeetHourMeetingResponse](#meetHourMeetingresponse)
  - [Listening to Meeting Events](#listening-to-meeting-events)
    - [Per Meeting Events](#per-meeting-events)
    - [Global Meeting Events](#global-meeting-events)
  - [Closing a Meeting Programmatically](#closing-a-meeting-programmatically)

<a name="configuration"></a>
## Configuration

<a name="ios"></a>
### IOS
* Note: Example compilable with XCode 12.2 & Flutter 1.22.4.

#### Podfile
Ensure in your Podfile you have an entry like below declaring platform of 11.0 or above and disable BITCODE.
```
platform :ios, '12.1'

...

post_install do |installer|
  installer.pods_project.targets.each do |target|
  flutter_additional_ios_build_settings(target)
      target.build_configurations.each do |config|
        config.build_settings['ENABLE_BITCODE'] = 'NO'
        config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
         end
     end
   end
```

#### Info.plist
Add NSCameraUsageDescription and NSMicrophoneUsageDescription to your
Info.plist.

```text
<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) MyApp needs access to your camera for meetings.</string>
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) MyApp needs access to your microphone for meetings.</string>
```

<a name="android"></a>
### Android

#### Gradle
Set dependencies of build tools gradle to minimum 3.6.3:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:3.6.3' <!-- Upgrade this -->
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
}
```

Set distribution gradle wrapper to minimum 5.6.4.
```gradle
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-5.6.4-all.zip <!-- Upgrade this -->
```

#### AndroidManifest.xml
Meet Hour's SDK AndroidManifest.xml will conflict with your project, namely 
the application:label field. To counter that, go into 
`android/app/src/main/AndroidManifest.xml` and add the tools library
and `tools:replace="android:label"` to the application tag.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="yourpackage.com"
    xmlns:tools="http://schemas.android.com/tools"> <!-- Add this -->
    <application 
        tools:replace="android:label"  
        android:name="your.application.name"
        android:label="My Application"
        android:icon="@mipmap/ic_launcher">
        ...
    </application>
...
</manifest>
```

#### Minimum SDK Version 23
Update your minimum sdk version to 23 in android/app/build.gradle
```groovy
defaultConfig {
    applicationId "go.meethour.io.flutter.sdk_example"
    minSdkVersion 23 //Required for MeetHour
    targetSdkVersion 28
    versionCode flutterVersionCode.toInteger()
    versionName flutterVersionName
}
```

#### Proguard

MeetHour's SDK enables proguard, but without a proguard-rules.pro file, your release 
apk build will be missing the Flutter Wrapper as well as react-native code. 
In your Flutter project's android/app/build.gradle file, add proguard support

```groovy
buildTypes {
    release {
        // TODO: Add your own signing config for the release build.
        // Signing with the debug keys for now, so `flutter run --release` works.
        signingConfig signingConfigs.debug
        
        // Add below 3 lines for proguard
        minifyEnabled true
        useProguard true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

Then add a file in the same directory called proguard-rules.pro. See the example 
app's [proguard-rules.pro](example/android/app/proguard-rules.pro) file to know what to paste in.

*Note*  
If you do not create the proguard-rules.pro file, then your app will 
crash when you try to join a meeting or the meeting screen tries to open
but closes immediately. You will see one of the below errors in logcat.

```
## App crashes ##
java.lang.RuntimeException: Parcel android.os.Parcel@8530c57: Unmarshalling unknown type code 7536745 at offset 104
    at android.os.Parcel.readValue(Parcel.java:2747)
    at android.os.Parcel.readSparseArrayInternal(Parcel.java:3118)
    at android.os.Parcel.readSparseArray(Parcel.java:2351)
    .....
```

```
## Meeting won't open and you go to previous screen ##
W/unknown:ViewManagerPropertyUpdater: Could not find generated setter for class com.BV.LinearGradient.LinearGradientManager
W/unknown:ViewManagerPropertyUpdater: Could not find generated setter for class com.facebook.react.uimanager.g
W/unknown:ViewManagerPropertyUpdater: Could not find generated setter for class com.facebook.react.views.art.ARTGroupViewManager
W/unknown:ViewManagerPropertyUpdater: Could not find generated setter for class com.facebook.react.views.art.a
.....
```

<a name="join-a-meeting"></a>

## Join A Meeting

```dart
_joinMeeting() async {
    try {
	  FeatureFlag featureFlag = FeatureFlag();
	  featureFlag.welcomePageEnabled = false;
	  featureFlag.resolution = FeatureFlagVideoResolution.MD_RESOLUTION; // Limit video resolution to 360p
	  
      var options = MeetHourMeetingOptions()
        ..room = "TestRoom" // Required, spaces will be trimmed
        ..serverURL = "https://meethour.io"
        ..subject = "Meeting with John"
        ..userDisplayName = "John Delise"
        ..userEmail = "john@gmail.com"
        ..userAvatarURL = "https://someimageurl.com/image.jpg" // or .png
        ..audioOnly = true
        ..audioMuted = true
        ..videoMuted = true
        ..featureFlag = featureFlag;

      await MeetHour.joinMeeting(options);
    } catch (error) {
      debugPrint("error: $error");
    }
  }
```

<a name="meetHourMeetingoptions"></a>

### MeetHourMeetingOptions

| Field             | Required  | Default           | Description |
 ------------------ | --------- | ----------------- | ----------- |
| room              | Yes       | N/A               | Unique room name that will be appended to serverURL. Valid characters: alphanumeric, dashes, and underscores. |
| subject           | No        | $room             | Meeting name displayed at the top of the meeting.  If null, defaults to room name where dashes and underscores are replaced with spaces and first characters are capitalized. |
| userDisplayName   | No        | "Guest"  | User's display name. |
| userEmail         | No        | none              | User's email address. |
| audioOnly         | No        | false             | Start meeting without video. Can be turned on in meeting. |
| audioMuted        | No        | false             | Start meeting with audio muted. Can be turned on in meeting. |
| videoMuted        | No        | false             | Start meeting with video muted. Can be turned on in meeting. |
| serverURL         | No        | meethour.io     | Specify your own hosted server. Must be a valid absolute URL of the format `<scheme>://<host>[/path]`, i.e. https://someHost.com. Defaults to Meet Hour's servers. |
| userAvatarURL     | N/A       | none              | User's avatar URL. |
| token             | N/A       | none              | JWT token used for authentication. |
| featureFlag      | No        | see below         | Object of FeatureFlag class used to enable/disable features and set video resolution of Meet Hour SDK. |

<a name="meetHourMeetingresponse"></a>

### FeatureFlag

Feature flag allows you to limit video resolution and enable/disable few features of Meet Hour SDK mentioned in the list below.  
If you don't provide any flag to MeetHourMeetingOptions, default values will be used.  

| Flag | Default (Android) | Default (iOS) | Description |
| ------------------------------ | ----- | ----- | ----------- |
| `addPeopleEnabled`          | true  | true  | Enable the blue button "Add people", show up when you are alone in a call. Required for flag `inviteEnabled` to work. |
| `calendarEnabled`            | true  | auto  | Enable calendar integration. |
| `callIntegrationEnabled`    | true  | true  | Enable call integration (CallKit on iOS, ConnectionService on Android). **SEE REMARK BELOW** |
| `closeCaptionsEnabled`      | true  | true  | Enable close captions (subtitles) option in menu. |
| `conferenceTimerEnabled`                | true  | true  | Enable conference timer. |
| `chatEnabled`                | true  | true  | Enable chat (button and feature). |
| `inviteEnabled`              | true  | true  | Enable invite option in menu. |
| `iOSRecordingEnabled`       | N/A   | false | Enable recording in iOS. |
| `kickOutEnabled`       | true   | true | Enable kick-out option in video thumb of participants. |
| `liveStreamingEnabled`      | auto  | auto  | Enable live-streaming option in menu. |
| `meetingNameEnabled`        | true  | true  | Display meeting name. |
| `meetingPasswordEnabled`    | true  | true  | Display meeting password option in menu (if a meeting has a password set, the dialog will still show up). |
| `pipEnabled`                 | auto  | auto  | Enable Picture-in-Picture mode. |
| `raiseHandEnabled`          | true  | true  | Enable raise hand option in menu. |
| `recordingEnabled`           | auto  | N/A   | Enable recording option in menu. |
| `resoulution`           | N/A  | N/A  | Set local and (maximum) remote video resolution. Overrides server configuration. Accepted values are: LD_RESOLUTION for 180p, MD_RESOLUTION for 360p, SD_RESOLUTION for 480p(SD), HD_RESOLUTION for 720p(HD) . |
| `serverURLChangeEnabled`           | true  | true  | Enable server URL change. |
| `tileViewEnabled`           | true  | true  | Enable tile view option in menu. |
| `toolboxAlwaysVisible`      | true  | true  | Toolbox (buttons and menus) always visible during call (if not, a single tap displays it). |
| `videoShareButtonEnabled`      | true  | true  | Enable video share button. |
| `welcomePageEnabled`        | false | false | Enable welcome page. "The welcome page lists recent meetings and calendar appointments and it's meant to be used by standalone applications." |

### MeetHourMeetingResponse

| Field           | Type    | Description |
| --------------- | ------- | ----------- |
| isSuccess       | bool    | Success indicator. |
| message         | String  | Success message or error as a String. |
| error           | dynamic | Optional, only exists if isSuccess is false. The error object. |

<a name="listening-to-meeting-events"></a>

## Listening to Meeting Events

Events supported

| Name                   | Description  |
| :--------------------- | :----------- |
| onConferenceWillJoin   | Meeting is loading. |
| onConferenceJoined     | User has joined meeting. |
| onConferenceTerminated | User has exited the conference. |
| onPictureInPictureWillEnter | User entered PIP mode. |
| onPictureInPictureTerminated | User exited PIP mode. |
| onError                | Error has occurred with listening to meeting events. |

### Per Meeting Events
To listen to meeting events per meeting, pass in a MeetHourMeetingListener
in joinMeeting. The listener will automatically be removed when an  
onConferenceTerminated event is fired.

```
await MeetHour.joinMeeting(options,
  listener: MeetHourMeetingListener(onConferenceWillJoin: ({message}) {
    debugPrint("${options.room} will join with message: $message");
  }, onConferenceJoined: ({message}) {
    debugPrint("${options.room} joined with message: $message");
  }, onConferenceTerminated: ({message}) {
    debugPrint("${options.room} terminated with message: $message");
  }, onPictureInPictureWillEnter: ({message}) {
	debugPrint("${options.room} entered PIP mode with message: $message");
  }, onPictureInPictureTerminated: ({message}) {
	debugPrint("${options.room} exited PIP mode with message: $message");
  }));
```

### Global Meeting Events
To listen to global meeting events, simply add a MeetHourListener with  
`MeetHour.addListener(myListener)`. You can remove listeners using  
`MeetHour.removeListener(listener)` or `MeetHour.removeAllListeners()`.

```dart
@override
void initState() {
  super.initState();
  MeetHour.addListener(MeetHourMeetingListener(
    onConferenceWillJoin: _onConferenceWillJoin,
    onConferenceJoined: _onConferenceJoined,
    onConferenceTerminated: _onConferenceTerminated,
    onPictureInPictureWillEnter: _onPictureInPictureWillEnter,
    onPictureInPictureTerminated: _onPictureInPictureTerminated,
    onError: _onError));
}

@override
void dispose() {
  super.dispose();
  MeetHour.removeAllListeners();
}

_onConferenceWillJoin({message}) {
  debugPrint("_onConferenceWillJoin broadcasted");
}

_onConferenceJoined({message}) {
  debugPrint("_onConferenceJoined broadcasted");
}

_onConferenceTerminated({message}) {
  debugPrint("_onConferenceTerminated broadcasted");
}

_onPictureInPictureWillEnter({message}) {
debugPrint("_onPictureInPictureWillEnter broadcasted with message: $message");
}

_onPictureInPictureTerminated({message}) {
debugPrint("_onPictureInPictureTerminated broadcasted with message: $message");
}

_onError(error) {
  debugPrint("_onError broadcasted");
}
```

## Closing a Meeting Programmatically
```dart
MeetHour.closeMeeting();
```

<a name="contributing"></a>

## Contributing
Send a pull request with as much information as possible clearly
describing the issue or feature. Keep changes small and for one issue at
a time.
