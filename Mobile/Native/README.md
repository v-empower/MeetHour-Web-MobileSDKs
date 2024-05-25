# Meet Hour SDK samples

This repository contains sample applications for Android and iOS which use the [Meet Hour] SDK. They are organized
as follows:

## Android

* [android/java](android/java): Android example, written in Java
* [android/kotlin](android/kotlin): Android example, written in Kotlin

## iOS

* [ios/objc](ios/objc): iOS examples, written in Objective-C
* [ios/swift](ios/swift): iOS example, written in Swift and showing how Picture-in-Picture

NOTE: You must be using Xcode >= 12.2 for the iOS examples to run.

[Meet Hour]: https://meethour.io

# Latest version - 4.3.1

# MeetHour SDK Implementation - Steps

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
