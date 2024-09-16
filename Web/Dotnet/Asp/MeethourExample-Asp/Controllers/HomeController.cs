using MeethourExample_Asp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Index = MeethourExample_Asp.Cs.Index;
using System.Text.Json;
using MeethourExample_Asp.Cs;
using Microsoft.AspNetCore.Mvc.Routing;
using System.Globalization;
using Microsoft.Extensions.Options;
using System;

namespace MeethourExample_Asp.Controllers {
public class HomeController : Controller {
  private readonly IMemoryCache _memoryCache;
  private readonly Index _index;
  private readonly ILogger<HomeController> _logger;

  public HomeController(Index index, IMemoryCache memoryCache,
                        ILogger<HomeController> logger) {
    _index = index ?? throw new ArgumentNullException(nameof(index));
    _memoryCache =
        memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
    _logger = logger ?? throw new ArgumentNullException(nameof(logger));
  }

  public object Session { get; private set; }

  [HttpGet]
  [HttpPost]
  public async Task<IActionResult> IndexAsync() {
    string? accessToken = null;
    try {
      if (Request.Method == "POST") {
        string? getAccessTokenValue = Request.Form["getaccesstoken"];

        if (getAccessTokenValue == "true") {
          // Create an instance of AccessToken
          var accessTokenService = new Index();

          // Call the GetAccessToken method on the instance
          accessToken = await accessTokenService.GetAccessToken();

          if (accessToken != null) {
            _memoryCache.Set("access_token", accessToken,
                             TimeSpan.FromMinutes(30));
          }
        }
      }
    } catch (Exception e) {
      // Log the exception
      _logger.LogError(e, "An error occurred while processing the request in " +
                              "the Index method.");
      return StatusCode(500, "An error occurred while processing your " +
                                 "request. Please try again later.");
    }

    // Populate HeaderViewModel and ErrorViewModel with relevant data
    var headerModel = new HeaderViewModel {
      LogoImageUrl = "https://meethour.io/images/logo.SVG",
      HomeUrl = Url.Action("Index", "Home"),
      ScheduleMeetingUrl = Url.Action("ScheduleMeeting", "ScheduleMeeting"),
      JoinMeetingUrl = Url.Action("JoinMeeting", "JoinMeeting")
      // Set other properties as needed
    };

    var errorModel = new ErrorViewModel {
      Error = true,             // Set based on your error condition
      AccessToken = accessToken // Set based on your logic
    };

    var combinedViewModel = new CombinedViewModel { headerModel = headerModel,
                                                    errorModel = errorModel

    };

    // Check if combinedViewModel is null before passing it to the view
    if (combinedViewModel != null) {
      return View("~/Views/Home/Index.cshtml",
                  combinedViewModel); // Pass the model to the view
    } else {
      return NotFound(); // Or return another appropriate response
    }
  }
}
}
