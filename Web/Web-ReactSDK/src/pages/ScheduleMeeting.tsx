import ApiServices from 'meet-hour-react-web-sdk'
import {useState} from 'react'
import Description from '../components/Description'
import ScheduleMeetingForm from '../components/ScheduleMeetingForm'
import Modal from '../components/Modal'
import { ScheduleMeetingBodyType, User } from '../core/entities'

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
  const [requestBody, setRequestBody] = useState<ScheduleMeetingBodyType>({meeting_name: "", passcode: "", meeting_date: "", meeting_time: "", meeting_meridiem: "", timezone: "", options: [], is_show_portal: 0, attend: [], hostusers: []})
  const [popupFields, setPopupFields] = useState({})
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
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
      let options = [value]
      if(requestBody.options?.includes(value) === false){
        setRequestBody({ ...requestBody, [name]: options });
        return
      }
      options.shift();
      return
    }
    setRequestBody({ ...requestBody, [name]: value });
  };
  const onSubmitHandler = async () => {
    const response = await ApiServices.scheduleMeeting(localStorage.getItem("accessToken") || "", requestBody);
    if (response.success) {
      setIsScheduled!(true);
    }
    setPopupFields({
      meeting_id: response.data.meeting_id,
      passcode: response.data.passcode,
      joinURL: response.data.joinURL,
    });
    localStorage.setItem("meetingId", response.data.meeting_id);
  };
  const addParticipants = (participant: number | User) => {
    const attendParticipants = [...requestBody.attend]
    if(attendParticipants.includes(participant) === false){
      attendParticipants.push(participant)
      setRequestBody({...requestBody, attend: attendParticipants})
    }
  }
  const removeParticipant = (participant: number | User) => {
    const existingParticipants = [...requestBody.attend]
    if(existingParticipants.length === 1){
      existingParticipants.pop();
      setRequestBody({...requestBody, attend: existingParticipants})
      return
    }
    existingParticipants.splice(existingParticipants.indexOf(participant), existingParticipants.indexOf(participant) + 1)
      setRequestBody({...requestBody, attend: existingParticipants})
  }
  return (
    <div className='flex w-screen relative top-16 justify-between overflow-x-hidden'>
      <Description/>
      <ScheduleMeetingForm removeParticipant={removeParticipant} addParticipants={addParticipants} onSubmitHandler={onSubmitHandler} inputChangeHandler={inputChangeHandler} setIsScheduled={setIsScheduled} setPopupFields={setPopupFields} requestBody={requestBody} setRequestBody={setRequestBody}/>
      {isScheduled ? <Modal popupFields={popupFields}/> : ""}
    </div>
  )
}

export default ScheduleMeeting