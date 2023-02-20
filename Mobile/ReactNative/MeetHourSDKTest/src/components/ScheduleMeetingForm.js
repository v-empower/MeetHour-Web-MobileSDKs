import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
  Alert
} from 'react-native';
import ButtonComponent from './ButtonComponent';
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ApiServices} from 'react-native-meet-hour-sdk';
import {SelectList} from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from "react-native-localize";


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

async function getUser() {
  const response = await ApiServices.userDetails(
  await AsyncStorage.getItem('accessToken') || ''
  );

  return [ response.data.name, response.data.email ];
}

const instantMeeting = async (
  setOpen,
  setPopupFields,
  setIsLoading
// eslint-disable-next-line max-params
) => {
  let date = new Date();
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = dd + '-' + mm + '-' + yyyy;

    const [time, meridiem] = formatTime(
      new Date(),
    ).split(' ');
    let formattedTime = ""
    if(time.charAt(1) === ":"){
      formattedTime = "0" + time
    }
    else{
      formattedTime = time
    }
    let response;
try {
  setIsLoading(true);
  const [ name, email ] = await getUser();
  const host = {
      first_name: name?.split(' ')[0],
      last_name: name?.split(' ')[1],
      email
  };

  const body = {
      meeting_name: 'Quick Meeting',
      agenda: '',
      passcode: '123456',
      meeting_date: formattedDate,
      meeting_time: formattedTime,
      meeting_meridiem: meridiem,
      timezone: RNLocalize.getTimeZone(),
      instructions: 'Team call, join as soon as possible',
      is_show_portal: 0,
      options: [ 'ALLOW_GUEST', 'JOIN_ANYTIME' ],
      hostusers: [ host ]
  };
  response = await ApiServices.scheduleMeeting(
await AsyncStorage.getItem('accessToken'),
body
  );
  if (response.success) {
      setOpen(true);
      setPopupFields({
          meeting_id: response.data.meeting_id,
          passcode: response.data.passcode,
          joinURL: response.data.joinURL
      });
      await AsyncStorage.setItem('meetingId', response.data?.meeting_id);
  }
} catch (error) {
  Alert.alert("Error", response.message)
  console.log(error);
} finally {
  setIsLoading(false);
}
};

const ScheduleMeetingForm = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [timezone, setTimezone] = useState([]);
  const [contacts, setContacts] = useState([]);


  const displayDateTimePicker = (param) => {
    if (param === 'time') {
      props.setMode("time")
      return
    }
    props.setMode("date")
  };

  const getTimezone = async () => {
    try {
      const response = await ApiServices.timezone(await AsyncStorage.getItem("accessToken"));
      setTimezone(response.timezones);
    } catch (error) {
      console.log(error);
    }
  };

  const getContactsList = async () => {
    const body = {
      limit: 0,
      page: 0,
      exclude_hosts: 0,
    };
    const contactsList = [];
    let response;
    try {
      response = await ApiServices.contactsList(
        await AsyncStorage.getItem("accessToken"),
        body,
      );
      response?.contacts?.forEach((item) => {
        contactsList.push({
          key: item.id,
          value: item.first_name + '(' + item.email + ')',
        });
      });
      setContacts(contactsList);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", response.message)
    }
  };

  useEffect(() => {
    getTimezone();
    getContactsList();
  }, []);

  return (
    <View>
      <Text style={{fontSize: 25}}> Schedule a Meeting Form</Text>
      <TextInput 
        placeholder="Meeting Name"
        onChange={(event) => props.inputChangeHandler(event, "meeting_name")}
      />
      <TextInput
        onChange={(event) => props.inputChangeHandler(event, "passcode")}
        placeholder="Passcode"
      />
      <Button
        title="Select Time"
        style={{height: 20}}
        onPress={() => displayDateTimePicker('time')}
      />
      <Button
        title="Select Date"
        style={{height: 20}}
        onPress={() => displayDateTimePicker('date')}
      />
      {props.mode === "time" ? (
        <DateTimePicker
          display="default"
          value={new Date()}
          mode="time"
          is24Hour={false}
          onChange={(event) => props.inputChangeHandler(event, "time")}
        />
      ) : (
        props.mode === "date" ? <DateTimePicker
        display="default"
        value={new Date()}
        mode="date"
        onChange={(event) => props.inputChangeHandler(event, "date")}
      /> : <></>
      )}
      <SelectList
        placeholder="Select Timezone"
        setSelected={(val) => props.inputChangeHandler(val, 'timezone')}
        data={timezone}
        save="value"
      />

      <SelectList
        placeholder="Add Participants"
        setSelected={(val) => props.addParticipant(val)}
        data={contacts}
        save="key"
      />
      {contacts?.map((user) => {
        if (props.requestBody.attend?.includes(user.key) === false) {
          return null;
        }

        return (
          <View key={user.key}>
            <Text>{user.value}</Text>
            <Pressable
              onPress={() => {
                props.removeParticipant(user.key);
              }}>
              <Text>Remove</Text>
            </Pressable>
          </View>
        );
      })}
      <SelectList
        placeholder="Add Moderators"
        setSelected={(val) => props.addModerator(val)}
        data={contacts}
        save="key"
      />
      {contacts?.map((user) => {
        if (props.requestBody.hostusers?.includes(user.key) === false) {
          return null;
        }

        return (
          <View key={user.key}>
            <Text>{user.value}</Text>
            <Pressable
              onPress={() => {
                props.removeModerator(user.key);
              }}>
              <Text>Remove</Text>
            </Pressable>
          </View>
        );
      })}

      <View>
      </View>

      <View style={{flex: 1, zIndex: -10}}>
        <ButtonComponent
        isLoading={props.isLoading}
          title="Schedule a Meeting"
          backgroundColor="red"
          width={230}
          height={50}
          onPress={() => props.onSubmitHandler()}
        />
      </View>
      <View style={{flex: 1, zIndex: -10}}>
        <ButtonComponent
        isLoading={isLoading}
          title="Instant Meeting"
          backgroundColor="gray"
          width={230}
          height={50}
          onPress={() => instantMeeting(props.setOpen, props.setPopupFields, setIsLoading)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 50,
    width: '90%',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 50,
  },
});

export default ScheduleMeetingForm;
