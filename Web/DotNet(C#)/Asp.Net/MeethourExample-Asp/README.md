# MeetHour-Asp.Net-Example

![Alt text](logo.png)

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

### Composer package (Packagist) (Latest version - 1.0.1)

```
    need to add latest version of package link

```

![Alt text](screenshot.png)

# MeetHour SDK Implementation - Steps

1. SDK Example Link - need to add sdk github link
2. API Documentation Link - https://docs.v-empower.com/docs/MeetHour-API/

## SDK setup

1. Click on the add
2. Select Project Reference
3. Select the sdk file and click ok

### Steps to run the Example

1. Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial. 
2. Go to the dashboard and then click on developers menu. 
3. Later go to constants.php and enter all the credentials of database and Meet Hour credentials as well. 
4. On Home page Click on Get Access Token 
5. Then Try Schedule a Meeting & Join Meeting. 

### Usage

Provide your credentials in the constructor of Login object and hit the login api to get your access token. Which will further be used for making rest of the api calls.

```

    //program.cs
        
        using Microsoft.AspNetCore.Hosting;
        namespace ASPDocMeethour
        {
            public class Program
            {
                public static void Main(string[] args)
                {
                    CreateHostBuilder(args).Build().Run();
                }
                public static IHostBuilder CreateHostBuilder(string[] args) =>
                    Host.CreateDefaultBuilder(args)
                        .ConfigureWebHostDefaults(webBuilder =>
                        {
                            webBuilder.UseStartup<Startup>();
                        });
            }
        }

    // Startup.cs

        using ASPDocMeethour.Controllers;
        using Microsoft.AspNetCore.Builder;
        using Microsoft.AspNetCore.Hosting;
        using Microsoft.Extensions.Configuration;
        using Microsoft.Extensions.DependencyInjection;
        using Microsoft.Extensions.Hosting;
        
        namespace ASPDocMeethour
        {
            public class Startup
            {
                public Startup(IConfiguration configuration)
                {
                    Configuration = configuration;
                }
        
                public IConfiguration Configuration { get; }
        
                // This method gets called by the runtime. Use this method to add services to the container.
                public void ConfigureServices(IServiceCollection services)
                {
                    services.AddRazorPages(options =>
                    {
                        options.Conventions.AddPageRoute("/Views/Home/Index", "");
                    });
                    services.AddSession();
                    services.AddSingleton<HomeController>();
                    services.AddControllersWithViews();
                    // Other service configurations...
                }
        
                // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
                public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
                {
                    if (env.IsDevelopment())
                    {
                        app.UseDeveloperExceptionPage();
                    }
                    else
                    {
                        app.UseExceptionHandler("/Home/Error");
                        app.UseHsts();
                    }
        
                    app.UseHttpsRedirection();
                    app.UseStaticFiles();
                    app.UseSession();
                    app.UseRouting();
        
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapRazorPages();
                        endpoints.MapControllerRoute(
                            name: "default",
                            pattern: "{controller=Home}/{action=Index}/{id?}");
                    });
                }
            }
        }

    // Homecontroller.cs 
        
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.Extensions.Caching.Memory;
        using Microsoft.Extensions.Logging;
        using System.Text.Json;
        using System.Threading.Tasks;
        using static System.Runtime.InteropServices.JavaScript.JSType;
        
        namespace ASPDocMeethour.Controllers
        {
            public class HomeController : Controller
            {
                private readonly IMemoryCache _memoryCache;
                private readonly ILogger<HomeController> _logger;
        
                public HomeController(IMemoryCache memoryCache, ILogger<HomeController> logger)
                {
                    _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
                    _logger = logger;
                }
        
                [HttpGet]
                [HttpPost]
                public async Task<IActionResult> IndexAsync()
                {
                    // Here need to change the developer credentials to your own credentials

                    const string CLIENT_ID = "CLIENT_ID";            // Change CLIENT_ID to your own meethour developer credentials
                    const string CLIENT_SECRET = "CLIENT_SECRET";   // Change CLIENT_SECRET to your own meethour developer credentials
                    const string EMAIL = "EMAIL";                  // Change EMAIL to your own meethour developer credentials
                    const string PASSWORD = "PASSWORD";           // Change PASSWORD to your own meethour developer credentials
                    const string GRANT_TYPE = "password";
                    const string API_KEY = "API_KEY";            // Change API_KEY to your own meethour developer credentials
                    const string API_RELEASE = "v2.4.6";
                    const string CONFERENCE_URL = "meethour.io";
                    
                    //Login

                    var apiService = new MHApiService();
                    var loginObject = new Login(CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD);
                    var response = await apiService.Login<Login>(loginObject);
                    var token = response.access_token;
                    
                    //Need to change the meeting details accordingly for meetingname,passcode,timezone,meetingdate,meetingtime,meetingmeridian.

                    string meetingname = "meetingname"; 
                    string passcode = "passcode";
                    string timezone = "timezone";
                    string meetingDate = "meetingDate";
                    string meetingTime = "meetingTime";
                    string meetingMeridian = "meetingMeridian";
                    int SendCalendarInvite = 1;
                    bool IsShowPortal = true;
                    string DefaultRecordingStorage = "Local";
                    
                    //ScheduleMeeting

                    var scheduleMeetingObject = new ScheduleMeeting(meetingname, passcode, timezone, meetingDate, meetingTime, meetingMeridian, SendCalendarInvite, IsShowPortal, DefaultRecordingStorage);
                    var scheduleMeetingResponse = await apiService.ScheduleMeeting<ScheduleMeetingResponse>(token, scheduleMeetingObject);
                    dynamic x = scheduleMeetingResponse.data;
        
                    var meeting_id = "";
                    var pcode = "";
                    if (x?.ValueKind != null)
                    {
                        meeting_id = x?.GetProperty("meeting_id").ToString();
                        pcode = x?.GetProperty("pcode").ToString();
                    }
                    
                    //ViewMeeting

                    var viewMeetingsObject = new ViewMeeting(meeting_id);
                    var viewMeetingsResponse = await apiService.ViewMeeting<ViewMeetingResponse>(token, viewMeetingsObject);
                    var responseJson = JsonSerializer.Serialize(viewMeetingsResponse);
                    
                    //Genteratejwt

                    var generateJwtObject = new GenerateJwt(meeting_id);
                    var generateJwtResponse = await apiService.GenerateJwt<GenerateJwtResponse>(token, generateJwtObject);
                    var JwtToken = generateJwtResponse;
        
                    var context = new
                    {
                        MeetingId = meeting_id,
                        JwtToken = JwtToken,
                        PCode = pcode,
                        ApiKey = API_KEY,
                        ApiRelease = API_RELEASE,
                        ConferenceUrl = CONFERENCE_URL
                    };
        
                    ViewBag.meeting_id = meeting_id;
                    ViewBag.jwt_token = JwtToken;
                    ViewBag.pcode = pcode;
                    ViewBag.API_KEY = API_KEY;
                    ViewBag.API_RELEASE = API_RELEASE;
                    ViewBag.CONFERENCE_URL = CONFERENCE_URL;
                    ViewBag.Context = context;
        
                    return View();
                }
            }
        }

    //Index.cshtml

        @page

        @{
        
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
        
                <script type="text/javascript" src="https://api.meethour.io/libs/v2.4.6/external_api.min.js?apiKey=API_KEY"></script>
            <div class="relative" id="conference-parent"></div>
            <script type="text/javascript">
                try {
        
                        const conferencePanel = document.createElement("div");
                        conferencePanel.setAttribute("id", "conference");
                        conferencePanel.setAttribute("style", "height: 100%;");
                        const meetingPanel = document.querySelector("#conference-parent");
                        meetingPanel.appendChild(conferencePanel);
        
                        var domain = "@ViewBag.CONFERENCE_URL";
                        var options = {
                            roomName: "@ViewBag.meeting_id",
                            parentNode: document.querySelector("#conference"),
                            jwt: "@ViewBag.jwt_token",
                            apiKey: "@ViewBag.API_KEY",
                            pcode: "@ViewBag.pcode",
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
        
        }


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

        var loginObject = new Login("CLIENT_ID", "CLIENT_SECRET", "GRANT_TYPE", "EMAIL", "PASSWORD"); //Need to add your own developer credentials
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
        
        //Add meeting details acccordingly

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

        var generateJwtObject = new GenerateJwt("meeting_id");  // change the meeting_id 
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

        var RefreshTokenObject = new RefreshToken("CLIENT_ID","CLIENT_SECRET","access_token");  //change to your own developer credentials and accesstoken that generated while login
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

        var addContactObject = new AddContact("EMAIL","Fristname","lastname","phone","country_code ","Image","1"); //need to change the values
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

   ````
        using System;
        using System.Threading.Tasks;
        using static EditContact;

        var editContactObject = new EditContact("id","country_code ", "EMAIL","Fristname","lastname","phone","Image","1");  //need to change the values
        var editContactResponse = await apiService.EditContact<EditContactResponse>(token, editContactObject);
        if (editContactResponse.success == true)
            Console.WriteLine($"Edit Contact Success Response value: data: {editContactResponse.data}");
        else
            Console.WriteLine($"Edit Contact Error Response Code:{editContactResponse.code} and Message: {editContactResponse.message}");
        Console.ReadKey();

   ````

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
         
        var archiveMeetingsObject = new ArchiveMeetings("Id");   //need to change the values
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

        var editMeetingObject = new EditMeeting("meeting_id");   //need to change the values
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

        var viewMeetingsObject = new ViewMeeting("meeting_id");      //need to change the values
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


Join Meeting via Javascript SDK
        <script src="https://api.meethour.io/libs/v2.4.6/external_api.min.js?apiKey=f6282h82729080282928298"></script>

api = new MeetHourExternalAPI(domain, options)
Config & User Interface Settings Parameters - Parameters - https://docs.v-empower.com/docs/MeetHour-API/281f2d9a6c539-generate-jwt

The next step for embedding Meet Hour is to create the Meet Hour API object. Its constructor gets a number of options:

domain: domain used to build the conference URL, 'meethour.io' for example.
options: object with properties - the optional arguments:
roomName: (required) name of the room to join.
apiKey: (required). You will get API key from your Developer Page - https://portal.meethour.io/customer/developers. Make sure you are on our Developer or higher plan. - https://meethour.io/#pricing
jwt: (required - If you to start meeting or join or moderator) - https://docs.v-empower.com/docs/MeetHour-API/b3A6MzcwODk5MTQ-generate-jwt
pcode: (optional) Pass encrypted Meeting Password dynamically. Get this from API.
width: (optional) width for the iframe which will be created. If a number is specified it's treated as pixel units. If a string is specified the format is number followed by 'px', 'em', 'pt' or '%'.
height: (optional) height for the iframe which will be created. If a number is specified it's treated as pixel units. If a string is specified the format is number followed by 'px', 'em', 'pt' or '%'.
parentNode: (optional) HTML DOM Element where the iframe will be added as a child.
noSSL: (optional, defaults to true) Boolean indicating if the server should be contacted using HTTP or HTTPS.
onload: (optional) handler for the iframe onload event.
invitees: (optional) Array of objects containing information about new participants that will be invited in the call.
devices: (optional) A map containing information about the initial devices that will be used in the call.
userInfo: (optional) JS object containing information about the participant opening the meeting, such as email.

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
Example:

const domain = 'meethour.io';
const options = {
    roomName: 'MeetHourExternalAPI',
    width: 700,
    height: 700,
    parentNode: document.querySelector('#meet')
};
const api = new MeetHourExternalAPI(domain, options);
You can set the initial media devices for the call:

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

You can overwrite options set in [config.js] and [interface_config.js]. For example, to enable the filmstrip-only interface mode, you can use:

const options = {
    ...
    interfaceConfigOverwrite: { filmStripOnly: true },
    ...
};
const api = new MeetHourExternalAPI(domain, options);

You can also pass a jwt token to Meet Hour:

const options = {
   ...
   jwt: '<jwt_token>',
   noSsl: false,
   ...
};
const api = new MeetHourExternalAPI(domain, options);
You can set the userInfo(email, display name) for the call:

var domain = "meethour.io";
var options = {
    ...
    userInfo: {
        email: 'email@meethourexamplemail.com',
        displayName: 'John Doe'
    }
}
var api = new MeetHourExternalAPI(domain, options);
Controlling the embedded Meet Hour Conference
Device management MeetHourExternalAPI methods:

getAvailableDevices - Retrieve a list of available devices.
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
getCurrentDevices - Retrieve a list with the devices that are currently selected.
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
isDeviceChangeAvailable - Resolves with true if the device change is available and with false if not.
// The accepted deviceType values are - 'output', 'input' or undefined.
api.isDeviceChangeAvailable(deviceType).then(isDeviceChangeAvailable => {
    ...
});
isDeviceListAvailable - Resolves with true if the device list is available and with false if not.
api.isDeviceListAvailable().then(isDeviceListAvailable => {
    ...
});
isMultipleAudioInputSupported - Resolves with true if multiple audio input is supported and with false if not.
api.isMultipleAudioInputSupported().then(isMultipleAudioInputSupported => {
    ...
});
setAudioInputDevice - Sets the audio input device to the one with the label or id that is passed.
api.setAudioInputDevice(deviceLabel, deviceId);
setAudioOutputDevice - Sets the audio output device to the one with the label or id that is passed.
api.setAudioOutputDevice(deviceLabel, deviceId);
setVideoInputDevice - Sets the video input device to the one with the label or id that is passed.
api.setVideoInputDevice(deviceLabel, deviceId);
You can control the embedded Meet Hour conference using the MeetHourExternalAPI object by using executeCommand:

api.executeCommand(command, ...arguments);
The command parameter is String object with the name of the command. The following commands are currently supported:

displayName - Sets the display name of the local participant. This command requires one argument - the new display name to be set.
api.executeCommand('displayName', 'New Nickname');
password - Sets the password for the room. This command requires one argument - the password name to be set.
api.executeCommand('password', 'The Password');
sendTones - Play touch tones.
api.executeCommand('sendTones', {
    tones: string, // The dial pad touch tones to play. For example, '12345#'.
    duration: number, // Optional. The number of milliseconds each tone should play. The default is 200.
    pause: number // Optional. The number of milliseconds between each tone. The default is 200.
});
subject - Sets the subject of the conference. This command requires one argument - the new subject to be set.
api.executeCommand('subject', 'New Conference Subject');
toggleAudio - Mutes / unmutes the audio for the local participant. No arguments are required.
api.executeCommand('toggleAudio');
toggleVideo - Mutes / unmutes the video for the local participant. No arguments are required.
api.executeCommand('toggleVideo');
toggleFilmStrip - Hides / shows the filmstrip. No arguments are required.
api.executeCommand('toggleFilmStrip');
toggleChat - Hides / shows the chat. No arguments are required.
api.executeCommand('toggleChat');
toggleShareScreen - Starts / stops screen sharing. No arguments are required.
api.executeCommand('toggleShareScreen');
toggleTileView - Enter / exit tile view layout mode. No arguments are required.
api.executeCommand('toggleTileView');
hangup - Hangups the call. No arguments are required.
api.executeCommand('hangup');
email - Changes the local email address. This command requires one argument - the new email address to be set.
api.executeCommand('email', 'example@example.com');
avatarUrl - Changes the local avatar URL. This command requires one argument - the new avatar URL to be set.
api.executeCommand('avatarUrl', 'https://avatars0.githubusercontent.com/u/3671647');
sendEndpointTextMessage - Sends a text message to another participant through the datachannels.
api.executeCommand('receiverParticipantId', 'text');
setVideoQuality - Sets the send and receive video resolution. This command requires one argument - the resolution height to be set.
api.executeCommand('setVideoQuality', 720);
You can also execute multiple commands using the executeCommands method:

api.executeCommands(commands);
The commands parameter is an object with the names of the commands as keys and the arguments for the commands as values:

api.executeCommands({
    displayName: [ 'nickname' ],
    toggleAudio: []
});
You can add event listeners to the embedded Meet Hour using the addEventListener method. NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods (addListener or on).

api.addEventListener(event, listener);
The event parameter is a String object with the name of the event. The listener parameter is a Function object with one argument that will be notified when the event occurs with data related to the event.

The following events are currently supported:

cameraError - event notifications about meethour-Meet having failed to access the camera. The listener will receive an object with the following structure:
{
    type: string, // A constant representing the overall type of the error.
    message: string // Additional information about the error.
}
avatarChanged - event notifications about avatar changes. The listener will receive an object with the following structure:
{
    id: string, // the id of the participant that changed his avatar.
    avatarURL: string // the new avatar URL.
}
audioAvailabilityChanged - event notifications about audio availability status changes. The listener will receive an object with the following structure:
{
    available: boolean // new available status - boolean
}
audioMuteStatusChanged - event notifications about audio mute status changes. The listener will receive an object with the following structure:
{
    muted: boolean // new muted status - boolean
}
endpointTextMessageReceived - event notifications about a text message received through datachannels. The listener will receive an object with the following structure:
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
micError - event notifications about meethour-Meet having failed to access the mic. The listener will receive an object with the following structure:
{
    type: string, // A constant representing the overall type of the error.
    message: string // Additional information about the error.
}
screenSharingStatusChanged - receives event notifications about turning on/off the local user screen sharing. The listener will receive object with the following structure:
{
    on: boolean, //whether screen sharing is on
    details: {

        // From where the screen sharing is capturing, if known. Values which are
        // passed include 'window', 'screen', 'proxy', 'device'. The value undefined
        // will be passed if the source type is unknown or screen share is off.
        sourceType: string|undefined
    }
}
dominantSpeakerChanged - receives event notifications about change in the dominant speaker. The listener will receive object with the following structure:
{
    id: string //participantId of the new dominant speaker
}
tileViewChanged - event notifications about tile view layout mode being entered or exited. The listener will receive object with the following structure:
{
    enabled: boolean, // whether tile view is not displayed or not
}
incomingMessage - Event notifications about incoming messages. The listener will receive an object with the following structure:
{
    from: string, // The id of the user that sent the message
    nick: string, // the nickname of the user that sent the message
    message: string // the text of the message
}
outgoingMessage - Event notifications about outgoing messages. The listener will receive an object with the following structure:
{
    message: string // the text of the message
}
displayNameChange - event notifications about display name changes. The listener will receive an object with the following structure:
{
    id: string, // the id of the participant that changed his display name
    displayname: string // the new display name
}
deviceListChanged - event notifications about device list changes. The listener will receive an object with the following structure:
{
    devices: Object // the new list of available devices.
}
NOTE: The devices object has the same format as the getAvailableDevices result format.

emailChange - event notifications about email changes. The listener will receive an object with the following structure:
{
    id: string, // the id of the participant that changed his email
    email: string // the new email
}
feedbackSubmitted - event notifications about conference feedback submission
{
    error: string // The error which occurred during submission, if any.
}
filmstripDisplayChanged - event notifications about the visibility of the filmstrip being updated.
{
    visible: boolean // Whether or not the filmstrip is displayed or hidden.
}
participantJoined - event notifications about new participants who join the room. The listener will receive an object with the following structure:
{
    id: string, // the id of the participant
    displayName: string // the display name of the participant
}
participantKickedOut - event notifications about a participants being removed from the room. The listener will receive an object with the following structure:
{
    kicked: {
        id: string, // the id of the participant removed from the room
        local: boolean // whether or not the participant is the local particiapnt
    },
    kicker: {
        id: string // the id of the participant who kicked out the other participant
    }
}
participantLeft - event notifications about participants that leave the room. The listener will receive an object with the following structure:
{
    id: string // the id of the participant
}
participantRoleChanged - event notification fired when the role of the local user has changed (none, moderator, participant). The listener will receive an object with the following structure:
{
    id: string // the id of the participant
    role: string // the new role of the participant
}
passwordRequired - event notifications fired when failing to join a room because it has a password.

videoConferenceJoined - event notifications fired when the local user has joined the video conference. The listener will receive an object with the following structure:

{
    roomName: string, // the room name of the conference
    id: string, // the id of the local participant
    displayName: string, // the display name of the local participant
    avatarURL: string // the avatar URL of the local participant
}
videoConferenceLeft - event notifications fired when the local user has left the video conference. The listener will receive an object with the following structure:
{
    roomName: string // the room name of the conference
}
videoAvailabilityChanged - event notifications about video availability status changes. The listener will receive an object with the following structure:
{
    available: boolean // new available status - boolean
}
videoMuteStatusChanged - event notifications about video mute status changes. The listener will receive an object with the following structure:
{
    muted: boolean // new muted status - boolean
}
readyToClose - event notification fired when Meet Hour is ready to be closed (hangup operations are completed).

subjectChange - event notifications about subject of conference changes. The listener will receive an object with the following structure:

{
    subject: string // the new subject
}
suspendDetected - event notifications about detecting suspend event in host computer.
You can also add multiple event listeners by using addEventListeners. This method requires one argument of type Object. The object argument must have the names of the events as keys and the listeners of the events as values. NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods.

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
If you want to remove a listener you can use removeEventListener method with argument the name of the event. NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods( removeListener).

api.removeEventListener('incomingMessage');
If you want to remove more than one event you can use removeEventListeners method with an Array with the names of the events as an argument. NOTE: This method still exists but it is deprecated. MeetHourExternalAPI class extends [EventEmitter]. Use [EventEmitter] methods.

api.removeEventListeners([ 'incomingMessage', 'outgoingMessageListener' ]);
You can get the number of participants in the conference with the following API function:

const numberOfParticipants = api.getNumberOfParticipants();
You can get the avatar URL of a participant in the conference with the following API function:

const avatarURL = api.getAvatarURL(participantId);
You can get the display name of a participant in the conference with the following API function:

const displayName = api.getDisplayName(participantId);
You can get the email of a participant in the conference with the following API function:

const email = api.getEmail(participantId);
You can get the iframe HTML element where Meet Hour is loaded with the following API function:

const iframe = api.getIFrame();
You can check whether the audio is muted with the following API function:

api.isAudioMuted().then(muted => {
    ...
});
You can check whether the video is muted with the following API function:

api.isVideoMuted().then(muted => {
    ...
});
You can check whether the audio is available with the following API function:

api.isAudioAvailable().then(available => {
    ...
});
You can check whether the video is available with the following API function:

api.isVideoAvailable().then(available => {
    ...
});
You can invite new participants to the call with the following API function:

api.invite([ {...}, {...}, {...} ]).then(() => {
    // success
}).catch(() => {
    // failure
});



## Continous integration

### GitHub Actions
Tests are run whenever there is a commit, see `.github/workflows/test.py` for details.

### Code coverage
Enable code coverage reporting to [Codecov](https://codecov.io/) by creating a secret with name `CODECOV_TOKEN` in your repository settings (Settings -> Secrets -> New sectret) and value set to the token created by Codecov.
