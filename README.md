# [Meet Hour - 100% free video conference solution](https://meethour.io)
Meet Hour is 100% free video conference solution with End to End Encrypted and many other features such as lobby mode, Donor box & Click&Pledge Connect for fundraising, Video call recording, Youtube Live Stream etc.

Note: Pcode is Encrypted Meeting password. Get it from APIs.

# Try out one free session -

    1. Website - https://meethour.io
    2. Android - https://bit.ly/2U239ll
    3. iOS - https://apple.co/3k8Rpbn

# Steps to Integrate:

1. Signup for Meet Hour (https://meethour.io) and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Once you signup for developer plan, and go to our Dashboard - (https://portal.meethour.io) and tap on "Developers" menu.
3. Now copy the Client ID & Client Secret and keep it handy with you.
4. Go to our API documentation and hit the Login API to get an oAuth Access Token - (https://bit.ly/3E2hKU7)
5. Once you get an access token, you can access any of our API. Now the first thing you have to do is create a contact in our system as soon as user signup in your platform using this API (https://bit.ly/3flms7q). This will give you a unique contact_id of that user. You will require this id when you schedule a meeting below.
6. Later go to Schedule Meeting API -> Pass all the parameters needed to generate a new meetings - (https://bit.ly/3h0qpis)
7. Once the meeting is generated, in order to join a meeting you're required to Generate a JWT Token using this API (https://bit.ly/3sJaojD) and pass it to the conference URL via MT Parameter - https://meethour.io?mt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSlNVekkxTmlKOS5leUpoZFdRaU9pSTVNemxrWmpVeE5pMDJNekEzTFRRNVkyUXRPVGMxTXkwek1XRTNNemRrT1RGaE1HWWlMQ0pxZEdraU9pSmtNMlUyT

# MeetHour Mobile SDKs - Examples

    Code consist of Meet Hour Web & Mobile SDKs with an example to join the conference from smart phone via

    1. Web (Generic Javascript)
    2. Web (Jquery Example)
    3. Web (React Example)
    4. Mobile - Native Android (Java Example)
    5. Mobile - Native Android (Kotlin Example)
    6. Mobile - Native iOS (Objc Example)
    7. Mobile - Native iOS (Swift Example)
    8. Mobile - React Native Example
    9. Mobile - Flutter Example


# MeetHour SDK Implementation - Steps

1. SDK Example Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/


# Library & SDK
1. Android Maven - https://repo.meethour.io/maven/releases/
2. iOS Cocoapods - https://cocoapods.org/pods/MeetHourSDK
3. React Native NPM - https://www.npmjs.com/package/react-native-meet-hour-sdk
4. Flutter Pub Dev - https://pub.dev/packages/meet_hour

For any issues or queries raise a issue in Github or send us an email to hello@meethour.io or have Live Chat with our technical team at - https://bit.ly/35fVHZO

Meet Hour, LLC
