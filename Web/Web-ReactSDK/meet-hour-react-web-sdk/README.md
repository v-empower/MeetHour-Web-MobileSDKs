# meet-hour-react-web-sdk
React SDK for Meet Hour Web (IFrame)

[Meet Hour - 100% free video conference solution](https://meethour.io)
Meet Hour is 100% free video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc.


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


# MeetHour SDK Implementation - Steps

1. SDK Example Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

# Steps to Integrate:

1. Signup for Meet Hour (https://meethour.io) and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Once you signup for developer plan, and go to our Dashboard - (https://portal.meethour.io) and tap on "Developers" menu.
3. Now copy the Client ID & Client Secret and keep it handy with you.
4. Go to our API documentation and hit the Login API to get an oAuth Access Token - (https://bit.ly/3E2hKU7)
5. Once you get an access token, you can access any of our API. Now the first thing you have to do is create a contact in our system as soon as user signup in your platform using this API (https://bit.ly/3flms7q). This will give you a unique contact_id of that user. You will require this id when you schedule a meeting below.
6. Later go to Schedule Meeting API -> Pass all the parameters needed to generate a new meetings - (https://bit.ly/3h0qpis)
7. Once the meeting is generated, in order to join a meeting you're required to Generate a JWT Token using this API (https://bit.ly/3sJaojD) and pass it to the conference URL via MT Parameter - https://meethour.io?mt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSlNVekkxTmlKOS5leUpoZFdRaU9pSTVNemxrWmpVeE5pMDJNekEzTFRRNVkyUXRPVGMxTXkwek1XRTNNemRrT1RGaE1HWWlMQ0pxZEdraU9pSmtNMlUyT


## Install
```bash
npm install meet-hour-react-web-sdk
```
### Modules
This library exposes two components with similar properties, intended for different use-cases.
#### MeetHourMeeting
To be used with custom domains as-it-is in React projects:
```js
<MeetHourMeeting
    domain = { YOUR_DOMAIN }
    roomName = { YOUR_ROOM_NAME }
/>
```
##### Properties specific to the `MeetHourMeeting` component
###### `domain`
Optional. Field used to retrieve the external_api.js file that initializes the IFrame. If omitted, defaults to `meethour.io`.

###### `roomName`
Required. String used when joining the meeting.

###### `getIFrameRef`
Optional. Callback to retrieve the parent node of the IFrame for more control (e.g. styling).
```js
<MeetHourMeeting
    ...
    getIFrameRef = { iframeRef => { iframeRef.style.height = '700px'; } }
/>
```

###### `onApiReady`
Optional. Callback triggered when the external API is loaded to expose it for events and commands.
```js
<MeetHourMeeting
    ...
    onApiReady = { externalApi => console.log('Meet Hour External API', externalApi) }
/>
```

###### `jwt`
Mandatory if Moderator is trying to join the call for authentication.

###### `onReadyToClose`
Optional. Callback triggered when the meeting is ready to be closed.
```js
<MeetHourMeeting
    ...
    onReadyToClose = { () => console.log('Meet Hour is ready to be closed') }
/>
```

###### `configOverwrite`
Optional. Object used for options overrides.

###### `interfaceConfigOverwrite`
Optional. Object used for more options overrides.

###### `jwt`
Mandatory. Token for authentication.

###### `userInfo`
Optional. Details about the participant that started the meeting.

###### `spinner`
Optional. Custom loading view while the IFrame is loading.

## Example
Install and run the project from the sample SDK from here - https://github.com/v-empower/MeetHour-Web-MobileSDKs/Web/Web-ReactSDK 


# Library & SDK
1. Android Maven - https://repo.meethour.io/maven/releases/
2. iOS Cocoapods - https://cocoapods.org/pods/MeetHourSDK
3. React Native NPM - https://www.npmjs.com/package/react-native-meet-hour-sdk
4. Flutter Pub Dev - https://pub.dev/packages/meet_hour
