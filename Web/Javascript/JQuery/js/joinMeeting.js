const generateJwtToken = async (id) => {
  try {
    const body = {
      meeting_id: window.location.search
        ?.split("&")[0]
        ?.split("?")[1]
        ?.split("=")[1],
    };
    if (id !== undefined) Object.assign(body, { contact_id: id });
    const response = await ApiServices.generateJwt(
      localStorage.getItem("accessToken") || "",
      body
    );
    if (response === null) {
      throw "error";
    }
    const moderatorSelection = document.querySelector(
      "#moderator-selection-parent"
    );
    const idInput = document.querySelector("#meeting-id-input");
    moderatorSelection.remove();
    if (idInput) {
      idInput.remove();
    }
    const conferencePanel = document.createElement("div");
    conferencePanel.setAttribute("id", "conference");
    conferencePanel.setAttribute("style", "height: 100%;");
    const meetingPanel = document.querySelector("#conference-parent");
    meetingPanel.appendChild(conferencePanel);

    var domain = CONFERENCE_URL;
    var options = {
      roomName: window.location.search
        ?.split("&")[0]
        ?.split("?")[1]
        ?.split("=")[1], //Change to your Meeting ID
      parentNode: document.querySelector("#conference"),
      jwt: response.jwt,
      apiKey: API_KEY,
      pcode: localStorage.getItem("pCode"),
      interfaceConfigOverwrite: {
        applyMeetingSettings: true, // This is managed from this page - https://portal.meethour.io/customer/ui_settings
        disablePrejoinHeader: true,
        disablePrejoinFooter: true,
        SHOW_MEET_HOUR_WATERMARK: false,
        ENABLE_DESKTOP_DEEPLINK: false,
        HIDE_DEEP_LINKING_LOGO: true,
        MOBILE_APP_PROMO: false,
        ENABLE_MOBILE_BROWSER: true,
      },
    };
    // Initialization of MeetHour External API
    var api = new MeetHourExternalAPI(domain, options);
    // api variable can be used to run other event listeners mentioned in the documentation.

    localStorage.removeItem("pCode");
  } catch (error) {
    const displayError = document.createElement("div");
    displayError.setAttribute(
      "class",
      "flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600"
    );
    const errorParagraph = document.createElement("p");
    const errorText = document.createTextNode(
      "Something went wrong! Please inspect and try to find the error in the network tab."
    );
    errorParagraph.appendChild(errorText);
    displayError.appendChild(errorParagraph);
    document.querySelector("#error").appendChild(displayError);
    setTimeout(() => {
      document.querySelector("#error").remove();
    }, 6000);
    console.log(error);
  }
};

const viewMeeting = async () => {
  if (!window.location.search?.split("&")[0]?.split("?")[1]?.split("=")[1]) {
    const moderatorSelection = document.querySelector(
      "#moderator-selection-parent"
    );
    moderatorSelection.remove();
    return;
  }
  const loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  document.querySelector("#loader").appendChild(loader);
  try {
    const accessToken = localStorage.getItem("accessToken") || "";
    const id =
      window.location.search?.split("&")[0]?.split("?")[1]?.split("=")[1] || "";

    const response = await ApiServices.viewMeeting(accessToken, {
      meeting_id: id,
    });

    if (response.code !== 200 && response.success === false) {
      throw response.message;
    }
    localStorage.setItem("pCode", response.meeting.pcode);
    const meetingBody = {
      organizer: response.organizer,
      hosts: response.meeting.hosts,
      attendees: response.meeting.meeting_attendees,
    };

    //Organizer
    const divTag = document.createElement("div");
    const h1Tag = document.createElement("h1");
    const text = document.createTextNode(
      meetingBody.organizer.name + "(Organizer / Account Owner"
    );
    h1Tag.appendChild(text);
    divTag.appendChild(h1Tag);
    divTag.setAttribute("onclick", `generateJwtToken()`); // If organizer/account owner is trying to join, no need of passing contact id as arguments for getjwt api.
    divTag.setAttribute(
      "class",
      "flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
    );
    const divParent = document.querySelector("#moderator-selection");
    divParent.appendChild(divTag);

    //Hosts
    if (meetingBody.hosts) {
      meetingBody.hosts.forEach((host) => {
        const divTag = document.createElement("div");
        const h1Tag = document.createElement("h1");
        const text = document.createTextNode(
          host.first_name + "(Moderator / Host)"
        );
        h1Tag.appendChild(text);
        divTag.appendChild(h1Tag);
        divTag.setAttribute("onclick", `generateJwtToken(${host.id})`);
        divTag.setAttribute(
          "class",
          "flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
        );
        const divParent = document.querySelector("#moderator-selection");
        divParent.appendChild(divTag);
      });
    }
  } catch (error) {
    const displayError = document.createElement("div");
    displayError.setAttribute(
      "class",
      "flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600"
    );
    const errorParagraph = document.createElement("p");
    const errorText = document.createTextNode(error);
    errorParagraph.appendChild(errorText);
    displayError.appendChild(errorParagraph);
    document.querySelector("#error").appendChild(displayError);
    setTimeout(() => {
      document.querySelector("#error").remove();
    }, 3000);
    console.log(error);
  } finally {
    document.querySelector("#loader").remove();
  }
};
