---
id: dev-guide-ios-sdk
title: Meet Hour iOS SDK API
---

## Using the API

Meet Hour SDK is an Android library which embodies the whole Meet Hour
experience and makes it reusable by third-party apps.

First, add Java 1.8 compatibility support to your project by adding the
following lines into your `build.gradle` file:

```
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```

To get started, extends your `android.app.Activity` from
`go.meethour.io.MeetHourSDK.android.MeetHourActivity`:

```java
package go.meethour.io.android.sdk.example;

import go.meethour.io.MeetHourSDK.android.MeetHourActivity;

public class MainActivity extends MeetHourActivity {
}
```

Alternatively, you can use the `go.meethour.io.MeetHourSDK.android.MeetHourView` class which
extends `android.view.View`.

Note that this should only be needed when `MeetHourActivity` cannot be used for
some reason. Extending `MeetHourView` requires manual wiring of the view to
the activity, using a lot of boilerplate code. Using the Activity instead of the
View is strongly recommended.

<details>
<summary>Show example</summary>

```java
package go.meethour.io.android.sdk.example;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

import go.meethour.io.MeetHourSDK.android.MeetHourView;
import go.meethour.io.MeetHourSDK.android.ReactActivityLifecycleCallbacks;

// Example
//
public class MainActivity extends FragmentActivity implements MeetHourActivityInterface {
    private MeetHourView view;

    @Override
    protected void onActivityResult(
            int requestCode,
            int resultCode,
            Intent data) {
        MeetHourActivityDelegate.onActivityResult(
                this, requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        MeetHourActivityDelegate.onBackPressed();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        view = new MeetHourView(this);
        MeetHourConferenceOptions options = new MeetHourConferenceOptions.Builder()
            .setRoom("https://meethour.io/sdktest123")
            .build();
        view.join(options);

        setContentView(view);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        view.dispose();
        view = null;

        MeetHourActivityDelegate.onHostDestroy(this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        MeetHourActivityDelegate.onNewIntent(intent);
    }

    @Override
    public void onRequestPermissionsResult(
            final int requestCode,
            final String[] permissions,
            final int[] grantResults) {
        MeetHourActivityDelegate.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    protected void onResume() {
        super.onResume();

        MeetHourActivityDelegate.onHostResume(this);
    }

    @Override
    protected void onStop() {
        super.onStop();

        MeetHourActivityDelegate.onHostPause(this);
    }
}
```

</details>

### MeetHourActivity

This class encapsulates a high level API in the form of an Android `FragmentActivity`
which displays a single `MeetHourView`. You can pass a URL as a `ACTION_VIEW`
on the Intent when starting it and it will join the conference, and will be
automatically terminated (finish() will be called on the activity) when the
conference ends or fails.

### MeetHourView

The `MeetHourView` class is the core of Meet Hour SDK. It's designed to
display a Meet Hour conference (or a welcome page).

#### join(options)

Joins the conference specified by the given `MeetHourConferenceOptions`.

#### leave()

Leaves the currently active conference. If the welcome page is enabled it will
go back to it, otherwise a black window will be shown.

#### dispose()

Releases all resources associated with this view. This method MUST be called
when the Activity holding this view is going to be destroyed, usually in the
`onDestroy()` method.

#### getListener()

Returns the `MeetHourViewListener` instance attached to the view.

#### setListener(listener)

Sets the given listener (class implementing the `MeetHourViewListener`
interface) on the view.

### MeetHourConferenceOptions

This object encapsulates all the options that can be tweaked when joining
a conference.

Example:

```java
MeetHourConferenceOptions options = new MeetHourConferenceOptions.Builder()
    .setServerURL(new URL("https://meethour.io"))
    .setRoom("test123")
    .setAudioMuted(false)
    .setVideoMuted(false)
    .setAudioOnly(false)
    .setWelcomePageEnabled(false)
    .build();
```

See the `MeetHourConferenceOptions` implementation for all available options.

### MeetHourActivityDelegate

This class handles the interaction between `MeetHourView` and its enclosing
`Activity`. Generally this shouldn't be consumed by users, because they'd be
using `MeetHourActivity` instead, which is already completely integrated.

All its methods are static.

#### onActivityResult(...)

Helper method to handle results of auxiliary activities launched by the SDK.
Should be called from the activity method of the same name.

#### onBackPressed()

Helper method which should be called from the activity's `onBackPressed` method.
If this function returns `true`, it means the action was handled and thus no
extra processing is required; otherwise the app should call the parent's
`onBackPressed` method.

#### onHostDestroy(...)

Helper method which should be called from the activity's `onDestroy` method.

#### onHostResume(...)

Helper method which should be called from the activity's `onResume` or `onStop`
method.

#### onHostStop(...)

Helper method which should be called from the activity's `onSstop` method.

#### onNewIntent(...)

Helper method for integrating the *deep linking* functionality. If your app's
activity is launched in "singleTask" mode this method should be called from the
activity's `onNewIntent` method.

#### onRequestPermissionsResult(...)

Helper method to handle permission requests inside the SDK. It should be called
from the activity method of the same name.

#### onUserLeaveHint()

Helper method for integrating automatic Picture-in-Picture. It should be called
from the activity's `onUserLeaveHint` method.

This is a static method.

#### MeetHourViewListener (deprecated - use Listening for broadcasted events instead)

`MeetHourViewListener` provides an interface apps can implement to listen to
the state of the Meet Hour conference displayed in a `MeetHourView`.

#### onConferenceJoined

Called when a conference was joined.

The `data` `Map` contains a "url" key with the conference URL.

#### onConferenceTerminated

Called when a conference was terminated either by user choice or due to a
failure.

The `data` `Map` contains an "error" key with the error and a "url" key
with the conference URL. If the conference finished gracefully no `error`
key will be present.

#### onConferenceWillJoin

Called before a conference is joined.

The `data` `Map` contains a "url" key with the conference URL.

### Listening for broadcasted events
The SDK broadcasts several events that the users can listen for.

```java
    IntentFilter intentFilter = new IntentFilter();
    intentFilter.addAction(BroadcastEvent.Type.CONFERENCE_JOINED.getAction());
    LocalBroadcastManager.getInstance(this).registerReceiver(broadcastReceiver, intentFilter);
 ```  
        
Please see `MeetHourActivity`, which registers for all the events and can serve as an example.

#### Supported events

##### CONFERENCE_JOINED
Broadcasted when a conference was joined.
The `data` HashMap contains a `url` key with the conference URL.

##### CONFERENCE_TERMINATED
Broadcasted when the active conference ends, be it because of user choice or
because of a failure.
The `data` HashMap contains an `error` key with the error and a `url` key
with the conference URL. If the conference finished gracefully no `error`
key will be present.

##### CONFERENCE_WILL_JOIN
Broadcasted before a conference is joined.
The `data` HashMap contains a `url` key with the conference URL.

##### AUDIO_MUTED_CHANGED
Broadcasted when audioMuted state changed.
The `data` HashMap contains a `muted` key with state of the audioMuted for the localParticipant.

##### PARTICIPANT_JOINED
Broadcasted when a participant has joined the conference.
The `data` HashMap contains information of the participant that has joined.
Depending of whether the participant is the local one or not, some of them are 
present/missing.
    isLocal
    email
    name
    participantId

##### PARTICIPANT_LEFT
Broadcasted when a participant has joined the conference.
The `data` HashMap contains information of the participant that has left.
Depending of whether the participant is the local one or not, some of them are 
present/missing.
    isLocal
    email
    name
    participantId

##### ENDPOINT_TEXT_MESSAGE_RECEIVED
Broadcasted when an endpoint text message is received.
The `data` HashMap contains a `senderId` key with the participantId of the sender and a `message` key with the content.

### Broadcasting Actions
The SDK listens for broadcasted actions from the users and reacts accordingly.

```java
    Intent muteBroadcastIntent = new Intent(BroadcastAction.Type.SET_AUDIO_MUTED.getAction());
    muteBroadcastIntent.putExtra("muted", muted);
    LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(muteBroadcastIntent);
 ```

The intents can be build manually (as shown above) or through the methods in `BroadcastIntentHelper`.

Please see `MeetHourOngoingConferenceService` for more examples of sending actions.

#### Supported actions

##### SET_AUDIO_MUTED
Sets the state of the localParticipant audio muted according to the `muted` parameter.
Expects a `muted` key on the intent extra with a boolean value.

##### HANG_UP
The localParticipant leaves the current conference.
Does not expect any extra value.

##### SEND_ENDPOINT_TEXT_MESSAGE
Sends a messaage via the data channel to one particular participant or to all of them.
Expects a `to` key on the intent extra with the id of the participant to which the messaage 
is meant and a `message` key with a string value, the actual content of the message. 
If the `to` key is not present or it's value is empty, the message will be sent 
to all the participants in the conference.

In order to get the participantId, the `PARTICIPANT_JOINED` event should be listened for,
which `data` includes the id and this should be stored somehow.

## Picture-in-Picture

`MeetHourView` will automatically adjust its UI when presented in a
Picture-in-Picture style scenario, in a rectangle too small to accommodate its
"full" UI.

## Dropbox integration

To setup the Dropbox integration, follow these steps:

1. Add the following to the app's AndroidManifest.xml and change `<APP_KEY>` to
your Dropbox app key:
```
<activity
    android:configChanges="keyboard|orientation"
    android:launchMode="singleTask"
    android:exported="true"
    android:name="com.dropbox.core.android.AuthActivity">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.BROWSABLE" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="db-<APP_KEY>" />
  </intent-filter>
</activity>
```

2. Add the following to the app's strings.xml and change `<APP_KEY>` to your
Dropbox app key:
```
<string name="dropbox_app_key"><APP_KEY></string>
```