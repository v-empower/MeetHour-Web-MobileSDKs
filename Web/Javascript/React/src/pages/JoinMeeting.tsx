/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiServices, { MeetHourMeeting } from "meet-hour-react-web-sdk";
import * as React from "react";

import { AppContext } from "../App";
import LottieComponent from "../components/LottieComponent";
import { API_BASE_URL, API_KEY, API_RELEASE, CONFERENCE_URL } from "../constants";

function JoinMeeting() {
  const [isStartMeeting, setIsStartMeeting] = React.useState<boolean>(false);
  const [logItems, updateLog] = React.useState<any>([]);
  const [meetingAttendees, setMeetingAttendees] = React.useState<any>({
    organizer: {},
    hosts: [],
    attendees: [],
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [knockingParticipants, updateKnockingParticipants] =
    React.useState<any>([]);
  const appContext = React.useContext(AppContext);
  const apiRef = React.useRef();
  const [meetingJwtToken, setMeetingJwtToken] = React.useState<string>();
  const meetingId = localStorage.getItem("meetingId") || ""; // In String you can pass 'TestRoom' also.
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

  const handleMeetHourIFrameRef1 = (iframeRef: any) => {
    iframeRef.allow =
      "camera; microphone; display-capture; autoplay; clipboard-write";
    iframeRef.style.border = "10px solid #3d3d3d";
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = "100%";
    iframeRef.style.marginBottom = "20px";
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const generateJwtToken = async (id?: number) => {
    let response;
    try {
      const meetingId = localStorage.getItem("meetingId") || "";
      const body = {
        meeting_id: meetingId,
      };
      if (id !== undefined) Object.assign(body, { contact_id: id });
    response = await ApiServices.generateJwt(
        localStorage.getItem("accessToken") || "",
        body
      );

      setIsStartMeeting(true);
      setMeetingJwtToken(response.jwt);
    } catch (error) {
      console.log(error);
      appContext?.setIsError(true);
      appContext?.setErrorMessage(response.message);
    }
  };
  const viewMeeting = async () => {
    if (!localStorage.getItem("meetingId")) {
      return;
    }
    let response;
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken") || "";
      const id = localStorage.getItem("meetingId") || "";
    response = await ApiServices.viewMeeting(accessToken, {
        meeting_id: id,
      });
      const meetingBody = {
        organizer: response.organizer,
        hosts: response.meeting.hosts,
        attendees: response.meeting.meeting_attendees,
      };

      setMeetingAttendees(meetingBody);
    } catch (error) {
      appContext?.setIsError(true);
      appContext?.setErrorMessage(response.message)
      setTimeout(() => {
        appContext?.setIsError(false);
      }, 3000);
      localStorage.removeItem("meetingId");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      alert("First generate the access token, then try to join a meeting");
      window.location.pathname = "/";
    }
    viewMeeting();
  }, []);

  return (
    <div>
      {localStorage.getItem("meetingId") ? (
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
                      console.log(meetingAttendees.organizer);
                      generateJwtToken(); // If organizer/account owner is trying to join, no need of passing contact id as arguments for getjwt api.
                    }}
                    key={meetingAttendees.organizer.id}
                    className="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md"
                  >
                    <h1>{meetingAttendees.organizer.name}</h1>
                    (Organizer / Account Owner)
                  </div>
                  {meetingAttendees.hosts.map((host: any) => (
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
                  ))}
                  {meetingAttendees.attendees ? (
                    meetingAttendees.attendees.map((attendee: any) => (
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
                    ))
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={() => {
                      window.localStorage.removeItem("meetingId");
                      window.localStorage.removeItem("pCode");
                      window.location.pathname = "/join-meeting";
                    }}
                    className="w-40 h-9 bg-slate-600 text-white rounded-md"
                  >
                    Reset
                  </button>{" "}
                  {/* Reset button will remove your current meeting id from local storage. */}
                </div>
              ) : (
                <div className="w-full">
                  <MeetHourMeeting
                    domain = {CONFERENCE_URL}
                    roomName={meetingId}
                    apiKey={API_KEY}
                    apiBaseURL={API_BASE_URL}
                    release={API_RELEASE}
                    jwt={meetingJwtToken} // Mandatory for Moderator ( Generate from here ) - https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
                    pcode={localStorage.getItem("pCode") || ""} // Dynamically pass Encrypted Meeting Password as pcode. Get Pcode from API.
                    onReadyToClose={handleReadyToClose}
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
        <div className="w-full h-screen relative top-16">
          <div className="grid gap-3 p-5">
            <h1 className="text-slate-600 text-2xl">Join a Meeting</h1>
            <input
              placeholder="Enter Meeting Id or link here."
              className="w-64 h-10 border border-slate-400 focus:outline-none rounded-md pl-3"
              type="text"
              onChange={(event: any) => {
                if (event.target.value.includes("https://")) {
                  const id = event.target.value.slice(20, 34);

                  localStorage.setItem("meetingId", id);

                  return;
                }
                localStorage.setItem("meetingId", event.target.value);
              }}
            />
            <button
              className="w-28 h-8 text-white font-semibold text-sm bg-green-600 rounded-md"
              onClick={() => {
                viewMeeting();
              }}
            >
              Join Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinMeeting;
