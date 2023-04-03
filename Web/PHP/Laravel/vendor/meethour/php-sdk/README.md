# meethour/php-sdk

Meet Hour PHP SDK with Composer, GuzzleHTTP and support for Laravel/CorePHP/CodeIgnitor.

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

1. SDK Example Link - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/PHP/CorePHP
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

### Pre-requisites
1. Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Later go to Developer menu and be ready to use the credentials in this SDK below.


## Install (Works with Laravel & CodeIgnitor Also)

```
composer require meethour/php-sdk

require('./vendor/autoload.php');

require('./vendor/meethour/php-sdk/src/autoload.php');

```

### Usage
     Provide your credentials in the constructor of Login object and hit the login api to get your access token. Which will further be used for making rest of the api calls. 

     <?php

     require('./vendor/autoload.php');
     require('./vendor/meethour/php-sdk/src/autoload.php');

     use MeetHourApp\Services\MHApiService;
     use MeetHourApp\Types\Login;
     use MeetHourApp\Types\ScheduleMeeting;

     $meetHourApiService = new MHApiService();   
     $login = new Login($client_id, $client_secret, $grant_type, $username, $password);
     $loginResponse = $meetHourApiService->login($login);
     $scheduleBody = new ScheduleMeeting("Quick Meeting", "123456", date('h:i'), 'PM', date('d-m-Y'), 'Asia/Kolkata');  // You can give 
     $response = $meetHourApiService->scheduleMeeting($loginResponse->access_token, $scheduleBody);
     var_dump($response);
     $test = new ViewMeeting($meeting_id);
     $response = $meetHourApiService->timezone($loginResponse->access_token);
     var_dump($response);

     ?>


#### MeetHourMeeting (Join Meeting )

We need to follow the Javascript SDK for Join Meetin Module - https://github.com/v-empower/MeetHour-Web-MobileSDKs/tree/master/Web/Javascript/Generic-Javascript

## Example

Install and run the project from the sample SDK from here - https://github.com/v-empower/MeetHour-Web-MobileSDKs/Web/PHP/CorePHP

### API End Points Supported

Important points:
=> Instead of '{version}', you to pass our latest version whenever you call the given functions. Currently we are using v1.2 Same version applies to the below calls.
=> In the token section, you need to pass the received access token which is received when login api is hit, for making further api calls.
=> You can make API calls by passing required properties in the constructor. But, to meet special requirements you can set rest of the properties directly, according to your need. For more details go to https://docs.v-empower.com/docs/MeetHour-API then click on APIS section to get all the information related to each api call.

1. To Get Access Token Endpoint : => https://docs.v-empower.com/docs/MeetHour-API/a44a7d7669f91-user-login-get-access-token

    ```
        class Login {
            public ?string $client_id;
            public ?string $client_secret;
            public ?string $grant_type;
            public ?string $password;
            public ?string $username;
        }
        $body = new Login($client_id, $client_secret, $grant_type, $username, $password);
        MHApiServices.login($body);
    ```
   => You have to pass respective values in the argument section. Hence, to get desired response.

2. To schedule a meeting: => https://docs.v-empower.com/docs/MeetHour-API/2de4b757a6312-meeting-schedule-meeting

    ```
        class ScheduleMeeting {
            public ?string $agenda;
            public ?array $attend;
            public string $default_recording_storage;
            public ?int $duration_hr;
            public ?int $duration_min;
            public ?int $enable_pre_registration;
            public ?string $endBy;
            public ?string $end_date_time;
            public ?int $end_times;
            public ?array $groups;
            public ?array $hostusers;
            public ?string $instructions;
            public ?int $is_recurring;
            public ?int $is_show_portal;
            public ?string $meeting_agenda;
            public string $meeting_date;
            public string $meeting_meridiem;
            public string $meeting_name;
            public string $meeting_time;
            public ?string $meeting_topic;
            public ?string $monthlyBy;
            public ?string $monthlyByDay;
            public ?string $monthlyByWeekday;
            public ?string $monthlyByWeekdayIndex;
            public ?array $options;
            public string $passcode;
            public ?string $recurring_type;
            public ?int $repeat_interval;
            public int $send_calendar_invite;
            public string $timezone;
            public ?int $weeklyWeekDays;
        }

        $body = new ScheduleMeeting($meeting_name, $passcode, $meeting_time, $meeting_meridiem, $meeting_date, $timezone);
        MHApiServices.scheduleMeeting($token, $body);
            
    ```

3. To Generate JWT Token Endpoint => https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
    
    ```
        class GenerateJwt {
            public string $meeting_id;
            public ?int $contact_id;
            public ?object $ui_config;
            public ?array $config;
        }

        $body = new GenerateJwt($meeting_id);
        MHApiServices.generateJwt($token, $body);
    ```


4. To fetch User Details: => https://docs.v-empower.com/docs/MeetHour-API/ff9d0e37d9191-user-details

    ```
        MHApiServices.userDetails($token);
    ```

5. To fetch access Token using Refresh Token: => https://docs.v-empower.com/docs/MeetHour-API/d851be1af9804-get-access-token-using-refresh-token

    ```
        class RefreshToken {
            private string $client_id;
            private string $client_secret;
            private ?string $grant_type;
            private string $refresh_token;
        }

        $body = new RefreshToken($client_id, $client_secret, $refresh_token);
        MHApiServices.getRefreshToken($token, $body);
    ```

6. To add a contact in Meet Hour database: => https://docs.v-empower.com/docs/MeetHour-API/bd1e416413e8c-add-contact

    ```
        class ContactsList {
            public ?int $limit;
            public ?int $page;
            public ?int $exclude_hosts;
        }

        $body = new ContactsList();
        MHApiServices.contactList($token, $body);
    ```

7. To get Timezones of various countries: => https://docs.v-empower.com/docs/MeetHour-API/c688c29bce9b9-timezone-list

    ```
        MHApiServices.timezone($token);
    ```

8. To get list of all the contacts in your Meet Hour account: => https://api.meethour.io/api/{version}/customer/contacts

    ```
        class ContactsList {
            public string $email;
            public string $firstname;
            public ?string $country_code;
            public ?string $image;
            public ?bool $is_show_portal;
            public ?string $lastname;
            public ?string $phone;
        }

        $body = new ContactsList($email, $first_name);
        MHApiServices.ContactsList($token, $body);

    ```

9. To make changes in the existing contact details: => https://docs.v-empower.com/docs/MeetHour-API/28cae9187d215-edit-contact

       ```
        class EditContact {
            public string $email;
            public string $firstname;
            public ?string $country_code;
            public ?string $image;
            public ?bool $is_show_portal;
            public ?string $lastname;
            public ?string $phone;
        }

        $body = new EditContact($contact_id, $firstname, $email);
        MHApiServices.editContact($token, $body);

        ``` 

10. To get Upcoming Meetings: => https://docs.v-empower.com/docs/MeetHour-API/31df88388416d-upcoming-meetings

    ```
        class UpcomingMeetings {
            public ?int $limit;
            public ?int $page;
            public ?int $show_all;
        }

        $body = new UpcomingMeetings();
        MHApiServices.upcomingMeetings($token, $body);
    ```

11. To archive a meeting: => https://docs.v-empower.com/docs/MeetHour-API/1dd64523cc6bf-archive-meeting

    ```
        class ArchiveMeeting {
            public string $id;
        }

        $body = new ArchiveMeeting($id);
        MHApiServices.archiveMeeting($token, $body);
    ```

12. To get the details of a missed meeting: => https://docs.v-empower.com/docs/MeetHour-API/92998e2dda102-missed-meetings

    ```
        class MissedMeetings {
            public ?int $limit;
            public ?int $page;
            public ?int $show_all;
        }

        $body = new MissedMeetings();
        MHApiServices.missedMeetings($token, $body);
    ```

13. To get completed meetings: => https://docs.v-empower.com/docs/MeetHour-API/aa9ef6a678250-completed-meetings

    ```
        class CompletedMeetings {
            public ?int $limit;
            public ?int $page;
            public ?int $show_all;
        }

        $body = new CompletedMeetings();
        MHApiServices.completedMeetings($token, $body);
    ```

14. To edit an existing meeting: => https://docs.v-empower.com/docs/MeetHour-API/5dedde36380b4-meeting-edit-meeting

    ```
        class EditMeeting {
            public string $meeting_id;
            public ?string $meeting_name;
            public ?string $agenda;
            public ?string $passcode;
            public ?string $meeting_date;
            public ?string $meeting_time;
            public ?string $meeting_meridiem;
            public ?int $duration_hr;
            public ?int $duration_min;
            public ?string $timezone;
            public ?int $is_recurring;
            public ?string $recurring_type;
            public ?int $repeat_interval;
            public ?int $weeklyWeekDays;
            public ?string $monthlyBy;
            public ?string $monthlyByDay;
            public ?string $monthlyByWeekdayIndex;
            public ?string $monthlyByWeekday;
            public ?string $endBy;
            public ?string $end_date_time;
            public ?string $instructions;
            public ?int $is_show_portal;
            public ?int $enable_pre_registration;
            public ?string $meeting_topic;
            public ?string $meeting_agenda;
            public ?array $options;
            public ?array $old_attend;
            public ?array $attend;
            public ?array $groups;
            public ?array $hostusers;
            public ?string $default_recording_storage;
            public ?array $live_stream_settings;
        }

        $body = new EditMeeting($meeting_id);
        MHApiServices.editMeeting($token, $body);
    ```

15. To view a meeting: => https://docs.v-empower.com/docs/MeetHour-API/7e9a0a1e0da7f-meeting-view-meeting

    ```
        class ViewMeeting {
            public string $meeting_id;
        }

        $body = new ViewMeeting($meeting_id);
        MHApiServices.viewMeeting($token, $body);
    ```

16. To get all the recordings list: => https://docs.v-empower.com/docs/MeetHour-API/ce7c4fd8cae7e-recording-list


    ```
        class RecordingsList {
            public ?string $filter_by;
            public ?int $limit;
            public ?int $page;
        }

        $body = new RecordingsList();
        MHApiServices.recordingsList($token, $body);
    ```


# Library & SDK

1. Android Maven - https://repo.meethour.io/maven/releases/
2. iOS Cocoapods - https://cocoapods.org/pods/MeetHourSDK
3. React Web NPM - https://www.npmjs.com/package/meet-hour-react-web-sdk
4. React Native NPM - https://www.npmjs.com/package/react-native-meet-hour-sdk
5. PHP SDK - https://packagist.org/packages/meethour/php-sdk
5. Flutter Pub Dev - https://pub.dev/packages/meet_hour