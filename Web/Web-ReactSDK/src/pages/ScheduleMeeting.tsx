import ApiServices from "meet-hour-react-web-sdk";
import { useState } from "react";
import Description from "../components/Description";
import ScheduleMeetingForm from "../components/ScheduleMeetingForm";
import Modal from "../components/Modal";
import { ScheduleMeetingType } from "meet-hour-react-web-sdk";
import { UserObjectType } from "meet-hour-react-web-sdk";
import { AppContext } from "../App";
import React from "react";

function timeConvert(time: any[]) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];
  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? " AM" : " PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
}

function ScheduleMeeting() {
  const [open, setOpen] = useState<boolean>(false)
  const [requestBody, setRequestBody] = useState<ScheduleMeetingType>({
    meeting_name: "",
    passcode: "",
    meeting_date: "",
    meeting_time: "",
    meeting_meridiem: "",
    timezone: "",
    options: [],
    is_show_portal: 1,
    send_calendar_invite: 1,
    attend: [],
    hostusers: [],
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [popupFields, setPopupFields] = useState<any>({});
  const appContext = React.useContext(AppContext);
  const inputChangeHandler = (event: any) => {
    const { name, value } = event?.target;
    if (name === "meeting_date") {
      let date = value;
      date = date.split("-").reverse().join("-");
      setRequestBody({ ...requestBody, [name]: date });
      return;
    }
    if (name === "meeting_time") {
      const [time, meridiem] = timeConvert(value).split(" ");
      setRequestBody({
        ...requestBody,
        [name]: time,
        ["meeting_meridiem"]: meridiem,
      });
      return;
    }
    if (name === "options") {
      let options = [value];
      if (requestBody.options?.includes(value) === false) {
        setRequestBody({ ...requestBody, [name]: options });
        return;
      }
      options.shift();
      return;
    }
    setRequestBody({ ...requestBody, [name]: value });
  };
  const onSubmitHandler = async () => {
    try {
      setIsLoading(true);
      const response = await ApiServices.scheduleMeeting(
        localStorage.getItem("accessToken") || "",
        requestBody
      );
      if (response.success) {
        setOpen(true);
      }
      setPopupFields({
        meeting_id: response.data.meeting_id,
        passcode: response.data.passcode,
        joinURL: response.data.joinURL,
      });
      localStorage.setItem("meetingId", response.data.meeting_id);
      localStorage.setItem("pCode", response.data.pcode)
    } catch (error) {
      console.log(error);
      appContext?.setIsError(true);
      setTimeout(() => {
        appContext?.setIsError(false);
      }, 6000);
    } finally {
      setIsLoading(false);
    }
  };
  const addParticipant = (participant: number | UserObjectType): void => {
    if (
      typeof participant !== "number" &&
      (!participant.first_name || !participant.last_name || !participant.email)
    ) {
      alert("Please set all the required fields");
      return;
    }
    const attendParticipants = requestBody.attend
      ? [...requestBody.attend]
      : [];
    if (attendParticipants.includes(participant) === false) {
      attendParticipants.push(participant);
      setRequestBody({ ...requestBody, attend: attendParticipants });
    }
  };
  const removeParticipant = (participant: number | UserObjectType) => {
    const existing = requestBody.attend ? [...requestBody.attend] : [];
    if (existing.length === 1) {
      existing.pop();
      setRequestBody({ ...requestBody, attend: existing });
      return;
    }
    existing.splice(
      existing.indexOf(participant),
      existing.indexOf(participant) + 1
    );
    setRequestBody({ ...requestBody, attend: existing });
  };
  const addModerator = (moderator: number) => {
    const moderators = requestBody.hostusers ? [...requestBody.hostusers] : [];
    if (moderators.includes(moderator) === false) {
      moderators.push(moderator);
      setRequestBody({ ...requestBody, hostusers: moderators });
    }
  };
  const removeModerator = (moderator: number) => {
    const existing = requestBody.hostusers ? [...requestBody.hostusers] : [];
    if (existing.length === 1) {
      existing.pop();
      setRequestBody({ ...requestBody, hostusers: existing });
      return;
    }
    existing.splice(
      existing.indexOf(moderator),
      existing.indexOf(moderator) + 1
    );
    setRequestBody({ ...requestBody, hostusers: existing });
  };
  return (
    <div className="lg:flex w-screen relative top-16 justify-between overflow-x-hidden">
      <Description />
      <ScheduleMeetingForm
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        popupFields={popupFields}
        addModerator={addModerator}
        removeModerator={removeModerator}
        removeParticipant={removeParticipant}
        addParticipant={addParticipant}
        onSubmitHandler={onSubmitHandler}
        setRequestBody={setRequestBody}
        inputChangeHandler={inputChangeHandler}
        setOpen={setOpen}
        setPopupFields={setPopupFields}
        requestBody={requestBody}
      />
      <Modal open={open} setOpen={setOpen} popupFields={popupFields} />
    </div>
  );
}

export default ScheduleMeeting;
