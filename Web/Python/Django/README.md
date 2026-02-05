### MeetHour-Python-Django-Example

![Alt text](logo.png)

[Meet Hour - HD Quality video conference solution](https://meethour.io)
Meet Hour is HD Quality video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc.

# Features:

    ✅  Free Unlimited Time Group Video Conference
    ✅  Upto 100 Participants Group Meeting
    ✅  Free Video Conference Recording
    ✅  YouTube Live Stream
    ✅  Raise funds via Click&Pledge Connect & DonorBox
    ✅  Virtual Background
    ✅  Live Pad
    ✅  Screensharing on Desktop & Mobile and many other features.

# Try out one free session -

    1. Website - https://meethour.io
    2. Android - https://bit.ly/2U239ll
    3. iOS - https://apple.co/3k8Rpbn

![Alt text](screenshot.png)

### Pypi package or Poetry Package (Latest version - 1.0.1)

Using pip:

`pip install -U pymeethour`

Using [poetry](https://python-poetry.org/):

`poetry add pymeethour`

# MeetHour API Documentation

API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

### Commands to Dependencies & Environment Setup

Installation of dependencies

`pip install -r requirements.txt`

### Steps to run the Example

1. Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial. 
2. Go to the dashboard and then click on developers menu. 
3. Later go to meethour/core/constants.py and enter all the credentials of database and Meet Hour credentials as well.
4. On Home page Click on Get Access Token 
5. Then Try Schedule a Meeting & Join Meeting. 

Running the project

`python3 manage.py runserver`

### Usage

Provide your credentials in the constructor of Login object and hit the login api to get your access token. Which will further be used for making rest of the api calls.

```
### In Views.py 

    from django.shortcuts import render
    from pymeethour.type import LoginType, ScheduleMeetingType, ViewMeetings, GenerateJwtType
    from pymeethour.services import apiServices as apiServices

    CLIENT_ID = ''
    CLIENT_SECRET = ''
    EMAIL = ''
    PASSWORD = ''
    GRANT_TYPE = ''
    API_KEY = ''
    API_RELEASE = 'v2.4.6'
    CONFERENCE_URL = 'meethour.io'

    apiservice = apiServices.MHApiService()

    def usage(request):
        loginBody = LoginType.LoginType(CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD)
        login_response = apiservice.login(loginBody)

        scheduleMeetingBody = ScheduleMeetingType.ScheduleMeeting("Meeting Test", "123456", "10:00", "PM", "23-06-2030", "Asia/ Kolkata")
        schedule_meeting_response = apiservice.schedule_meeting(login_response.get('access_token'), scheduleMeetingBody)

        viewMeetingBody = ViewMeetings.ViewMeeting(schedule_meeting_response.get('data').get('meeting_id'))
        view_meetings_response = apiservice.view_meetings(login_response.get('access_token'), viewMeetingBody)

        GenerateJWTBody = GenerateJwtType.GenerateJwt(view_meetings_response.get('meeting').get('meeting_id'))
        generate_response = apiservice.generate_jwt(login_response.get('access_token'), GenerateJWTBody)
        context = {
            'meeting_id': view_meetings_response.get('meeting').get('meeting_id'),
            'jwt_token': generate_response.get('jwt'),
            'pCode': view_meetings_response.get('meeting').get('pcode'),
            'API_KEY': API_KEY,
            'API_RELEASE': API_RELEASE,
            'CONFERENCE_URL': CONFERENCE_URL,
        }

        return render(request, 'usage.html', context)

### In usage.html

<!DOCTYPE html>
<html>
    <head>
        <style>
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden; 
            }
            #conference-parent {
                height: 100%;
            }
        </style>
    </head>
<body>
    <script type="text/javascript" src="https://api.meethour.io/libs/{{ API_RELEASE }}/external_api.min.js?apiKey={{ API_KEY }}"></script>
    <div class="relative" id="conference-parent"></div>
    <script type="text/javascript">
        try {
            const conferencePanel = document.createElement("div");
            conferencePanel.setAttribute("id", "conference");
            conferencePanel.setAttribute("style", "height: 100%;");
            const meetingPanel = document.querySelector("#conference-parent");
            meetingPanel.appendChild(conferencePanel);
            var domain = "{{ CONFERENCE_URL }}";
            var options = {
                roomName: "{{ meeting_id }}",
                parentNode: document.querySelector("#conference"),
                jwt: "{{ jwt_token }}",
                apiKey: "{{ API_KEY }}",
                pcode: "{{ pCode }}",
                interfaceConfigOverwrite: {
                    applyMeetingSettings: true,
                    disablePrejoinHeader: true,
                    disablePrejoinFooter: true,
                    SHOW_MEET_HOUR_WATERMARK: false,
                    ENABLE_DESKTOP_DEEPLINK: false,
                    HIDE_DEEP_LINKING_LOGO: true,
                    MOBILE_APP_PROMO: false,
                    ENABLE_MOBILE_BROWSER: true,
                },
            };
            var api = new MeetHourExternalAPI(domain, options);
        } catch (error) {
            console.log(error);
        }
    </script>
</body>
</html>

### In urls.py

    from django.urls import path
    from meethour.core import views

    urlpatterns = [
        path('', views.usage, name='usage'),
    ]

```

### API End Points Supported

Important points:
=> Instead of '{version}', you to pass our latest version whenever you call the given functions. Currently we are using v1.2 Same version applies to the below calls.
=> In the token section, you need to pass the received access token which is received when login api is hit, for making further api calls.
=> You can make API calls by passing required properties in the constructor. But, to meet special requirements you can set rest of the properties directly, according to your need. For more details go to https://docs.v-empower.com/docs/MeetHour-API then click on APIS section to get all the information related to each api call.

1. To Get Access Token Endpoint : => https://docs.v-empower.com/docs/MeetHour-API/a44a7d7669f91-user-login-get-access-token

   ```
        from pymeethour.type import LoginType
        apiservice = apiServices.MHApiService()

        loginBody = LoginType.LoginType('CLIENT_ID', 'CLIENT_SECRET', 'GRANT_TYPE', 'EMAIL', 'PASSWORD') # pass values
        login_response = apiservice.login(loginBody)
        print(login_response)

   ```

   => You have to pass respective values in the argument section. Hence, to get desired response.

2. To schedule a meeting: => https://docs.v-empower.com/docs/MeetHour-API/2de4b757a6312-meeting-schedule-meeting

   ```
        from pymeethour.type import ScheduleMeetingType
        apiservice = apiServices.MHApiService()

        scheduleMeetingBody= ScheduleMeetingType.ScheduleMeeting( )
        schedule_meeting_response = apiservice.schedule_meeting(token, scheduleMeetingBody)
        print(schedule_meeting_response)

   ```

3. To Generate JWT Token Endpoint => https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt

   ```
        from pymeethour.type import GenerateJwtType
        apiservice = apiServices.MHApiService()

        generateJwtBody= GenerateJwtType.GenerateJwt("meeting_id","contact_id") # pass values
        generate_jwt_response = apiservice.generate_jwt(token, generateJwtBody)
        print(generate_jwt_response)

   ```

4. To fetch User Details: => https://docs.v-empower.com/docs/MeetHour-API/ff9d0e37d9191-user-details

   ```
        from pymeethour.type import user_details
        apiservice = apiServices.MHApiService()

        userDetailsBody= user_details.user_details(0,0,0,0)  
        user_details_response = apiservice.user_details(token, userDetailsBody)
        print(user_details_response)

   ```

5. To fetch access Token using Refresh Token: => https://docs.v-empower.com/docs/MeetHour-API/d851be1af9804-get-access-token-using-refresh-token

```
    from pymeethour.type import RefreshToken
    apiservice = apiServices.MHApiService()

    refreshTokenBody= RefreshToken.RefreshToken('refresh_token','CLIENT_ID','CLIENT_SECRET','access_token') #pass values
    refresh_token_response = apiservice.refresh_token(token, refreshTokenBody)
    print(refresh_token_response)
 
```

6. To add a contact in Meet Hour database: => https://docs.v-empower.com/docs/MeetHour-API/bd1e416413e8c-add-contact

```
        from pymeethour.type import AddContactType
        apiservice = apiServices.MHApiService()

        addContactBody = AddContactType.AddContactType("EMAIL","Fristname","lastname","phone","country_code ","Image","1")     #pass values
        add_contact_response = apiservice.add_contact(token, addContactBody)
        print(add_contact_response)
```

7. To get Timezones of various countries: => https://docs.v-empower.com/docs/MeetHour-API/c688c29bce9b9-timezone-list

   ```
        from pymeethour.type import time_zone
        apiservice = apiServices.MHApiService()

        timeZoneBody= time_zone.time_zone(0,0,0)
        timeZone_response = apiservice.time_zone(token, timeZoneBody)
        print(timeZone_response)

   ```

8. To get list of all the contacts in your Meet Hour account: => https://api.meethour.io/api/{version}/customer/contacts

   ```
        from pymeethour.type import ContactsType
        apiservice = apiServices.MHApiService()

        contactsBody = ContactsType.ContactsType(0,0,0)
        contacts_response = apiservice.contacts(token, contactsBody)
        print(contacts_response)

   ```

9. To make changes in the existing contact details: => https://docs.v-empower.com/docs/MeetHour-API/28cae9187d215-edit-contact

   ````
        from pymeethour.type import EditContactType
        apiservice = apiServices.MHApiService()

        editContactsBody= EditContactType.EditContactType("id","countrycode","EMAIL", "Firstname","lastname","Image","1","phone") # pass values

        edit_contacts_response = apiservice.edit_contact(token, editContactsBody)
        print(edit_contacts_response)

   ````

10. To get Upcoming Meetings: => https://docs.v-empower.com/docs/MeetHour-API/31df88388416d-upcoming-meetings

    ```
        from pymeethour.type import UpcomingMeetings
        apiservice = apiServices.MHApiService()

        upcomingMeetingsBody= UpcomingMeetings.UpcomingMeetings()
        upcoming_meetings_response = apiservice.upcoming_meetings(token, upcomingMeetingsBody)
        print(upcoming_meetings_response) 

    ```

11. To archive a meeting: => https://docs.v-empower.com/docs/MeetHour-API/1dd64523cc6bf-archive-meeting

    ```
        from pymeethour.type import ArchiveMeeting
        apiservice = apiServices.MHApiService()

        archiveMeetingBody = ArchiveMeeting.ArchiveMeetings("id")   # pass value
        ArchiveMeeting_response = apiservice.archive_meetings(token, archiveMeetingBody)
        print(ArchiveMeeting_response)

    ```

12. To get the details of a missed meeting: => https://docs.v-empower.com/docs/MeetHour-API/92998e2dda102-missed-meetings

    ```
        from pymeethour.type import MissedMeeting
        apiservice = apiServices.MHApiService()

        missedMeetingsBody = MissedMeeting.MissedMeetings()
        missed_meetings_response = apiservice.missed_meetings(token, missedMeetingsBody)
        print(missed_meetings_response)

    ```

13. To get completed meetings: => https://docs.v-empower.com/docs/MeetHour-API/aa9ef6a678250-completed-meetings

    ```
        from pymeethour.type import CompletedMeetingsType
        apiservice = apiServices.MHApiService() 

        completedMeetingsBody = CompletedMeetingsType.CompletedMeetings()
        completed_meetings_response = apiservice.completed_meetings(token, completedMeetingsBody)
        print(completed_meetings_response)
    ```

14. To edit an existing meeting: => https://docs.v-empower.com/docs/MeetHour-API/5dedde36380b4-meeting-edit-meeting

    ```
        from pymeethour.type import EditMeetingType
        apiservice = apiServices.MHApiService() 

        editMeetingBody = EditMeetingType.EditMeeting('meeting_id') #pass value
        edit_meeting_response = apiservice.edit_meeting(token, editMeetingBody)
        print(edit_meeting_response)
    ```

15. To view a meeting: => https://docs.v-empower.com/docs/MeetHour-API/7e9a0a1e0da7f-meeting-view-meeting

    ```
        from pymeethour.type import ViewMeetings
        apiservice = apiServices.MHApiService() 

        viewMeetingBody = ViewMeetings.ViewMeeting('meeting_id') #pass value   
        view_meetings_response = apiservice.view_meetings(token, viewMeetingBody)
        print(view_meetings_response)

    ```

16. To get all the recordings list: => https://docs.v-empower.com/docs/MeetHour-API/ce7c4fd8cae7e-recording-list

    ```
        from pymeethour.type import RecordingsList
        apiservice = apiServices.MHApiService() 

        recordingsListBody = RecordingsList.RecordingsList('Local') # storage location
        recordings_list_response = apiservice.recordings_list(token, recordingsListBody)
        print(recordings_list_response)

    ```

### Join Meeting via Javascript SDK

```
        <script src="https://api.meethour.io/libs/v2.4.6/external_api.min.js?apiKey=f6282h82729080282928298"></script>
```

### `api = new MeetHourExternalAPI(domain, options)`

Config & User Interface Settings Parameters - Parameters - https://docs.v-empower.com/docs/MeetHour-API/281f2d9a6c539-generate-jwt

The next step for embedding Meet Hour is to create the Meet Hour API object.
Its constructor gets a number of options:

* **domain**: domain used to build the conference URL, 'meethour.io' for
  example.
* **options**: object with properties - the optional arguments:
    * **roomName**: (required) name of the room to join.
    * **apiKey**: (required). You will get API key from your Developer Page - https://portal.meethour.io/customer/developers. Make sure you are on our Developer or higher plan. - https://meethour.io/#pricing
    * **jwt**: (required - If you to start meeting or join or moderator) - https://docs.v-empower.com/docs/MeetHour-API/b3A6MzcwODk5MTQ-generate-jwt
    * **pcode**: (optional) Pass encrypted Meeting Password dynamically. Get this from API.
    * **width**: (optional) width for the iframe which will be created. If a number is specified it's treated as pixel units. If a string is specified the format is number followed by 'px', 'em', 'pt' or '%'.
    * **height**: (optional) height for the iframe which will be created. If a number is specified it's treated as pixel units. If a string is specified the format is number followed by 'px', 'em', 'pt' or '%'.
    * **parentNode**: (optional) HTML DOM Element where the iframe will be added as a child.
    * **noSSL**: (optional, defaults to true) Boolean indicating if the server should be contacted using HTTP or HTTPS.
    * **onload**: (optional) handler for the iframe onload event.
    * **invitees**: (optional) Array of objects containing information about new participants that will be invited in the call.
    * **devices**: (optional) A map containing information about the initial devices that will be used in the call.
    * **userInfo**: (optional) JS object containing information about the participant opening the meeting, such as `email`.


```Javascript Standard Example
<script src='https://api.meethour.io/libs/v2.4.5/external_api.min.js?apiKey=<APIKEY>'></script>
<div id="conference" style="height: 100%;"></div>
 <script>
        var domain = "meethour.io";
        var options = {
            roomName: "TestRoom", //Change to your Meeting ID
            parentNode: document.querySelector("#conference"),
            jwt: "",
            apiKey: "",
            pcode: "5b40602cfea7708895781a8cad71be5b",
            configOverwrite: {
                prejoinPageEnabled: true, // make this false to skip the prejoin page 
                disableInviteFunctions: true,
            },
            interfaceConfigOverwrite: {
                applyMeetingSettings: true, // This is managed from this page - https://portal.meethour.io/customer/ui_settings
                disablePrejoinHeader: true,
                disablePrejoinFooter: true,                
                SHOW_MEET_HOUR_WATERMARK: false,
                ENABLE_DESKTOP_DEEPLINK: false,
                HIDE_DEEP_LINKING_LOGO: true,
                MOBILE_APP_PROMO: false,
                ENABLE_MOBILE_BROWSER: true
            },

        };
        // Initialization of MeetHour External API
        var api = new MeetHourExternalAPI(domain, options);

 </script>
```


Example:

```javascript
const domain = 'meethour.io';
const options = {
    roomName: 'MeetHourExternalAPI',
    width: 700,
    height: 700,
    parentNode: document.querySelector('#meet')
};
const api = new MeetHourExternalAPI(domain, options);
```

You can set the initial media devices for the call:

```javascript
const domain = 'meethour.io';
const options = {
    ...
    devices: {
        audioInput: '<deviceLabel>',
        audioOutput: '<deviceLabel>',
        videoInput: '<deviceLabel>'
    },
    ...
};
const api = new MeetHourExternalAPI(domain, options);
```

You can overwrite options set in [config.js] and [interface_config.js].
For example, to enable the filmstrip-only interface mode, you can use:

```javascript
const options = {
    ...
    interfaceConfigOverwrite: { filmStripOnly: true },
    ...
};
const api = new MeetHourExternalAPI(domain, options);
```

You can also pass a jwt token to Meet Hour:

 ```javascript
const options = {
    ...
    jwt: '<jwt_token>',
    noSsl: false,
    ...
};
const api = new MeetHourExternalAPI(domain, options);
 ```

You can set the userInfo(email, display name) for the call:

```javascript
var domain = "meethour.io";
var options = {
    ...
    userInfo: {
        email: 'email@meethourexamplemail.com',
        displayName: 'John Doe'
    }
}
var api = new MeetHourExternalAPI(domain, options);
```

### Controlling the embedded Meet Hour Conference

Device management `MeetHourExternalAPI` methods:
* **getAvailableDevices** - Retrieve a list of available devices.

```javascript
api.getAvailableDevices().then(devices => {
    devices = {
        audioInput: [{
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'audioinput'
            label: 'label'
        },....],
        audioOutput: [{
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'audioOutput'
            label: 'label'
        },....],
        videoInput: [{
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'videoInput'
            label: 'label'
        },....]
    }
    ...
});
```
* **getCurrentDevices** - Retrieve a list with the devices that are currently selected.

```javascript
api.getCurrentDevices().then(devices => {
    devices = {
        audioInput: {
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'videoInput'
            label: 'label'
        },
        audioOutput: {
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'videoInput'
            label: 'label'
        },
        videoInput: {
            deviceId: 'ID'
            groupId: 'grpID'
            kind: 'videoInput'
            label: 'label'
        }
    }
    ...
});
```
* **isDeviceChangeAvailable** - Resolves with true if the device change is available and with false if not.

```javascript
// The accepted deviceType values are - 'output', 'input' or undefined.
api.isDeviceChangeAvailable(deviceType).then(isDeviceChangeAvailable => {
    ...
});
```
* **isDeviceListAvailable** - Resolves with true if the device list is available and with false if not.

```javascript
api.isDeviceListAvailable().then(isDeviceListAvailable => {
    ...
});
```
* **isMultipleAudioInputSupported** - Resolves with true if multiple audio input is supported and with false if not.

```javascript
api.isMultipleAudioInputSupported().then(isMultipleAudioInputSupported => {
    ...
});
```
* **setAudioInputDevice** - Sets the audio input device to the one with the label or id that is passed.

```javascript
api.setAudioInputDevice(deviceLabel, deviceId);
```
* **setAudioOutputDevice** - Sets the audio output device to the one with the label or id that is passed.

```javascript
api.setAudioOutputDevice(deviceLabel, deviceId);
```
* **setVideoInputDevice** - Sets the video input device to the one with the label or id that is passed.

```javascript
api.setVideoInputDevice(deviceLabel, deviceId);
```

You can control the embedded Meet Hour conference using the `MeetHourExternalAPI` object by using `executeCommand`:

```javascript
api.executeCommand(command, ...arguments);
```

The `command` parameter is String object with the name of the command. The following commands are currently supported:

* **displayName** - Sets the display name of the local participant. This command requires one argument - the new display name to be set.
```javascript
api.executeCommand('displayName', 'New Nickname');
```

* **password** - Sets the password for the room. This command requires one argument - the password name to be set.
```javascript
api.executeCommand('password', 'The Password');
```

* **sendTones** - Play touch tones.
```javascript
api.executeCommand('sendTones', {
    tones: string, // The dial pad touch tones to play. For example, '12345#'.
    duration: number, // Optional. The number of milliseconds each tone should play. The default is 200.
    pause: number // Optional. The number of milliseconds between each tone. The default is 200.
});
```

* **subject** - Sets the subject of the conference. This command requires one argument - the new subject to be set.
```javascript
api.executeCommand('subject', 'New Conference Subject');
```

* **toggleAudio** - Mutes / unmutes the audio for the local participant. No arguments are required.
```javascript
api.executeCommand('toggleAudio');
```

* **toggleVideo** - Mutes / unmutes the video for the local participant. No arguments are required.
```javascript
api.executeCommand('toggleVideo');
```

* **toggleFilmStrip** - Hides / shows the filmstrip. No arguments are required.
```javascript
api.executeCommand('toggleFilmStrip');
```

* **toggleChat** - Hides / shows the chat. No arguments are required.
```javascript
api.executeCommand('toggleChat');
```

* **toggleShareScreen** - Starts / stops screen sharing. No arguments are required.
```javascript
api.executeCommand('toggleShareScreen');
```

* **toggleTileView** - Enter / exit tile view layout mode. No arguments are required.
```javascript
api.executeCommand('toggleTileView');
```

* **hangup** - Hangups the call. No arguments are required.
```javascript
api.executeCommand('hangup');
```

* **email** - Changes the local email address. This command requires one argument - the new email address to be set.
```javascript
api.executeCommand('email', 'example@example.com');
```

* **avatarUrl** - Changes the local avatar URL. This command requires one argument - the new avatar URL to be set.
```javascript
api.executeCommand('avatarUrl', 'https://avatars0.githubusercontent.com/u/3671647');
```

* **sendEndpointTextMessage** - Sends a text message to another participant through the datachannels.
```javascript
api.executeCommand('receiverParticipantId', 'text');
```
* **setVideoQuality** - Sets the send and receive video resolution. This command requires one argument - the resolution height to be set.
```javascript
api.executeCommand('setVideoQuality', 720);
```

You can also execute multiple commands using the `executeCommands` method:
```javascript
api.executeCommands(commands);
```
The `commands` parameter is an object with the names of the commands as keys and the arguments for the commands as values:
```javascript
api.executeCommands({
    displayName: [ 'nickname' ],
    toggleAudio: []
});
```

You can add event listeners to the embedded Meet Hour using the `addEventListener` method.
**NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods (`addListener` or `on`).**
```javascript
api.addEventListener(event, listener);
```

The `event` parameter is a String object with the name of the event.
The `listener` parameter is a Function object with one argument that will be notified when the event occurs with data related to the event.

The following events are currently supported:
* **cameraError** - event notifications about meethour-Meet having failed to access the camera. The listener will receive an object with the following structure:
```javascript
{
    type: string, // A constant representing the overall type of the error.
    message: string // Additional information about the error.
}
```

* **avatarChanged** - event notifications about avatar
changes. The listener will receive an object with the following structure:
```javascript
{
    id: string, // the id of the participant that changed his avatar.
    avatarURL: string // the new avatar URL.
}
```

* **audioAvailabilityChanged** - event notifications about audio availability status changes. The listener will receive an object with the following structure:
```javascript
{
    available: boolean // new available status - boolean
}
```

* **audioMuteStatusChanged** - event notifications about audio mute status changes. The listener will receive an object with the following structure:
```javascript
{
    muted: boolean // new muted status - boolean
}
```

* **endpointTextMessageReceived** - event notifications about a text message received through datachannels.
The listener will receive an object with the following structure:
```javascript
{
    senderInfo: {
        jid: string, // the jid of the sender
        id: string // the participant id of the sender
    },
    eventData: {
        name: string // the name of the datachannel event: `endpoint-text-message`
        text: string // the received text from the sender
    }
}
```

* **micError** - event notifications about meethour-Meet having failed to access the mic. The listener will receive an object with the following structure:
```javascript
{
    type: string, // A constant representing the overall type of the error.
    message: string // Additional information about the error.
}
```

* **screenSharingStatusChanged** - receives event notifications about turning on/off the local user screen sharing. The listener will receive object with the following structure:
```javascript
{
    on: boolean, //whether screen sharing is on
    details: {

        // From where the screen sharing is capturing, if known. Values which are
        // passed include 'window', 'screen', 'proxy', 'device'. The value undefined
        // will be passed if the source type is unknown or screen share is off.
        sourceType: string|undefined
    }
}
```

* **dominantSpeakerChanged** - receives event notifications about change in the dominant speaker. The listener will receive object with the following structure:
```javascript
{
    id: string //participantId of the new dominant speaker
}
```

* **tileViewChanged** - event notifications about tile view layout mode being entered or exited. The listener will receive object with the following structure:
```javascript
{
    enabled: boolean, // whether tile view is not displayed or not
}
```

* **incomingMessage** - Event notifications about incoming
messages. The listener will receive an object with the following structure:
```javascript
{
    from: string, // The id of the user that sent the message
    nick: string, // the nickname of the user that sent the message
    message: string // the text of the message
}
```

* **outgoingMessage** - Event notifications about outgoing
messages. The listener will receive an object with the following structure:
```javascript
{
    message: string // the text of the message
}
```

* **displayNameChange** - event notifications about display name
changes. The listener will receive an object with the following structure:
```javascript
{
    id: string, // the id of the participant that changed his display name
    displayname: string // the new display name
}
```

* **deviceListChanged** - event notifications about device list changes. The listener will receive an object with the following structure:
```javascript
{
    devices: Object // the new list of available devices.
}
```
NOTE: The devices object has the same format as the getAvailableDevices result format.

* **emailChange** - event notifications about email
changes. The listener will receive an object with the following structure:
```javascript
{
    id: string, // the id of the participant that changed his email
    email: string // the new email
}
```
* **feedbackSubmitted** - event notifications about conference feedback submission
```javascript
{
    error: string // The error which occurred during submission, if any.
}
```

* **filmstripDisplayChanged** - event notifications about the visibility of the filmstrip being updated.
```javascript
{
    visible: boolean // Whether or not the filmstrip is displayed or hidden.
}
```

* **participantJoined** - event notifications about new participants who join the room. The listener will receive an object with the following structure:
```javascript
{
    id: string, // the id of the participant
    displayName: string // the display name of the participant
}
```

* **participantKickedOut** - event notifications about a participants being removed from the room. The listener will receive an object with the following structure:
```javascript
{
    kicked: {
        id: string, // the id of the participant removed from the room
        local: boolean // whether or not the participant is the local particiapnt
    },
    kicker: {
        id: string // the id of the participant who kicked out the other participant
    }
}
```

* **participantLeft** - event notifications about participants that leave the room. The listener will receive an object with the following structure:
```javascript
{
    id: string // the id of the participant
}
```

* **participantRoleChanged** - event notification fired when the role of the local user has changed (none, moderator, participant). The listener will receive an object with the following structure:
```javascript
{
    id: string // the id of the participant
    role: string // the new role of the participant
}
```

* **passwordRequired** - event notifications fired when failing to join a room because it has a password.



* **videoConferenceJoined** - event notifications fired when the local user has joined the video conference. The listener will receive an object with the following structure:
```javascript
{
    roomName: string, // the room name of the conference
    id: string, // the id of the local participant
    displayName: string, // the display name of the local participant
    avatarURL: string // the avatar URL of the local participant
}
```

* **videoConferenceLeft** - event notifications fired when the local user has left the video conference. The listener will receive an object with the following structure:
```javascript
{
    roomName: string // the room name of the conference
}
```

* **videoAvailabilityChanged** - event notifications about video availability status changes. The listener will receive an object with the following structure:
```javascript
{
    available: boolean // new available status - boolean
}
```

* **videoMuteStatusChanged** - event notifications about video mute status changes. The listener will receive an object with the following structure:
```javascript
{
    muted: boolean // new muted status - boolean
}
```

* **readyToClose** - event notification fired when Meet Hour is ready to be closed (hangup operations are completed).

* **subjectChange** - event notifications about subject of conference changes.
The listener will receive an object with the following structure:
```javascript
{
    subject: string // the new subject
}
```

* **suspendDetected** - event notifications about detecting suspend event in host computer.

You can also add multiple event listeners by using `addEventListeners`.
This method requires one argument of type Object. The object argument must
have the names of the events as keys and the listeners of the events as values.
**NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods.**

```javascript
function incomingMessageListener(object)
{
// ...
}

function outgoingMessageListener(object)
{
// ...
}

api.addEventListeners({
    incomingMessage: incomingMessageListener,
    outgoingMessage: outgoingMessageListener
});
```

If you want to remove a listener you can use `removeEventListener` method with argument the name of the event.
**NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods( `removeListener`).**
```javascript
api.removeEventListener('incomingMessage');
```

If you want to remove more than one event you can use `removeEventListeners` method with an Array with the names of the events as an argument.
**NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods.**
```javascript
api.removeEventListeners([ 'incomingMessage', 'outgoingMessageListener' ]);
```

You can get the number of participants in the conference with the following API function:
```javascript
const numberOfParticipants = api.getNumberOfParticipants();
```

You can get the avatar URL of a participant in the conference with the following API function:
```javascript
const avatarURL = api.getAvatarURL(participantId);
```

You can get the display name of a participant in the conference with the following API function:
```javascript
const displayName = api.getDisplayName(participantId);
```

You can get the email of a participant in the conference with the following API function:
```javascript
const email = api.getEmail(participantId);
```

You can get the iframe HTML element where Meet Hour is loaded with the following API function:
```javascript
const iframe = api.getIFrame();
```

You can check whether the audio is muted with the following API function:
```javascript
api.isAudioMuted().then(muted => {
    ...
});
```

You can check whether the video is muted with the following API function:
```javascript
api.isVideoMuted().then(muted => {
    ...
});
```

You can check whether the audio is available with the following API function:
```javascript
api.isAudioAvailable().then(available => {
    ...
});
```

You can check whether the video is available with the following API function:
```javascript
api.isVideoAvailable().then(available => {
    ...
});
```

You can invite new participants to the call with the following API function:
```javascript
api.invite([ {...}, {...}, {...} ]).then(() => {
    // success
}).catch(() => {
    // failure
});
```
