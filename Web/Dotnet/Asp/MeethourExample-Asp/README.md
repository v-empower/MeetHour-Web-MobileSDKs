# MeetHour-DOTNET-SDK

![Alt text](https://raw.githubusercontent.com/v-empower/MeetHour-Python-SDK/master/logo.png)

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

### Nuget Package Update (Latest version - 1.0.1)

```
    https://www.nuget.org/packages/meethour/

```

![Alt text](https://raw.githubusercontent.com/v-empower/MeetHour-Web-MobileSDKs/master/Web/PHP/CorePHP/screenshot.png)

# MeetHour SDK Implementation - Steps

1. SDK Example Link - need to add sdk github link
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

### Steps to run the Example

1. Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial.
2. Go to the dashboard and then click on developers menu.
3. Later go to constants.php and enter all the credentials of database and Meet Hour credentials as well.
4. On Home page Click on Get Access Token
5. Then Try Schedule a Meeting & Join Meeting.

### Usage

Provide your credentials in the constructor of Login object and hit the login api to get your access token. Which will further be used for making rest of the api calls.

```
    using System;
    using System.Threading.Tasks;
    using static Login;
    using static ScheduleMeeting;
    using static ViewMeeting;


    var apiService = new MHApiService();
    var loginObject = new Login("CLIENT_ID", "CLIENT_SECRET", "GRANT_TYPE", "EMAIL", "PASSWORD");
    var response = await apiService.Login<Login>(loginObject);
    if (scheduleMeetingResponse.success == true)
            Console.WriteLine($"Schedule Meeting Success Response value: data: {scheduleMeetingResponse.data}");
        else
            Console.WriteLine($"Schedule Meeting Error Response Code:{scheduleMeetingResponse.code} and Message: {scheduleMeetingResponse.message}");
        Console.ReadKey();


    var scheduleMeetingObject = new ScheduleMeeting("MeetingName", "Passcode", "Timezone", "MeetingDate", "MeetingTime","MeetingMeridiem",SendCalendarInvite,IsShowPortal, "Storage");
    var scheduleMeetingResponse = await apiService.ScheduleMeeting<ScheduleMeetingResponse>(token, scheduleMeetingObject);
    if (scheduleMeetingResponse.success == true)
        Console.WriteLine($"Schedule Meeting Success Response value: data: {scheduleMeetingResponse.data}");
    else
        Console.WriteLine($"Schedule Meeting Error Response Code:{scheduleMeetingResponse.code} and Message: {scheduleMeetingResponse.message}");
    Console.ReadKey();


    var viewMeetingsObject = new ViewMeeting("meeting_id");
    var viewMeetingsResponse = await apiService.ViewMeeting<ViewMeetingResponse>(token, viewMeetingsObject);
    if (viewMeetingsResponse.success == true)
        Console.WriteLine($"View Meetings Response Success Response value: Meeting: {viewMeetingsResponse.meeting}, Occurrences: {viewMeetingsResponse.occurrences} and Meeting_attendees: {viewMeetingsResponse.meeting_attendees},  Meeting_groups: {viewMeetingsResponse.meeting_groups},and Organizer: {viewMeetingsResponse.organizer}");
    else
        Console.WriteLine($"View Meetings Error Response Message: {viewMeetingsResponse.message}");
    Console.ReadKey();
```

### API End Points Supported

Important points:
=> Instead of '{version}', you to pass our latest version whenever you call the given functions. Currently we are using v1.2 Same version applies to the below calls.
=> In the token section, you need to pass the received access token which is received when login api is hit, for making further api calls.
=> You can make API calls by passing required properties in the constructor. But, to meet special requirements you can set rest of the properties directly, according to your need. For more details go to https://docs.v-empower.com/docs/MeetHour-API then click on APIS section to get all the information related to each api call.

1. To Get Access Token Endpoint : => https://docs.v-empower.com/docs/MeetHour-API/a44a7d7669f91-user-login-get-access-token

   ```
        using System;
        using System.Threading.Tasks;
        using static Login;

        ////Need to add your own developer credentials
        var loginObject = new Login("CLIENT_ID", "CLIENT_SECRET", "GRANT_TYPE", "EMAIL", "PASSWORD");
        var apiService = new MHApiService();
        var response = await apiService.Login<Login>(loginObject);
        var token = response.access_token;
        Console.WriteLine($"access_token: {token}");
        Console.ReadKey();
   ```

   => You have to pass respective values in the argument section. Hence, to get desired response.

2. To schedule a meeting: => https://docs.v-empower.com/docs/MeetHour-API/2de4b757a6312-meeting-schedule-meeting

   ```
        using System;
        using System.Threading.Tasks;
        using static ScheduleMeeting;

        //need to change the values
        var scheduleMeetingObject = new ScheduleMeeting("MeetingName", "Passcode", "Timezone", "MeetingDate", "MeetingTime","MeetingMeridiem",SendCalendarInvite,IsShowPortal, "Storage");
        var scheduleMeetingResponse = await apiService.ScheduleMeeting<ScheduleMeetingResponse>(token, scheduleMeetingObject);
        if (scheduleMeetingResponse.success == true)
            Console.WriteLine($"Schedule Meeting Success Response value: data: {scheduleMeetingResponse.data}");
        else
            Console.WriteLine($"Schedule Meeting Error Response Code:{scheduleMeetingResponse.code} and Message: {scheduleMeetingResponse.message}");
        Console.ReadKey();

   ```

3. To Generate JWT Token Endpoint => https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt

   ```
        using System;
        using System.Threading.Tasks;
        using static GenerateJwt;

        var generateJwtObject = new GenerateJwt("meeting_id");   //need to change the values
        var generateJwtResponse = await apiService.GenerateJwt<GenerateJwtResponse>(token, generateJwtObject);
        if (generateJwtResponse.success == true)
            Console.WriteLine($"Generate Jwt Success Response value: Jwt Token: {generateJwtResponse.jwt}");
        else
            Console.WriteLine($"Generate Jwt Error Response Message: Something went worng!");
        Console.ReadKey();

   ```

4. To fetch User Details: => https://docs.v-empower.com/docs/MeetHour-API/ff9d0e37d9191-user-details

   ```
        using System;
        using System.Threading.Tasks;
        using static UserDetails;

        var userDetailsObject = new UserDetails();
        var userDetailsResponse = await apiService.UserDetails<UserDetailsResponse>(token, userDetailsObject);
        if (userDetailsResponse.success == true)
            Console.WriteLine($"User Details Success Response value: data: {userDetailsResponse.data}");
        else
            Console.WriteLine($"User Details Error Response Code:{userDetailsResponse.code} and Message: {userDetailsResponse.message}");
        Console.ReadKey();

   ```

5. To fetch access Token using Refresh Token: => https://docs.v-empower.com/docs/MeetHour-API/d851be1af9804-get-access-token-using-refresh-token

```
        using System;
        using System.Threading.Tasks;
        using static RefreshToken;

        //change to your own developer credentials and accesstoken that generated while login
        var RefreshTokenObject = new RefreshToken("CLIENT_ID","CLIENT_SECRET","access_token");
        var refreshTokenResponse = await apiService.RefreshToken<refreshTokenResponse>(token, refreshTokenObject);
        if (refreshTokenResponse.success == true)
            Console.WriteLine($"Refresh Token Success Response value: data: {refreshTokenResponse.data}");
        else
            Console.WriteLine($"Refresh Token Error Response Code:{refreshTokenResponse.code} and Message: {refreshTokenResponse.message}");
        Console.ReadKey();

```

6. To add a contact in Meet Hour database: => https://docs.v-empower.com/docs/MeetHour-API/bd1e416413e8c-add-contact

```
        using System;
        using System.Threading.Tasks;
        using static AddContact;

        //need to change the values
        var addContactObject = new AddContact("EMAIL","Fristname","lastname","phone","country_code ","Image","1");
        var addContactresponse = await apiService.AddContact<AddContacResponse>(token, addContactObject);
        if (addContactresponse.success == "true")
            Console.WriteLine($"AddContact Success Response value: data: {addContactresponse.data}");
        else
            Console.WriteLine($"AddContact Error Response Code:{addContactresponse.code} and Message: {addContactresponse.message}");
        Console.ReadKey();
```

7. To get Timezones of various countries: => https://docs.v-empower.com/docs/MeetHour-API/c688c29bce9b9-timezone-list

   ```
        using System;
        using System.Threading.Tasks;
        using static TimeZone;

        var timeZoneObject = new TimeZone();
        var timeZoneResponse = await apiService.TimeZone<TimeZoneResponse>(token, timeZoneObject);
        if (timeZoneResponse.success == true)
            Console.WriteLine($"TimeZone Response Success Response value: Timezones: {timeZoneResponse.timezones}");
        else
            Console.WriteLine($"TimeZone Response Error Response Message: {timeZoneResponse.message}");
        Console.ReadKey();

   ```

8. To get list of all the contacts in your Meet Hour account: => https://api.meethour.io/api/{version}/customer/contacts

   ```
        using System;
        using System.Threading.Tasks;
        using static Contact;

        var contactsObject = new Contact(0, 0, 0);
        Console.WriteLine($"addContactObject data : {contactsObject.Prepare()}");
        var contactsResponse = await apiService.Contact<ContactResponse>(token, contactsObject);
        if (contactsResponse.success == true)
            Console.WriteLine($"List of Contact Success Response value: total_pages: {contactsResponse.total_pages} and total_records: {contactsResponse.total_records} and contacts: {contactsResponse.contacts}");
        else
            Console.WriteLine($"List of Contact Error Response Code:{contactsResponse.code} and Message: {contactsResponse.message}");
        Console.ReadKey();

   ```

9. To make changes in the edit contact details: => https://docs.v-empower.com/docs/MeetHour-API/28cae9187d215-edit-contact

   ```
        using System;
        using System.Threading.Tasks;
        using static EditContact;

        //need to change the values
        var editContactObject = new EditContact("id","country_code ", "EMAIL","Fristname","lastname","phone","Image","1");
        var editContactResponse = await apiService.EditContact<EditContactResponse>(token, editContactObject);
        if (editContactResponse.success == true)
            Console.WriteLine($"Edit Contact Success Response value: data: {editContactResponse.data}");
        else
            Console.WriteLine($"Edit Contact Error Response Code:{editContactResponse.code} and Message: {editContactResponse.message}");
        Console.ReadKey();

   ```

10. To get Upcoming Meetings: => https://docs.v-empower.com/docs/MeetHour-API/31df88388416d-upcoming-meetings

    ```
        using System;
        using System.Threading.Tasks;
        using static UpcomingMeetings;

        var upcomingMeetingsObject = new UpcomingMeetings();
        var upcomingMeetingsResponse = await apiService.UpcomingMeetings<UpcomingMeetingsResponse>(token, upcomingMeetingsObject);
        if (upcomingMeetingsResponse.success == true)
            Console.WriteLine($"Upcoming Meetings Response Success Response value: total_pages: {upcomingMeetingsResponse.total_pages} and total_records: {upcomingMeetingsResponse.total_records} and Meetings: {upcomingMeetingsResponse.meetings}");
        else
            Console.WriteLine($"Upcoming Meetings Error Response Message: {upcomingMeetingsResponse.message}");
        Console.ReadKey();

    ```

11. To archive a meeting: => https://docs.v-empower.com/docs/MeetHour-API/1dd64523cc6bf-archive-meeting

    ```
        using System;
        using System.Threading.Tasks;
        using static ArchiveMeetings;

        var archiveMeetingsObject = new ArchiveMeetings(Id);
        var archiveMeetingsResponse = await apiService.ArchiveMeetings<ArchiveMeetingsResponse>(token, archiveMeetingsObject);
        if (archiveMeetingsResponse.success == true)
            Console.WriteLine($"Archive Meetings Success Response value: Message: {archiveMeetingsResponse.message}");
        else
            Console.WriteLine($"Archive Meetings Error Response Message: {archiveMeetingsResponse.message}");
        Console.ReadKey();

    ```

12. To get the details of a missed meeting: => https://docs.v-empower.com/docs/MeetHour-API/92998e2dda102-missed-meetings

    ```
        using System;
        using System.Threading.Tasks;
        using static MissedMeetings;

        var missedMeetingsObject = new MissedMeetings();
        var missedMeetingsResponse = await apiService.MissedMeetings<MissedMeetingsResponse>(token, missedMeetingsObject);
        if (missedMeetingsResponse.success == true)
            Console.WriteLine($"Complete Meetings List Success Response value: total_pages: {missedMeetingsResponse.total_pages} and total_records: {missedMeetingsResponse.total_records} and Meetings: {missedMeetingsResponse.meetings}");
        else
            Console.WriteLine($"Complete Meetings List Error Response Message: {missedMeetingsResponse.message}");
        Console.ReadKey();

    ```

13. To get completed meetings: => https://docs.v-empower.com/docs/MeetHour-API/aa9ef6a678250-completed-meetings

    ```
        using System;
        using System.Threading.Tasks;
        using static CompletedMeetings;

        var completedMeetingsObject = new CompletedMeetings();
        var completedMeetingsResponse = await apiService.CompletedMeetings<CompletedMeetingsResponse>(token, completedMeetingsObject);
        if (completedMeetingsResponse.success == true)
            Console.WriteLine($"Complete Meetings List Success Response value: total_pages: {completedMeetingsResponse.total_pages} and total_records: {completedMeetingsResponse.total_records} and Meetings: {completedMeetingsResponse.meetings}");
        else
            Console.WriteLine($"Complete Meetings List Error Response Message: {completedMeetingsResponse.message}");
        Console.ReadKey();
    ```

14. To edit an edit meeting: => https://docs.v-empower.com/docs/MeetHour-API/5dedde36380b4-meeting-edit-meeting

    ```
        using System;
        using System.Threading.Tasks;
        using static EditMeeting;

        var editMeetingObject = new EditMeeting("meeting_id");    //need to change the values
        var editMeetingResponse = await apiService.EditMeeting<EditMeetingResponse>(token, editMeetingObject);
        if (editMeetingResponse.success == true)
            Console.WriteLine($"Edit Meeting Success Response value: data: {editMeetingResponse.data}");
        else
            Console.WriteLine($"Edit Meeting Error Response Message: {editMeetingResponse.message}");
        Console.ReadKey();

    ```

15. To view a meeting: => https://docs.v-empower.com/docs/MeetHour-API/7e9a0a1e0da7f-meeting-view-meeting

    ```
        using System;
        using System.Threading.Tasks;
        using static ViewMeeting;

        var viewMeetingsObject = new ViewMeeting("meeting_id");   //need to change the values
        var viewMeetingsResponse = await apiService.ViewMeeting<ViewMeetingResponse>(token, viewMeetingsObject);
        if (viewMeetingsResponse.success == true)
            Console.WriteLine($"View Meetings Response Success Response value: Meeting: {viewMeetingsResponse.meeting}, Occurrences: {viewMeetingsResponse.occurrences} and Meeting_attendees: {viewMeetingsResponse.meeting_attendees},  Meeting_groups: {viewMeetingsResponse.meeting_groups},and Organizer: {viewMeetingsResponse.organizer}");
        else
            Console.WriteLine($"View Meetings Error Response Message: {viewMeetingsResponse.message}");
        Console.ReadKey();

    ```

16. To get all the recordings list: => https://docs.v-empower.com/docs/MeetHour-API/ce7c4fd8cae7e-recording-list

    ```
        using System;
        using System.Threading.Tasks;
        using static RecordingsList;

        var recordingsListObject = new RecordingsList("Local"); // 'Dropbox'/'Local'/'Custom'
        var recordingsListResponse = await apiService.RecordingsList<RecordingsListResponse>(token, recordingsListObject);
        if (recordingsListResponse.success == true)
            Console.WriteLine($"Recording List Success Response value: dropbox_recordings: {recordingsListResponse.dropbox_recordings}, meethour_recordings: {recordingsListResponse.meethour_recordings}, custom_recordings: {recordingsListResponse.custom_recordings}, total_pages: {recordingsListResponse.total_pages} and total_records: {recordingsListResponse.total_records}");
        else
            Console.WriteLine($"Recording List Error Response Code:{recordingsListResponse.code} and Message: {recordingsListResponse.message}");
        Console.ReadKey();

    ```
