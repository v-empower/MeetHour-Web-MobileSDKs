import React, {useState} from 'react';
import { StyleSheet, View, Alert} from 'react-native';
import ScheduleMeetingForm from '../components/ScheduleMeetingForm';
import ModalView from '../components/ModalView';
import {ApiServices} from 'react-native-meet-hour-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Description from '../components/Description'

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const ScheduleMeetingPage = (props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('');
  const [requestBody, setRequestBody] = useState({
    meeting_name: '',
    passcode: '',
    meeting_date: '14-02-2023',
    meeting_time: '01:41',
    meeting_meridiem: 'PM',
    timezone: '',
    options: ['ALLOW_GUEST'],
    is_show_portal: 1,
    send_calendar_invite: 1,
    attend: [],
    hostusers: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popupFields, setPopupFields] = useState({});
  const inputChangeHandler = (event, inputType) => {
    if (inputType === 'date') {
      let date = new Date(event.nativeEvent.timestamp);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1; // Months start at 0!
      let dd = date.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedDate = dd + '-' + mm + '-' + yyyy;
      setRequestBody({...requestBody, meeting_date: formattedDate});
      setMode('');
      return;
    }
    if (inputType === 'time') {
      const [time, meridiem] = formatTime(
        new Date(event.nativeEvent.timestamp),
      ).split(' ');
      let formattedTime = ""
      if(time.charAt(1) === ":"){
        formattedTime = "0" + time
      }
      else{
        formattedTime = time
      }
      setRequestBody({
        ...requestBody,
        meeting_time: formattedTime,
        meeting_meridiem: meridiem,
      });
      setMode('');
      return;
    }
    if (inputType === 'timezone') {
      setRequestBody({
        ...requestBody,
        timezone: event,
      });
      return;
    }
    setRequestBody({...requestBody, [inputType]: event.nativeEvent.text});
  };
  const onSubmitHandler = async () => {
    if(!requestBody.meeting_name || !requestBody.passcode || !requestBody.meeting_time || !requestBody.meeting_date || !requestBody.timezone || !requestBody.attend || !requestBody.hostusers){
      Alert.alert("Error", "Please fill all the fields to schedule a meeting.")
      return
    }
    let response;
    try {
      setIsLoading(true);
      response = await ApiServices.scheduleMeeting(
        await AsyncStorage.getItem('accessToken'),
        requestBody,
      );
      if (response.success) {
        setOpen(true);
      }
      setPopupFields({
        meeting_id: response.data?.meeting_id,
        passcode: response.data?.passcode,
        joinURL: response.data?.joinURL,
      });
      await AsyncStorage.setItem('meetingId', response?.data?.meeting_id);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", response.message)
    } finally {
      setIsLoading(false);
    }
  };
  const addParticipant = (participant) => {
    // if (
    //   typeof participant !== 'number' &&
    //   (!participant.first_name || !participant.last_name || !participant.email)
    // ) {
    //   // eslint-disable-next-line no-alert
    //   alert('Please set all the required fields');

    //   return;
    // }
    const attendParticipants = requestBody.attend
      ? [...requestBody.attend]
      : [];
    if (attendParticipants.includes(participant) === false) {
      attendParticipants.push(participant);
      setRequestBody({...requestBody, attend: attendParticipants});
    }
  };
  const removeParticipant = (participant) => {
    const existing = requestBody.attend ? [...requestBody.attend] : [];

    if (existing.length === 1) {
      existing.pop();
      setRequestBody({...requestBody, attend: existing});

      return;
    }
    existing.splice(
      existing.indexOf(participant),
      existing.indexOf(participant) + 1,
    );
    setRequestBody({...requestBody, attend: existing});
  };
  const addModerator = (moderator) => {
    const moderators = requestBody.hostusers ? [...requestBody.hostusers] : [];

    if (moderators.includes(moderator) === false) {
      moderators.push(moderator);
      setRequestBody({...requestBody, hostusers: moderators});
    }
  };
  const removeModerator = (moderator) => {
    const existing = requestBody.hostusers ? [...requestBody.hostusers] : [];

    if (existing.length === 1) {
      existing.pop();
      setRequestBody({...requestBody, hostusers: existing});

      return;
    }
    existing.splice(
      existing.indexOf(moderator),
      existing.indexOf(moderator) + 1,
    );
    setRequestBody({...requestBody, hostusers: existing});
  };
  return (
    <View style={styles.container}>
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
        mode={mode}
        setMode={setMode}
        setPopupFields={setPopupFields}
        requestBody={requestBody}
      />
      <ModalView open={open} setOpen={setOpen} popupFields={popupFields} setSelectedScreen={props.setSelectedScreen}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 80,
  },
});

export default ScheduleMeetingPage;
