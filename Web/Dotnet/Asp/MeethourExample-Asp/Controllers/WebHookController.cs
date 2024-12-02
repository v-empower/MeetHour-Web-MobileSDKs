using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using meethour.webhook;

namespace MeethourExample_Asp.Controllers {

    [Route("[controller]")]
    public class WebHookController : Controller {
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<WebHookController> _logger;

public WebHookController( IMemoryCache memoryCache, ILogger<WebHookController> logger) {
    if (memoryCache == null) {
        throw new ArgumentNullException(nameof(memoryCache));
    }
    _memoryCache = memoryCache;

    if (logger == null) {
        throw new ArgumentNullException(nameof(logger));
    }
    _logger = logger;
}


    public object Session { get; private set; }

        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> WebHooks()
        {
            bool error = false;
            string? message = null;
            string secretKey = Constants.DeveloperCredentials.SECRET_KEY_WEB_HOOKS;

            var accessToken = _memoryCache.Get<string>("access_token");

            var webHookObject = new WebhookHandler(secretKey);
            string requestBody;
            using (StreamReader reader = new StreamReader(HttpContext.Request.Body))
            {
                requestBody = await reader.ReadToEndAsync(); // Ensure asynchronous reading
            }
            var headers = HttpContext.Request.Headers;
            var headersDictionary = headers.ToDictionary(header => header.Key, header => header.Value.ToString());

            try
            {
                var result = webHookObject.HandleRequest(requestBody, headersDictionary);
                Console.WriteLine("WebHook trigger request acknowledged!");
                PrintDictionary(result);
                return Ok(result); // Returning Ok with the result
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling webhook request");
                return StatusCode(500, "Internal server error");
            }

        }

        static void PrintDictionary(Dictionary<string, object> dict, string indent = "") 
        { 
            foreach (var kvp in dict) 
            { 
                if (kvp.Value is Dictionary<string, object> nestedDict)
                    { 
                        Console.WriteLine($"{indent}{kvp.Key}:");
                        PrintDictionary(nestedDict, indent + " ");
                    } 
                    else 
                    { 
                        Console.WriteLine($"{indent}{kvp.Key}: {kvp.Value}"); }
                    }
        }

        
    }
}
