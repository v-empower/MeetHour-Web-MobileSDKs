namespace MeethourExample_Asp.Cs
{
public class AccessToken
{
    private readonly ILogger<AccessToken> _logger;

    public AccessToken(ILogger<AccessToken> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public async Task<string> GetAccessToken()
    {
        try
        {
            // Example code to get the access token from an external service
            var tokenService = new Index();
            var access_token = await tokenService.GetAccessToken();

            if (access_token != null)
            {
                return access_token;
            }
            else
            {
                throw new Exception("Failed to retrieve the access token");
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, "An error occurred while retrieving the access token.");
            throw; // Re-throw the exception to propagate it further
        }
    }
}
}
