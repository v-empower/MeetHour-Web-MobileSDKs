using System.Globalization;
using System.Text.Json;
using MeethourExample_Asp.Controllers;
using MeethourExample_Asp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;
using MeethourExample_Asp.Cs;
using MeethourExample_Asp;

namespace JoinMeeting.Controllers {
public class Host {
    [JsonPropertyName("id")]
    public int Id {
        get;
        set;
    }

    [JsonPropertyName("email")]
    public string Email {
        get;
        set;
    }

    [JsonPropertyName("first_name")]
    public string FirstName {
        get;
        set;
    }

    [JsonPropertyName("last_name")]
    public string LastName {
        get;
        set;
    }

    [JsonPropertyName("phone")]
    public string Phone {
        get;
        set;
    }

    [JsonPropertyName("country_code")]
    public string CountryCode {
        get;
        set;
    }
}

public class JoinMeetingController : Controller {
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<JoinMeetingController> _logger;

    public JoinMeetingController(IMemoryCache memoryCache,
                                 ILogger<JoinMeetingController> logger) {
        _memoryCache =
            memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
        _logger = logger;
    }

    // Constants
    private string API_KEY = Constants.DeveloperCredentials.API_KEY;
    private string API_RELEASE = Constants.ApiConstants.API_RELEASE;
    private string CONFERENCE_URL = Constants.ApiConstants.CONFERENCE_URL;

    [HttpGet]
    [HttpPost]

    public async Task<IActionResult> JoinMeeting(string meeting_id,
            string pcode) {
        string jwt_token = null;
        dynamic meeting_attendees = null;
        bool success = false;
        bool error = false;
        string message = null;
        var AccessToken = _memoryCache.Get<string>("access_token");

        try {

            if (AccessToken == null) {
                throw new Exception("Access token is null. Please ensure you have a " +
                                    "valid access token.");
            }

            if (Request.Method == "POST") {
                var generateJwtObject = new GenerateJwt(meeting_id);
                var apiService = new MHApiService(); // Instantiate your MHApiService
                var JwtResponse = await apiService.GenerateJwt<GenerateJwtResponse>(
                                      AccessToken, generateJwtObject);

                if (JwtResponse.success && JwtResponse.jwt != null) {
                    jwt_token = JwtResponse.jwt;
                    success = true;
                } else {
                    error = true;
                    message = "Error in Generating JWT Token \n" +
                              JsonSerializer.Serialize(JwtResponse);
                }
            } else if (Request.Method == "GET") {
                if (!string.IsNullOrEmpty(meeting_id)) {
                    var viewMeetingsObject = new ViewMeeting(meeting_id);
                    var apiService = new MHApiService();
                    var ViewMeetingResponse =
                        await apiService.ViewMeeting<ViewMeetingResponse>(
                            AccessToken, viewMeetingsObject);

                    var responseJson = JsonSerializer.Serialize(ViewMeetingResponse);
                    _logger.LogInformation(
                        "Serialized ViewMeetingResponse: {responseJson}", responseJson);

                    using (JsonDocument doc = JsonDocument.Parse(responseJson)) {
                        JsonElement root = doc.RootElement;
                        root.TryGetProperty("meeting", out JsonElement meetingElement);

                        object hosts = null;
                        object attendee = null;
                        object organizer = null;

                        // Extract and check properties
                        if (meetingElement.TryGetProperty("pcode",
                                                          out JsonElement pcodeProperty)) {
                            pcode = pcodeProperty.ToString();
                        } else {
                            _logger.LogError("pcode not found in ViewMeetingResponse. " +
                                             "JSON: {responseJson}");
                        }

                        if (meetingElement.TryGetProperty("hosts", out var hostsProperty)) {

                            try {
                                if (hostsProperty.ValueKind ==
                                        System.Text.Json.JsonValueKind.Array) {
                                    var users = JsonSerializer.Deserialize<List<object>>(
                                                    hostsProperty.ToString());
                                    var b = users[0];
                                    var yourObject =
                                        System.Text.Json.JsonDocument.Parse(b.ToString());
                                    var id = yourObject.RootElement.GetProperty("id");
                                    var name = yourObject.RootElement.GetProperty("first_name");
                                    var email = yourObject.RootElement.GetProperty("email");
                                    // var sb = new StringBuilder();
                                    // sb.Append("Name: ").Append(name).Append(", Email:
                                    // ").Append(email);
                                    //  hosts = sb.ToString();
                                    hosts = new { id, name, email };
                                } else {
                                    if (root.TryGetProperty("organizer",
                                                            out JsonElement organizersProperty)) {
                                        organizer =
                                            organizersProperty; // organizersProperty.ToString();

                                    } else {
                                        _logger.LogError(
                                            "organizers not found or not a string in " +
                                            "ViewMeetingResponse. JSON: {responseJson}");
                                    }
                                }

                            } catch (Exception ex) {
                                _logger.LogError(
                                    ex, "Error deserializing hosts. JSON: {responseJson}");
                            }
                        } else {
                            _logger.LogError("hosts not found in ViewMeetingResponse. " +
                                             "JSON: {responseJson}");
                        }

                        if (root.TryGetProperty("meeting_attendees",
                                                out var attendeeProperty)) {
                            try {
                                if (attendeeProperty.ValueKind ==
                                        System.Text.Json.JsonValueKind.Array) {
                                    var users = JsonSerializer.Deserialize<List<object>>(
                                                    attendeeProperty.ToString());
                                    var b = users[0];
                                    var yourObject =
                                        System.Text.Json.JsonDocument.Parse(b.ToString());
                                    var id =
                                        yourObject.RootElement.GetProperty("meeting_attendee_id");
                                    var name = yourObject.RootElement.GetProperty("first_name");
                                    var email = yourObject.RootElement.GetProperty("email");
                                    attendee = new { id, name, email };

                                } else {
                                    if (root.TryGetProperty("organizer",
                                                            out JsonElement organizersProperty)) {
                                        organizer = organizersProperty;

                                    } else {
                                        _logger.LogError(
                                            "organizers not found or not a string in " +
                                            "ViewMeetingResponse. JSON: {responseJson}");
                                    }
                                }

                            } catch (Exception ex) {
                                _logger.LogError(ex, "Error deserializing meeting_attendees. " +
                                                 "JSON: {responseJson}");
                            }
                        } else {
                            _logger.LogError("meeting_attendees not found in " +
                                             "ViewMeetingResponse. JSON: {responseJson}");
                        }
                        if (root.TryGetProperty("organizer",
                                                out JsonElement organizerProperty)) {
                            organizer = organizerProperty;

                        } else {
                            _logger.LogError("organizer not found or not a string in " +
                                             "ViewMeetingResponse. JSON: {responseJson}");
                        }

                        // Assign values to meeting_attendees only if all parts are
                        // available
                        if (organizer != null || hosts != null || attendee != null) {
                            meeting_attendees = new { organizer, hosts, attendee };
                        } else {
                            _logger.LogError(
                                "One or more required properties (organizer, hosts, " +
                                "meeting_attendees) are missing or invalid.");
                        }
                    }
                }
            }

            ViewBag.meeting_id = meeting_id;
            ViewBag.meeting_attendees = meeting_attendees;
            ViewBag.jwt_token = jwt_token;
            ViewBag.pcode = pcode;
            ViewBag.API_KEY = API_KEY;
            ViewBag.API_RELEASE = API_RELEASE;
            ViewBag.JwtResponse = _memoryCache.Get<string>("JwtResponse");
            ViewBag.CONFERENCE_URL = CONFERENCE_URL;
            ViewBag.success = success;
            ViewBag.error = error;
            ViewBag.message = message;
            ViewBag.AccessToken = AccessToken;
        } catch (Exception e) {
            error = true;
            message = e.Message;
            _logger.LogError(e, "Error occurred while joining meeting");
        }

        var headerModel = new HeaderViewModel {
            LogoImageUrl = "https://meethour.io/images/logo.SVG",
            HomeUrl = Url.Action("Index", "Home"),
            ScheduleMeetingUrl = Url.Action("ScheduleMeeting", "ScheduleMeeting"),
            JoinMeetingUrl = Url.Action("JoinMeeting", "JoinMeeting")
        };

        var errorModel = new ErrorViewModel { Error = true };

        var JoinMeetingModel = new JoinMeetingResponseViewModel();

        JoinMeetingModel.meeting_id = meeting_id;
        JoinMeetingModel.pcode = pcode;
        JoinMeetingModel.meeting_attendees = meeting_attendees;
        JoinMeetingModel.jwt_token = jwt_token;

        var combinedViewModel =
            new CombinedViewModel { headerModel = headerModel,
                                    errorModel = errorModel,
                                    JoinMeetingModel = JoinMeetingModel
                                  };

        if (combinedViewModel != null) {
            return View("~/Views/Home/JoinMeeting.cshtml", combinedViewModel);
        } else {
            return NotFound();
        }
    }
}
}
