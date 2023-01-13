import * as React from "react";

import { MeetHourMeeting } from 'meet-hour-react-web-sdk';
import { API_BASE_URL, API_KEY } from "../constants";

function JoinMeeting() {
  const [ logItems, updateLog ] = React.useState<any>([]);
  const [ knockingParticipants, updateKnockingParticipants ] = React.useState<any>([]);
  const apiRef = React.useRef();
  const [meetingToken, setMeetingToken] = React.useState<string>()
  const meetingID = localStorage.getItem("meetingId") || "" // In String you can pass 'TestRoom' also.
  const renderSpinner = () => (
    <div style = {{
        fontFamily: 'sans-serif',
        textAlign: 'center'
    }}>
        Loading..
    </div>
);
const handleReadyToClose = () => {
  /* eslint-disable-next-line no-alert */
  alert('Ready to close...');
};
const handleApiReady = (apiObj: any) => {
  apiRef.current = apiObj;
  //@ts-ignore
  apiRef.current?.on('knockingParticipant', handleKnockingParticipant);
  //@ts-ignore
  apiRef.current?.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
  //@ts-ignore
  apiRef.current?.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
  //@ts-ignore
  apiRef.current?.on('raiseHandUpdated', printEventOutput);
  //@ts-ignore
  apiRef.current?.on('titleViewChanged', printEventOutput);
  //@ts-ignore
  apiRef.current?.on('chatUpdated', handleChatUpdates);
  //@ts-ignore
  apiRef.current?.on('knockingParticipant', handleKnockingParticipant);
};
const handleMeetHourIFrameRef1 = (iframeRef: any) => {
  iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
  iframeRef.style.border = '10px solid #3d3d3d';
  iframeRef.style.background = '#3d3d3d';
  iframeRef.style.height = "100%";
  iframeRef.style.marginBottom = '20px';
};
const handleKnockingParticipant = (payload: any) => {
  updateLog((items: any) => {
    return ([ ...items, JSON.stringify(payload) ])
  });
  updateKnockingParticipants((participants: any) => {
    return [ ...participants, payload?.participant ]
  })
};
const printEventOutput = (payload: any) => {
  updateLog((items: any) => [ ...items, JSON.stringify(payload) ]);
};
const renderLog = () => logItems.map(
  (item: any, index: any) => (
      <div
          style = {{
              fontFamily: 'monospace',
              padding: '5px'
          }}
          key = { index }>
          {item}
      </div>
  )
);
const handleAudioStatusChange = (payload: any, feature: any) => {
  if (payload.muted) {
      updateLog((items: any) => [ ...items, `${feature} off` ])
  } else {
      updateLog((items: any) => [ ...items, `${feature} on` ])
  }
};

const handleChatUpdates = (payload: any) => {
  if (payload.isOpen || !payload.unreadCount) {
      return;
  }
  //@ts-ignore
  apiRef.current?.executeCommand('toggleChat');
  updateLog((items: any) => [ ...items, `you have ${payload.unreadCount} unread messages` ])
};
  React.useEffect(() => {
    setMeetingToken(localStorage.getItem("meetingToken") || "")
  }, [])
  
  return (
    <div className="h-screen w-screen">
      <MeetHourMeeting 
      roomName = {meetingID}
      apiKey = {API_KEY}
      apiBaseURL = {API_BASE_URL}
      jwt = {meetingToken} // Mandatory for Moderator ( Generate from here ) - https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
      pcode={''} // Dynamically pass Encrypted Meeting Password as pcode. Get Pcode from API.
      onReadyToClose = { handleReadyToClose } 
      onApiReady = { externalApi => handleApiReady(externalApi) } 
      getIFrameRef = { handleMeetHourIFrameRef1 } spinner = { renderSpinner }
/>
    </div>
  )
}

export default JoinMeeting