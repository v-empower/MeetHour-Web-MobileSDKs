namespace MeethourExample_Asp.Models
{
public class ViewResponseViewModel
{
    public class Host
    {
        public int Id {
            get;
            set;
        }
        public string Email {
            get;
            set;
        }
        public string FirstName {
            get;
            set;
        }
        public string LastName {
            get;
            set;
        }
        public string Phone {
            get;
            set;
        }
        public string CountryCode {
            get;
            set;
        }
    }
    public class LivestreamSettings
    {
        public Recording Recording {
            get;
            set;
        }
        public FacebookStreamKey FacebookStreamKey {
            get;
            set;
        }
        public YouTubeStreamKey YouTubeStreamKey {
            get;
            set;
        }
    }
    public class Recording
    {
        public bool Enable {
            get;
            set;
        }
    }
    public class FacebookStreamKey
    {
        public bool Enable {
            get;
            set;
        }
        public string Key {
            get;
            set;
        }
    }
    public class YouTubeStreamKey
    {
        public bool Enable {
            get;
            set;
        }
        public string Key {
            get;
            set;
        }
    }
    public class Settings
    {
        public int AllowGuest {
            get;
            set;
        }
        public int JoinAnytime {
            get;
            set;
        }
        public int EnableLobby {
            get;
            set;
        }
        public int EnableRecording {
            get;
            set;
        }
        public int EnableLivestream {
            get;
            set;
        }
        public int EnableEmbeedMeeting {
            get;
            set;
        }
        public int DonorBox {
            get;
            set;
        }
    }
    public class Meeting
    {
        public int Id {
            get;
            set;
        }
        public int UserId {
            get;
            set;
        }
        public string MeetingId {
            get;
            set;
        }
        public string Topic {
            get;
            set;
        }
        public string Agenda {
            get;
            set;
        }
        public string Passcode {
            get;
            set;
        }
        public string StartTime {
            get;
            set;
        }
        public string Timezone {
            get;
            set;
        }
        public string Duration {
            get;
            set;
        }
        public int IsRecurring {
            get;
            set;
        }
        public string RecurrenceType {
            get;
            set;
        }
        public int RepeatInterval {
            get;
            set;
        }
        public object WeeklyDays {
            get;
            set;
        }
        public object MonthlyDay {
            get;
            set;
        }
        public object MonthlyWeek {
            get;
            set;
        }
        public object MonthlyWeekDay {
            get;
            set;
        }
        public object EndTimes {
            get;
            set;
        }
        public string EndDateTime {
            get;
            set;
        }
        public int TotalOccurrences {
            get;
            set;
        }
        public Settings Settings {
            get;
            set;
        }
        public string Instructions {
            get;
            set;
        }
        public int Status {
            get;
            set;
        }
        public DateTime CreatedAt {
            get;
            set;
        }
        public int EnablePreRegistration {
            get;
            set;
        }
        public object MeetingTopic {
            get;
            set;
        }
        public object MeetingAgenda {
            get;
            set;
        }
        public object MeetingImage {
            get;
            set;
        }
        public List<Host> Hosts {
            get;
            set;
        }
        public int AllowJoinBefore {
            get;
            set;
        }
        public int NoOfInvitees {
            get;
            set;
        }
        public int EnableLobby {
            get;
            set;
        }
        public string IcsId {
            get;
            set;
        }
        public int IsShowPortal {
            get;
            set;
        }
        public int IsClientAppMeeting {
            get;
            set;
        }
        public int SendCalendarInvite {
            get;
            set;
        }
        public string DefaultStorage {
            get;
            set;
        }
        public int IsEditable {
            get;
            set;
        }
        public string Pcode {
            get;
            set;
        }
        public string JoinURL {
            get;
            set;
        }
        public LivestreamSettings LivestreamSettings {
            get;
            set;
        }
    }
    public class Occurrences
    {
        public int Id {
            get;
            set;
        }
        public int MeetingId {
            get;
            set;
        }
        public long OccurrenceId {
            get;
            set;
        }
        public string MeetingAt {
            get;
            set;
        }
        public int Occurrence {
            get;
            set;
        }
        public int IsOccur {
            get;
            set;
        }
    }
    public class MeetingAttendee
    {
        public int MeetingAttendeeId {
            get;
            set;
        }
        public string FirstName {
            get;
            set;
        }
        public string LastName {
            get;
            set;
        }
        public string Email {
            get;
            set;
        }
        public int ContactId {
            get;
            set;
        }
        public int IsHost {
            get;
            set;
        }
    }
    public class MeetingGroup
    {
        public int MeetingGroupId {
            get;
            set;
        }
        public string Name {
            get;
            set;
        }
    }
    public class Organizer
    {
        public string Name {
            get;
            set;
        }
        public string Email {
            get;
            set;
        }
    }
    public class ApiResponse
    {
        public bool Success {
            get;
            set;
        }
        public string Message {
            get;
            set;
        }
        public Meeting Meeting {
            get;
            set;
        }
        public List<Occurrences> Occurrences {
            get;
            set;
        }
        public List<MeetingAttendee> MeetingAttendees {
            get;
            set;
        }
        public List<MeetingGroup> MeetingGroups {
            get;
            set;
        }
        public Organizer Organizer {
            get;
            set;
        }
    }
}
}
