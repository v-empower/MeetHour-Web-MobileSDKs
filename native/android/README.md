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

---
id: dev-guide-android-sdk
title: Meet Hour Android SDK
---

## Latest Verion - 4.0.1

The Meet Hour Android SDK provides the same user experience as the Meet Hour app,
in a customizable way which you can embed in your apps.

## Build your own, or use a pre-build SDK artifacts/binaries

MeetHour conveniently provides a pre-build SDK artifacts/binaries in its Maven repository. When you do not require any
modification to the SDK itself or any of its dependencies, it's suggested to use the pre-build SDK. This avoids the
complexity of building and installing your own SDK artifacts/binaries.

### Use pre-build SDK artifacts/binaries

In your project, add the Maven repository
`https://repo.meethour.io/maven/releases` and the
dependency `go.meethour.io.react:meet-hour-sdk:4.0.1` into your `build.gradle` files.

The repository typically goes into the `build.gradle` file in the root of your project:

```gradle
allprojects {
    repositories {
        google()
        jcenter()
        maven {
            url "https://repo.meethour.io/maven/releases"
        }
    }
}
```

Dependency definitions belong in the individual module `build.gradle` files:

```gradle
dependencies {
    // (other dependencies)
    implementation ('go.meethour.io.react:meet-hour-sdk:4.0.1') { transitive = true }
}
```
