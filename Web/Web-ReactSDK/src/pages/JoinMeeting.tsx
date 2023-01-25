import * as React from "react";

import ApiServices, { MeetHourMeeting } from "meet-hour-react-web-sdk";
import { API_BASE_URL, API_KEY } from "../constants";
import { AppContext } from "../App";
import LottieComponent from "../components/LottieComponent";

function JoinMeeting() {
  const [isStartMeeting, setIsStartMeeting] = React.useState<boolean>(false);
  const [logItems, updateLog] = React.useState<any>([]);
  const [meetingAttendees, setMeetingAttendees] = React.useState<any>({
    organizer: {},
    hosts: [],
    attendees: [],
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [knockingParticipants, updateKnockingParticipants] =
    React.useState<any>([]);
  const appContext = React.useContext(AppContext);
  const apiRef = React.useRef();
  const [meetingJwtToken, setMeetingJwtToken] = React.useState<string>();
  const meetingIdString = localStorage.getItem("meetingIdString") || ""; // In String you can pass 'TestRoom' also.
  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );
  const handleReadyToClose = () => {
    /* eslint-disable-next-line no-alert */
    alert("Ready to close...");
  };
  const handleApiReady = (apiObj: any) => {
    apiRef.current = apiObj;
    //@ts-ignore
    apiRef.current?.on("knockingParticipant", handleKnockingParticipant);
    //@ts-ignore
    apiRef.current?.on("audioMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "audio")
    );
    //@ts-ignore
    apiRef.current?.on("videoMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "video")
    );
    //@ts-ignore
    apiRef.current?.on("raiseHandUpdated", printEventOutput);
    //@ts-ignore
    apiRef.current?.on("titleViewChanged", printEventOutput);
    //@ts-ignore
    apiRef.current?.on("chatUpdated", handleChatUpdates);
    //@ts-ignore
    apiRef.current?.on("knockingParticipant", handleKnockingParticipant);
  };
  const handleMeetHourIFrameRef1 = (iframeRef: any) => {
    iframeRef.allow =
      "camera; microphone; display-capture; autoplay; clipboard-write";
    iframeRef.style.border = "10px solid #3d3d3d";
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = "100%";
    iframeRef.style.marginBottom = "20px";
  };
  const handleKnockingParticipant = (payload: any) => {
    updateLog((items: any) => {
      return [...items, JSON.stringify(payload)];
    });
    updateKnockingParticipants((participants: any) => {
      return [...participants, payload?.participant];
    });
  };
  const printEventOutput = (payload: any) => {
    updateLog((items: any) => [...items, JSON.stringify(payload)]);
  };
  const renderLog = () =>
    logItems.map((item: any, index: any) => (
      <div
        style={{
          fontFamily: "monospace",
          padding: "5px",
        }}
        key={index}
      >
        {item}
      </div>
    ));
  const handleAudioStatusChange = (payload: any, feature: any) => {
    if (payload.muted) {
      updateLog((items: any) => [...items, `${feature} off`]);
    } else {
      updateLog((items: any) => [...items, `${feature} on`]);
    }
  };
  const handleChatUpdates = (payload: any) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    //@ts-ignore
    apiRef.current?.executeCommand("toggleChat");
    updateLog((items: any) => [
      ...items,
      `you have ${payload.unreadCount} unread messages`,
    ]);
  };
  const generateJwtToken = async (id: number) => {
    try {
      const body = {
        meeting_id: meetingIdString,
        contact_id: id,
      };
      const response = await ApiServices.generateJwt(
        localStorage.getItem("accessToken") || "",
        body
      );
      setIsStartMeeting(true);
      setMeetingJwtToken(response.jwt);
    } catch (error) {
      console.log(error);
      appContext?.setIsError(true);
    }
  };
  const viewMeeting = async () => {
    if (!localStorage.getItem("meetingIdString")) {
      alert("Please schedule a meeting first");
      window.location.pathname = "/schedule-meeting";
    }
    try {
      setIsLoading(true);
      const response = await ApiServices.viewMeeting(
        localStorage.getItem("accessToken") || "",
        { meeting_id: meetingIdString }
      );
      const meetingBody = {
        organizer: response.organizer,
        hosts: response.meeting.hosts,
        attendees: response.meeting.meeting_attendees,
      };
      setMeetingAttendees(meetingBody);
    } catch (error) {
      appContext?.setIsError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    viewMeeting();
  }, []);

  return (
    <div>
      {localStorage.getItem("meetingIdString") ? (
        <div>
          {isLoading ? (
            <LottieComponent />
          ) : (
            <div className=" relative top-16 h-screen w-screen flex justify-center">
              {!isStartMeeting ? (
                <div className=" rounded-md opacity-100 h-auto p-5 w-96 bg-white">
                  <div className="flex justify-center w-full">
                    <LottieComponent></LottieComponent>
                  </div>
                  <h1 className="text-xl font-semibold ">
                    Whom would you like to join as?
                  </h1>
                  <div
                    onClick={() => {
                      generateJwtToken(meetingAttendees.organizer);
                    }}
                    key={meetingAttendees.organizer.id}
                    className="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
                  >
                    <h1>{meetingAttendees.organizer.name}</h1>
                    (Organizer / Account Owner)
                  </div>
                  {meetingAttendees.hosts.map((host: any) => {
                    return (
                      <div
                        onClick={() => {
                          generateJwtToken(host.id);
                        }}
                        key={host.id}
                        className="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
                      >
                        <h1>{host.first_name}</h1>
                        <h1>{host.last_name}</h1>
                        (Moderator / Host)
                      </div>
                    );
                  })}
                  {meetingAttendees.attendees ? (
                    meetingAttendees.attendees.map((attendee: any) => {
                      return (
                        <div
                          onClick={() => {
                            generateJwtToken(attendee.id);
                          }}
                          key={attendee.id}
                          className="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
                        >
                          <h1>{attendee.first_name}</h1>
                          <h1>{attendee.last_name}</h1>
                          (Attendee)
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <MeetHourMeeting
                    roomName={meetingIdString}
                    apiKey={API_KEY}
                    apiBaseURL={API_BASE_URL}
                    jwt={meetingJwtToken} // Mandatory for Moderator ( Generate from here ) - https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
                    pcode={""} // Dynamically pass Encrypted Meeting Password as pcode. Get Pcode from API.
                    onReadyToClose={handleReadyToClose}
                    onApiReady={(externalApi) => handleApiReady(externalApi)}
                    getIFrameRef={handleMeetHourIFrameRef1}
                    spinner={renderSpinner}
                    interfaceConfigOverwrite={{
                      applyMeetingSettings: true,
                      disablePrejoinHeader: true,
                      disablePrejoinFooter: true,
                      SHOW_MEET_HOUR_WATERMARK: false,
                      HIDE_DEEP_LINKING_LOGO: true,
                      MOBILE_APP_PROMO: false,
                      ENABLE_DESKTOP_DEEPLINK: false,
                      ENABLE_MOBILE_BROWSER: true,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default JoinMeeting;
