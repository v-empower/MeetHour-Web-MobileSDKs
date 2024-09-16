using System.Text.Json;

namespace MeethourExample_Asp.Models {
public class JoinMeetingResponseViewModel {
  public string? meeting_id { get; set; }
  public dynamic? meeting_attendees { get; set; }
  public string? jwt_token { get; set; }
  public string? organizer { get; set; }
  public string? pcode { get; set; }
  public dynamic? JwtResponse { get; set; }
  public bool? Success { get; set; }
  public bool? Error { get; set; }
  public string? Message { get; set; }
  public string? AccessToken { get; set; }
}
}
