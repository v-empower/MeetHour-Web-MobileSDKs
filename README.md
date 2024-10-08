# [Meet Hour - SDKs & Examples]

![image](https://github.com/v-empower/MeetHour-Web-MobileSDKs/assets/28260541/3e0efea5-b908-48ec-95d9-034e89a9f6e7)

Meet Hour is HD Quality video conference solution with End to End Encrypted and many other features such as lobby mode, Live Streaming, fundraising, Video call recording, Youtube Live Stream etc.

Note: Pcode is Encrypted Meeting password. Get it from APIs.

# Try out one free session -

    1. Website - https://meethour.io
    2. Android - https://bit.ly/2U239ll
    3. iOS - https://apple.co/3k8Rpbn

![image](https://github.com/v-empower/MeetHour-Web-MobileSDKs/assets/28260541/390e553e-70b2-4835-8938-c46071f4aba7)


# Generic Steps to Integrate Meet Hour without using SDK:

1. Signup for Meet Hour (https://meethour.io) and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Once you signup for developer plan, and go to our Dashboard - (https://portal.meethour.io) and tap on "Developers" menu.
3. Now copy the Client ID & Client Secret and keep it handy with you.
4. Go to our API documentation and hit the Login API to get an oAuth Access Token - (https://bit.ly/3E2hKU7)
5. Once you get an access token, you can access any of our API. Now the first thing you have to do is create a contact in our system as soon as user signup in your platform using this API (https://bit.ly/3flms7q). This will give you a unique contact_id of that user. You will require this id when you schedule a meeting below.
6. Later go to Schedule Meeting API -> Pass all the parameters needed to generate a new meetings - (https://bit.ly/3h0qpis)
7. Once the meeting is generated, in order to join a meeting you're required to Generate a JWT Token using this API (https://bit.ly/3sJaojD) and pass it to the conference URL via MT Parameter - https://meethour.io?mt={token}

# Meet Hour Mobile SDKs - Examples
Code consist of Meet Hour Web & Mobile SDKs with an example to join the conference from both Web & Mobile Technologies.

```bash
1. Web
	1.1 Javascript -> SDK
		1.1.1 Jquery - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Javascript/JQuery
		1.1.2 React JS - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Javascript/React
		1.1.3 Angular (Coming soon)
		1.1.4 NodeJS (Coming soon)
		1.1.5 SailJS (Coming soon)
	1.2 PHP -> SDK
		1.2.1 Core PHP - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/PHP/CorePHP
		1.2.2 Laravel - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/PHP/Laravel
		1.2.3 WordPress (Coming soon)
		1.2.4 CodeIgnitor (Coming soon)
	1.3 Python -> SDK
		1.3.1 Core Python - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Python/CorePython
		1.3.2 django - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Python/Django
	1.4 C# -> SDK
		1.4.1 ASP.NET - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Dotnet/Asp/MeethourExample-Asp
	1.5 Java JVM -> SDK
		1.5.1 CoreJava - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Java/Core-Java
        	1.5.2 Spring Boot (Coming soon)
	1.6 Flutter Web -> https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Flutter/MeetHourSDKTest
2. Mobile
	2.1 Flutter - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/Flutter
	2.2 Native
		2.2.1 Android
			2.2.1.1 Java - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/Native/android/java/MeetHourSDKTest
			2.2.1.2 Kotlin - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/Native/android/kotlin/MeetHourSDKTest
		2.2.2 iOS
			2.2.2.1 Swift - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/Native/ios/swift/MeetHourSDKTest
			2.2.2.2 Objective-C - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/Native/ios/objc/MeetHourSDKTest
	2.3 React Native - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Mobile/ReactNative
```
   
# MeetHour API, SDK & Examples

1. SDK Example Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/


# Libraries & SDK
1. Android Maven - [https://repo.meethour.io/maven/releases/](https://repo.meethour.io/maven/releases/)
2. iOS Cocoapods - [https://cocoapods.org/pods/MeetHourSDK](https://cocoapods.org/pods/MeetHourSDK)
3. React Web NPM - [https://www.npmjs.com/package/meet-hour-react-web-sdk](https://www.npmjs.com/package/meet-hour-react-web-sdk)
4. React Native NPM - [https://www.npmjs.com/package/react-native-meet-hour-sdk](https://www.npmjs.com/package/react-native-meet-hour-sdk)
5. PHP SDK - [https://packagist.org/packages/meethour/php-sdk](https://packagist.org/packages/meethour/php-sdk)
5. Flutter Pub Dev - [https://pub.dev/packages/meet_hour](https://pub.dev/packages/meet_hour)
6. Python SDK - [https://pypi.org/project/pymeethour/](https://pypi.org/project/pymeethour/)
7. DOT NET SDK - [https://www.nuget.org/packages/meethour](https://www.nuget.org/packages/meethour)
8. Java SDK - [https://github.com/v-empower/MeetHour-Java-SDK](https://github.com/v-empower/MeetHour-Java-SDK)

For any issues or queries raise a issue in Github or send us an email to hello@meethour.io or have Live Chat with our technical team at - https://bit.ly/35fVHZO

Meet Hour, LLC
