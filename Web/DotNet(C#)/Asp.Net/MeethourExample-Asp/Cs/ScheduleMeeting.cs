using System.Globalization;
using System.Text.Json;
using MeethourExample_Asp.Controllers;
using MeethourExample_Asp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Text;


namespace Schedulemeeting.Controllers
{
public class ScheduleMeetingController : Controller
{
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<HomeController> _logger;
    private object timezones;

    public ScheduleMeetingController( IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
    }

    [HttpGet]
    [HttpPost]
    public async Task<IActionResult> ScheduleMeeting() // Change the return type to Task<IActionResult>
    {
        bool success = false;
        bool error = false;
        string? message = null;
        dynamic? meetingResponse = null;
        dynamic? contactsResponse = null;
        dynamic? timezoneResponse = null;
        string? timezone = null;
        dynamic? timezone_array = null;
        dynamic? contact_array = null;



        try
        {
            var accessToken = _memoryCache.Get<string>("access_token");

            var timeZoneObject = new TimeZone();
            var apiService = new MHApiService();
            timezoneResponse = await apiService.TimeZone<TimeZoneResponse>(accessToken, timeZoneObject); // Await the TimeZone API call

            timezone_array = System.Text.Json.JsonSerializer.Deserialize<object>(timezoneResponse.timezones);

            var methodhttp = Request.Method;
            var contactsObject = new Contact(0, 0, 0);
            apiService = new MHApiService();
            contactsResponse = await apiService.Contact<ContactResponse>(accessToken, contactsObject); // Await the Contact API call

            contact_array = System.Text.Json.JsonSerializer.Deserialize<object>(contactsResponse.contacts);

            if (Request.Method == "POST")
            {
                var instantMeeting = Request.Form["instantmeeting"];
                var scheduleMeeting = Request.Form["schedulemeeting"];
                timezone = Request.Form["timezoneResponse"];
                if (Request.Method == "POST" && !string.IsNullOrEmpty(instantMeeting) && instantMeeting == "true")
                {

                    var scheduleMeetingObject = new ScheduleMeeting("Instant Meeting", "123456789", "Asia/Kolkata", DateTime.Now.ToString("dd-MM-yyyy"), DateTime.Now.ToString("hh:mm"), "PM", 1, true, "Local");
                    apiService = new MHApiService();
                    var response = await apiService.ScheduleMeeting<ScheduleMeetingResponse>(accessToken, scheduleMeetingObject); // Await the ScheduleMeeting API call

                    if (response.success)
                    {
                        meetingResponse = response.data;
                        success = true;

                        // Set the flag to show the popup
                        ViewData["ShowPopup"] = true;
                        ViewData["MeetingDetails"] = meetingResponse;
                    }
                    else
                    {
                        success = false;
                        error = true;
                        message = "Instant Meeting has failed. \n" + JsonSerializer.Serialize(response);
                    }
                }

                else if (!string.IsNullOrEmpty(scheduleMeeting) && scheduleMeeting == "true")
                {
                    var meetingName = Request.Form["meeting_name"];
                    var passcode = Request.Form["passcode"];
                    var meetingDate = Request.Form["meeting_date"];
                    var meetingTime = DateTime.ParseExact(Request.Form["meeting_time"], "HH:mm", CultureInfo.InvariantCulture).ToString("hh:mm");
                    var meetingMeridiem = DateTime.ParseExact(Request.Form["meeting_time"], "HH:mm", CultureInfo.InvariantCulture).ToString("tt");
                    timezone = Request.Form["timezone"];


                    var mySelectParticipants = new List<string>();
                    if (!string.IsNullOrEmpty(Request.Form["mySelectParticipants"]) && Request.Form["mySelectParticipants"] != "0")
                    {
                        mySelectParticipants.Add(Request.Form["mySelectParticipants"]);
                    }

                    var mySelectModerators = new List<string>();
                    if (!string.IsNullOrEmpty(Request.Form["mySelectModerators"]) && Request.Form["mySelectModerators"] != "0")
                    {
                        mySelectModerators.Add(Request.Form["mySelectModerators"]);
                    }

                    var scheduleMeetingObject = new ScheduleMeeting(
                        meetingName, passcode, timezone, meetingDate, meetingTime,
                        meetingMeridiem, sendCalendarInvite: 1, isShowPortal: true,
                        attend: mySelectParticipants, hostUsers: mySelectModerators, options: new[] { "ALLOW_GUEST" }, defaultRecordingStorage: "Local");
                    apiService = new MHApiService();
                    var ScheduleResponse = apiService.ScheduleMeeting<ScheduleMeetingResponse>(accessToken, scheduleMeetingObject);

                    if (ScheduleResponse.Result.success==true)
                    {
                        meetingResponse = ScheduleResponse.Result.data;
                        success = true;
                    }
                    else
                    {
                        success = false;
                        error = true;
                        message = "Scheduling Meeting has failed. \n" + JsonSerializer.Serialize(ScheduleResponse);
                    }
                }
                else
                {
                    error = true;
                    message = "Something went wrong. Make sure you post the true value in getaccesstoken";
                }
            }
        }
        catch (Exception e)
        {
            error = true;
            message = e.Message;
        }



        ViewData["success"] = success;
        ViewData["error"] = error;
        ViewData["message"] = message;
        ViewData["access_token"] = HttpContext.Session.GetString("access_token");
        ViewData["MeetingResponse"] = meetingResponse;
        ViewData["ContactsResponse"] = contactsResponse;
        ViewData["timezone_response"] = timezoneResponse?.timezones;
        ViewData["contacts_response"] = contactsResponse?.contacts;

        var headerModel = new HeaderViewModel
        {
            LogoImageUrl = "https://meethour.io/images/logo.SVG",
            HomeUrl = Url.Action("Index", "Home"),
            ScheduleMeetingUrl = Url.Action("ScheduleMeeting", "ScheduleMeeting"),
            JoinMeetingUrl = Url.Action("JoinMeeting", "JoinMeeting")
            // Set other properties as needed
        };

        var errorModel = new ErrorViewModel
        {
            Error = true, // Set based on your error condition
        };

        var MeetingModel = new MeetingResponseViewModel();

        if (meetingResponse?.ValueKind != null)
        {

            MeetingModel.MeetingId = meetingResponse?.GetProperty("meeting_id") ?? "";
            MeetingModel.Passcode = meetingResponse?.GetProperty("passcode") ?? "";
            MeetingModel.JoinURL = meetingResponse?.GetProperty("joinURL") ?? "";
            MeetingModel.pcode = meetingResponse?.GetProperty("pcode") ?? "";
        }

        var contactModel = new ContactResponseViewModel();
        contactModel.contacts = contact_array;

        var timeZoneModel = new TimezoneResponseViewModel();
        timeZoneModel.timeZones = timezone_array;

        var combinedViewModel = new CombinedViewModel
        {
            headerModel = headerModel,
            errorModel = errorModel,
            MeetingModel = MeetingModel,
            contactModel = contactModel,
            timeZoneModel = timeZoneModel

        };

        if (combinedViewModel != null)
        {
            return View("~/Views/Home/ScheduleMeeting.cshtml", combinedViewModel);    // Pass the model to the view
        }
        else
        {
            return NotFound(); // Or return another appropriate response
        }
    }
}
}