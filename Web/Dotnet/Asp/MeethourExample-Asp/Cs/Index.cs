using System;
using System.Threading.Tasks;

namespace MeethourExample_Asp.Cs {
public class Index {
  // Constants
  private string CLIENT_ID = Constants.DeveloperCredentials.CLIENT_ID;
  private string CLIENT_SECRET = Constants.DeveloperCredentials.CLIENT_SECRET;
  private string EMAIL = Constants.DeveloperCredentials.EMAIL;
  private string PASSWORD = Constants.DeveloperCredentials.PASSWORD;
  private string GRANT_TYPE = Constants.ApiConstants.GRANT_TYPE;

  // Get access token
  public async Task<string> GetAccessToken() {
    var loginObject =
        new Login(CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD);
    var apiService = new MHApiService();
    var response = await apiService.Login<Login>(loginObject);

    if (response != null && !string.IsNullOrEmpty(response.access_token)) {
      return response.access_token;
    } else {
      throw new Exception("Failed to retrieve the access token");
    }
  }
}
}
