const generateJwtToken =
    async (jwtToken, meetingId, pCode, CONFERENCE_URL, API_KEY) => {
  try {

    const conferencePanel = document.createElement("div");
    conferencePanel.setAttribute("id", "conference");
    conferencePanel.setAttribute("style", "height: 100%;");
    const meetingPanel = document.querySelector("#conference-parent");
    meetingPanel.appendChild(conferencePanel);

    var domain = CONFERENCE_URL;
    var options = {
      roomName : meetingId, // Change to your Meeting ID
      parentNode : document.querySelector("#conference"),
      jwt : jwtToken,
      apiKey : API_KEY,
      pcode : pCode,
      interfaceConfigOverwrite : {
        applyMeetingSettings :
            true, // This is managed from this page -
                  // https://portal.meethour.io/customer/ui_settings
        disablePrejoinHeader : true,
        disablePrejoinFooter : true,
        SHOW_MEET_HOUR_WATERMARK : false,
        ENABLE_DESKTOP_DEEPLINK : false,
        HIDE_DEEP_LINKING_LOGO : true,
        MOBILE_APP_PROMO : false,
        ENABLE_MOBILE_BROWSER : true,
      },
    };
    // Initialization of MeetHour External API
    var api = new MeetHourExternalAPI(domain, options);
    // api variable can be used to run other event listeners mentioned in the
    // documentation.

  } catch (error) {

    console.log(error);
  }
};
