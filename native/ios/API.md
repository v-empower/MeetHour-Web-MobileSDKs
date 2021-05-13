---
id: dev-guide-ios-sdk
title: Meet Hour iOS SDK API
---

## API

MeetHour is an iOS framework which embodies the whole Meet Hour experience and
makes it reusable by third-party apps.

To get started:

1. Add a `MeetHourView` to your app using a Storyboard or Interface Builder,
   for example.

2. Then, once the view has loaded, set the delegate in your controller and load
   the desired URL:

```objc
- (void)viewDidLoad {
  [super viewDidLoad];

  MeetHourView *MH = (MeetHourView *) self.view;
  MH.delegate = self;

  MeetHourConferenceOptions *options = [MeetHourConferenceOptions fromBuilder:^(MeetHourConferenceOptionsBuilder *builder) {
      builder.serverURL = [NSURL URLWithString:@"https://meethour.io"];
      builder.room = @"test123";
      builder.audioOnly = YES;
  }];

  [MH join:options];
}
```

### MeetHourView class

The `MeetHourView` class is the entry point to the SDK. It a subclass of
`UIView` which renders a full conference in the designated area.

#### delegate

Property to get/set the `MeetHourViewDelegate` on `MeetHourView`.

#### join:MeetHourConferenceOptions

Joins the conference specified by the given options.

```objc
  MeetHourConferenceOptions *options = [MeetHourConferenceOptions fromBuilder:^(MeetHourConferenceOptionsBuilder *builder) {
      builder.serverURL = [NSURL URLWithString:@"https://meethour.io"];
      builder.room = @"test123";
      builder.audioOnly = NO;
      builder.audioMuted = NO;
      builder.videoMuted = NO;
      builder.welcomePageEnabled = NO;
  }];

  [MH join:options];
```

#### leave

Leaves the currently active conference.

#### hangUp

The localParticipant leaves the current conference.

#### setAudioMuted

Sets the state of the localParticipant audio muted according to the `muted` parameter.

#### sendEndpointTextMessage

Sends a message via the data channel to one particular participant or to all of them.
If the `to` param is empty, the message will be sent to all the participants in the conference.

In order to get the participantId, the `PARTICIPANT_JOINED` event should be listened for,
which `data` includes the id and this should be stored somehow.

#### Universal / deep linking

In order to support Universal / deep linking, `MeetHour` offers 2 class
methods that you app's delegate should call in order for the app to follow those
links.

If these functions return NO it means the URL wasn't handled by the SDK. This
is useful when the host application uses other SDKs which also use linking.

```objc
-  (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler
{
  return [[MeetHour sharedInstance] application:application
               continueUserActivity:userActivity
                 restorationHandler:restorationHandler];
}
```

And also one of the following:

```objc
// See https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623073-application?language=objc
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [[MeetHour sharedInstance] application:app
                            openURL:url
                            options: options];
}
```

### MeetHourViewDelegate

This delegate is optional, and can be set on the `MeetHourView` instance using
the `delegate` property.

It provides information about the conference state: was it joined, left, did it
fail?

All methods in this delegate are optional.

#### conferenceJoined

Called when a conference was joined.

The `data` dictionary contains a "url" key with the conference URL.

#### conferenceTerminated

Called when a conference was terminated either by user choice or due to a
failure.

The `data` dictionary contains an "error" key with the error and a "url" key
with the conference URL. If the conference finished gracefully no `error`
key will be present.

#### conferenceWillJoin

Called before a conference is joined.

The `data` dictionary contains a "url" key with the conference URL.

#### enterPictureInPicture

Called when entering Picture-in-Picture is requested by the user. The app should
now activate its Picture-in-Picture implementation (and resize the associated
`MeetHourView`. The latter will automatically detect its new size and adjust
its user interface to a variant appropriate for the small size ordinarily
associated with Picture-in-Picture.)

The `data` dictionary is empty.

#### participantJoined

Called when a participant has joined the conference.

The `data` dictionary contains information of the participant that has joined.
Depending of whether the participant is the local one or not, some of them are 
present/missing.
    isLocal
    email
    name
    participantId

#### participantLeft

Called when a participant has left the conference.

The `data` dictionary contains information of the participant that has left.
Depending of whether the participant is the local one or not, some of them are 
present/missing.
    isLocal
    email
    name
    participantId

#### audioMutedChanged

Called when audioMuted state changed.

The `data` dictionary contains a `muted` key with state of the audioMuted for the localParticipant.

#### endpointTextMessageReceived

Called when an endpoint text message is received.

The `data` dictionary contains a `senderId` key with the participantId of the sender and a `message` key with the content.

### Picture-in-Picture

`MeetHourView` will automatically adjust its UI when presented in a
Picture-in-Picture style scenario, in a rectangle too small to accommodate its
"full" UI.

Meet Hour SDK does not currently implement native Picture-in-Picture on iOS. If
desired, apps need to implement non-native Picture-in-Picture themselves and
resize `MeetHourView`.

If `delegate` implements `enterPictureInPicture:`, the in-call toolbar will
render a button to afford the user to request entering Picture-in-Picture.

## Dropbox integration

To setup the Dropbox integration, follow these steps:

1. Add the following to the app's Info.plist and change `<APP_KEY>` to your
Dropbox app key:
```
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string></string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>db-<APP_KEY></string>
    </array>
  </dict>
</array>
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>dbapi-2</string>
  <string>dbapi-8-emm</string>
</array>
```

2. Make sure your app calls the Meet Hour SDK universal / deep linking delegate methods.