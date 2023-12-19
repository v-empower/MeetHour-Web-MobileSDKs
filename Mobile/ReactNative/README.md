# React Native Meet Hour SDK - Example.

Meet Hour Example project for React Native with APIs

[Meet Hour - 100% free video conference solution](https://meethour.io)
Meet Hour is 100% free video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc.

### NPM package (Latest version - 3.0.24)

```
https://www.npmjs.com/package/react-native-meet-hour-sdk

```
### Support for 0.72.4 version as well.

Example Project is here - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/ReactNative

### Steps to Use Meet Hour React Native SDK Example

1. Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Go to the dashboard and then click on developers menu.
3. Copy your Client ID, Client Secret and Api Key. After copying, paste each copied text to the respective constant in the source code src/constants/index.js
4. On Home page Click on Get Access Token
5. Then Try Schedule a Meeting & Join Meeting.

## Run Program

```
cd Mobile/ReactNative/MeetHourSDKTest

npm install

npm start

npm run android

npm run ios

```

![](screenshot.png)


### API End Points Supported

1. To Get Access Token Endpoint : => https://docs.v-empower.com/docs/MeetHour-API/a44a7d7669f91-user-login-get-access-token

   ```
       ApiServices.login({
               grant_type, client_id, client_secret, username, password
           });
   ```

   => You have to pass respective values in the argument section. Hence, to get desired response.

2. To schedule a meeting: => https://docs.v-empower.com/docs/MeetHour-API/2de4b757a6312-meeting-schedule-meeting

   ```
       ApiServices. scheduleMeeting(token: string, body: ScheduleMeetingType)

           type ScheduleMeetingType {
                   agenda?: string;
                   attend?:
                       | Array<number>
                       | Array<UserObjectType>
                       | Array<UserObjectType | number>;
                   default_recording_storage?: string;
                   duration_hr?: number;
                   duration_min?: number;
                   enable_pre_registration?: number;
                   endBy?: string;
                   end_date_time?: string;
                   end_times?: number;
                   groups?: Array<number | string>;
                   hostusers?:
                       | Array<number>
                       | Array<UserObjectType>
                       | Array<UserObjectType | number>;
                   instructions?: string;
                   is_recurring?: number;
                   is_show_portal?: number;
                   meeting_agenda?: string;
                   meeting_date: string;
                   meeting_meridiem: string;
                   meeting_name: string;
                   meeting_time: string;
                   meeting_topic?: string;
                   monthlyBy?: string;
                   monthlyByDay?: string;
                   monthlyByWeekday?: string;
                   monthlyByWeekdayIndex?: string;
                   options?: Array<string>;
                   passcode: string;
                   recurring_type?: string;
                   repeat_interval?: number;
                   send_calendar_invite?: number;
                   timezone: string;
                   weeklyWeekDays?: number;
               };


       type UserObjectType {
               email?: string;
               first_name?: string;
               last_name?: string;
           }
   ```

3. To Generate JWT Token Endpoint => https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt

   ```
       ApiServices.generateJwt(token: string, body: GenerateJwtType)

      type GenerateJwtType {
               config?: {
               disableDeepLinking?: string;
               dropboxappKey?: string;
               dropboxredirectURI?: string;
               enableClosePage?: string;
               enableWelcomePage?: string;
               fileRecordingsEnabled?: boolean;
               liveStreamingEnabled?: boolean;
               p2penabled?: boolean;
               requireDisplayName?: string;
               resolution?: number;
               startAudioMuted?: number;
               videoheightideal?: number;
               videoheightmax?: number;
               videoheightmin?: number;
               videowidthideal?: number;
               videowidthmax?: number;
               videowidthmin?: number;
               };
               contact_id?: number;
               meeting_id: string;
               ui_config?: {
               ANDROID_APP_PACKAGE?: string;
               APP_NAME?: string;
               APP_SCHEME?: string;
               BRAND_WATERMARK_BACKGROUND?: string;
               DEFAULT_LOGO_URL?: string;
               ENABLE_MOBILE_BROWSER?: string;
               HIDE_DEEP_LINKING_LOGO?: string;
               MEET_HOUR_WATERMARK_LINK?: string;
               MOBILE_APP_PROMO?: string;
               MOBILE_DOWNLOAD_LINK_ANDROID?: string;
               MOBILE_DOWNLOAD_LINK_IOS?: string;
               NATIVE_APP_NAME?: string;
               PROVIDER_NAME?: string;
               SHOW_MEET_HOUR_WATERMARK?: string;
               disablePrejoinFooter?: string;
               disablePrejoinHeader?: string;
               toolbar_buttons?: Array<string>;
               };
           };
   ```

4. To fetch User Details: => https://docs.v-empower.com/docs/MeetHour-API/ff9d0e37d9191-user-details

   ```
       ApiServices.userDetails(token: string)
   ```

5. To fetch access Token using Refresh Token: => https://docs.v-empower.com/docs/MeetHour-API/d851be1af9804-get-access-token-using-refresh-token

   ```
       ApiServices.getRefreshToken(token: string, body: RefreshTokenType)

       type RefreshTokenType {
               client_id: string;
               client_secret: string;
               grant_type: string;
               refresh_token: string;
       }
   ```

6. To add a contact in Meet Hour database: => https://docs.v-empower.com/docs/MeetHour-API/bd1e416413e8c-add-contact

   ```
       ApiServices.addContact(token: string, body: AddContactType)

       type AddContactType {
               country_code?: string;
               email: string;
               firstname: string;
               image?: string;
               is_show_portal?: boolean;
               lastname?: string;
               phone?: string;
           }
   ```

7. To get Timezones of various countries: => https://docs.v-empower.com/docs/MeetHour-API/c688c29bce9b9-timezone-list

   ```
       ApiServices.timezone(token: string)

   ```

8. To get list of all the contacts in your Meet Hour account: => https://api.meethour.io/api/{version}/customer/contacts

   ```
       ApiServices.contactsList(token: string, body: ContactsType)

       type ContactsType {
               exclude_hosts: number;
               limit: number;
               page: number;
           }

   ```

9. To make changes in the existing contact details: => https://docs.v-empower.com/docs/MeetHour-API/28cae9187d215-edit-contact

   ````
    ApiServices.editContact(token: string, body: EditContactType)

    type EditContactType {
            contact_id: number;
            country_code: string;
            email: string;
            firstname: string;
            image: string;
            is_show_portal: boolean;
            lastname: string;
            phone: string;
        }

    ```

   ````

10. To get Upcoming Meetings: => https://docs.v-empower.com/docs/MeetHour-API/31df88388416d-upcoming-meetings

    ```
        ApiServices.upcomingMeetings(token: string, body: {
            limit: number;
            page: number;
        })
    ```

11. To archive a meeting: => https://docs.v-empower.com/docs/MeetHour-API/1dd64523cc6bf-archive-meeting

    ```
        ApiServices.archiveMeeting(
                token: string,
                body: {
                    id?: number;
            })
    ```

12. To get the details of a missed meeting: => https://docs.v-empower.com/docs/MeetHour-API/92998e2dda102-missed-meetings

    ```
        ApiServices.missedMeetings(
            token: string,
            body: {
                limit: number;
                page: number;
            })
    ```

13. To get completed meetings: => https://docs.v-empower.com/docs/MeetHour-API/aa9ef6a678250-completed-meetings

    ```
        ApiServices.completedMeetings(
            token: string,
            body: {
            limit: number;
            page: number;
            })
    ```

14. To edit an existing meeting: => https://docs.v-empower.com/docs/MeetHour-API/5dedde36380b4-meeting-edit-meeting

    ```
        ApiServices.editMeeting(token: string, body: EditMeetingType)

        type EditMeeting {
            agenda?: string;
            attend?:
                | Array<number>
                | Array<UserObjectType>
                | Array<number & UserObjectType>;
            duration_hr?: number;
            duration_min?: number;
            enable_pre_registration?: number;
            endBy?: string;
            end_date_time?: string;
            groups?: Array<number>;
            hostusers?:
                | Array<number>
                | Array<UserObjectType>
                | Array<number & UserObjectType>;
            instructions?: string;
            is_recurring?: number;
            is_show_portal?: number;
            meeting_agenda?: string;
            meeting_date?: string;
            meeting_id: string;
            meeting_meridiem?: string;
            meeting_name?: string;
            meeting_time?: string;
            meeting_topic?: string;
            old_attend?:
                | Array<number>
                | Array<UserObjectType>
                | Array<number & UserObjectType>;
            options?: Array<string>;
            passcode?: string;
            recurring_type?: string;
            repeat_interval?: number;
            timezone?: string;
        }

        type UserObjectType {
            email?: string;
            first_name?: string;
            last_name?: string;
        }
    ```

15. To view a meeting: => https://docs.v-empower.com/docs/MeetHour-API/7e9a0a1e0da7f-meeting-view-meeting

    ```
        ApiServices.viewMeeting(
            token: string,
            body: { meeting_id: string }
            )
    ```

16. To get all the recordings list: => https://docs.v-empower.com/docs/MeetHour-API/ce7c4fd8cae7e-recording-list

    ```
        ApiServices.recordingsList(token: string, body: RecordingsList)

        type RecordingsList {
            filter_by: string;
            limit: number;
            page: number;
        }
    ```

## Usage

In this SDK, you can make APIs calls and allow join the conference in Native View or React Native View.

```jsx
import MeetHour, {MeetHourView, ApiServices} from 'react-native-meet-hour-sdk';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
  Alert
} from 'react-native';

const loginBody = {
  client_id: '',
  client_secret: '',
  username: '',
  password: '',
};

const ScheduleBody = {
  meeting_name: 'Quick Meeting',
  agenda: '',
  passcode: '123456',
  meeting_date: '23-02-2025', // Make sure you give a future date for this parameter
  meeting_time: '11:30',
  meeting_meridiem: 'AM',
  timezone: 'Asia/Kolkata',
  instructions: 'Team call',
  is_show_portal: 0,
  options: ['ALLOW_GUEST', 'JOIN_ANYTIME'],
  // attend: [] // Pass the values as per documentation.
  // hostusers: []
};

let getJWTBody = {
  meeting_id: '',
};

const conferenceOptions = {
  room: '',
  token: '', // JWT Token
  pcode: '', //Dynamic Password of Conference. Will get from Schedule API & ViewMeeting APIs
  audioMuted: false,
  videoMuted: false,
  prejoinPageEnabled: true, // Make it false to Skip PrejoinPage
  disableInviteFunctions: true, // To disable invite functions in Mobile SDK.
};

function App() {
  const [showMeetHourView, setShowMeetHourView] = useState(false);

  useEffect(() => {
    if (conferenceOptions.room !== '') {
      if (Platform.OS === 'android') {
        startMeetHourAsNativeController(); // Recommeneded to use for Android if you require Screen Sharing functionality.
      } else {
        setShowMeetHourView(true);
      }
    }
  }, [conferenceOptions.token]);

  const Apicalls = async () => {
    try {
      let loginResponse = await ApiServices.login(loginBody);
      let scheduleResponse = await ApiServices.scheduleMeeting(
        loginResponse.access_token,
        ScheduleBody,
      );

      conferenceOptions.room = scheduleResponse.data?.meeting_id;

      getJWTBody.meeting_id = scheduleResponse.data?.meeting_id;

      conferenceOptions.pcode = scheduleResponse.data?.pcode;

      let generateJWTResponse = await ApiServices.generateJwt(
        loginResponse.access_token,
        getJWTBody,
      );

      conferenceOptions.token = generateJWTResponse.jwt;
    } catch (error) {
      console.log(error);
      Alert.alert("Credentials Error", "API calls failing. Please add Client ID and Client Secret"+error);
    }
  };

  Apicalls();

  const startMeetHourAsNativeController = async () => {
    /* 
      Mode 1 - Use this mode for Android when you require screen sharing functionality.
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
    /* Mode 2 - Starts MeetHour as a React Native View */

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
        style={({pressed}) => [styles.pressable, {opacity: pressed ? 0.5 : 1}]}>
        <Text style={styles.pressableText}>
          Start MeetHour on top of RN Application
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowMeetHourView(true)}
        style={({pressed}) => [styles.pressable, {opacity: pressed ? 0.5 : 1}]}>
        <Text style={styles.pressableText}>Start MeetHour as a React Native View</Text>
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
    backgroundColor: '#4f6790',
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
        buildToolsVersion = "33.0.1"
        minSdkVersion = 24 // <-- this line
        compileSdkVersion = 33
        targetSdkVersion = 33
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

| key           | Data type | Default             | Description                                                                                                     |
| ------------ | --------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| room         | string    | required            | Room name for Meet Hour                                                                                        |
| serverUrl    | string    | https://meethour.io | Valid server URL                                                                                                |
| token        | string    | ""                  | JWT token  
| pcode        | string    | ""                  | Password of meeting to be passed dynamically                                                                    |
| subject      | string    | ""                  | Conference subject (will change the global subject for all participants)                                        |
| audioOnly    | boolean   | false               | Controls whether the participant will join the conference in audio-only mode (no video is sent or recieved)     |
| audioMuted   | boolean   | false               | Controls whether the participant will join the conference with the microphone muted                             |
| videoMuted   | boolean   | false               | Controls whether the participant will join the conference with the camera muted                                 |
| prejoinPageEnabled   | boolean   | true        |  Make it true to Skip PrejoinPage  
| disableInviteFunctions | boolean   | true      |  To disable invite functions in Mobile SDK 
| userInfo     | object    | {}                  | Object that contains information about the participant starting the meeting. See [UserInfo](#userinfo)          |
| featureFlags | object    | {}                  | Object that contains information about which feature flags should be set. See below for more info.              |

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
//     exclude group: 'com.facebook.react', module:'react-native-gesture-handler'
//     exclude group: 'com.facebook.react',module:'react-native-fetch-blob'
//     exclude group: 'com.facebook.react',module:'react-native-webview'
//     exclude group: 'com.facebook.react',module:'react-native-linear-gradient'
//     exclude group: 'com.facebook.react',module:'react-native-sound'
//     exclude group: 'com.facebook.react',module:'react-native-add-calendar-event'
}
```


If you are having problems -> Suggestion: add 'tools:replace="android:exported"' to <provider> element at AndroidManifest.xml to override.

Please add the below code in manifest.xml

```
    <provider
        android:name="com.reactnativecommunity.webview.RNCWebViewFileProvider"
        android:authorities="${applicationId}.fileprovider"
        android:enabled="false"
        android:exported="true"
        tools:replace="android:authorities,android:exported">
    </provider>
```

