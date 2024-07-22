namespace MeethourExample_Asp.Models
{
public class CombinedViewModel
{
    public ErrorViewModel? errorModel {
        get;
        set;
    }
    public HeaderViewModel? headerModel {
        get;
        set;
    }

    public MeetingResponseViewModel? MeetingModel {
        get;
        set;
    }
    public ContactResponseViewModel? contactModel {
        get;
        set;
    }
    public TimezoneResponseViewModel? timeZoneModel {
        get;
        set;
    }
    public JoinMeetingResponseViewModel? JoinMeetingModel {
        get;
        set;
    }


    public CombinedViewModel()
    {
        errorModel = new ErrorViewModel();
        headerModel = new HeaderViewModel();
        MeetingModel = new MeetingResponseViewModel();
        contactModel = new ContactResponseViewModel();
        timeZoneModel= new TimezoneResponseViewModel();
        JoinMeetingModel = new JoinMeetingResponseViewModel();
    }
}

}


