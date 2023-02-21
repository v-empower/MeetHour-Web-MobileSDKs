import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Alert,
  Pressable,
  Button,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MeetHour, { MeetHourView, ApiServices } from 'react-native-meet-hour-sdk';
import styles from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderCompenent from '../components/LoaderComponent';

export default function JoinMeeting(props) {

  const [isContinued, setIsContinued] = useState(false);
  const [meetingAttendees, setMeetingAttendees] = React.useState({
    organizer: {},
    hosts: [],
    attendees: [],
  });
  const [isViewSelected, setIsViewSelected] = useState(false);
  const [viewType, setViewType] = useState('');
  const [conferenceOptions, setConferenceOptions] = useState({
    room: '',
    token: '',
    pcode: '',
    serverUrl: 'https://meethour.io'
  });
  const [meetingId, setMeetingId] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const startMeetHourAsNativeController = async () => {
    /*
          Mode 1 - Starts a new MeetHour Activity/UIViewController on top of RN Application (outside of JS).
          It doesn't require rendering MeetHourView Component.
        */
    await MeetHour.launchMeetHourView(conferenceOptions);

    /*
          Note:
            MeetHour.launchMeetHourView will return a promise, which is resolved once the conference is terminated and the MeetHourView is dismissed.
        */
  };
  const generateJwtToken = async (id) => {
    let response;
    try {
      const meetingId = await AsyncStorage.getItem('meetingId')
      let body = {
        meeting_id: meetingId,
      };
      if (id !== undefined) Object.assign(body, { contact_id: id });
      response = await ApiServices.generateJwt(
        await AsyncStorage.getItem('accessToken'),
        body,
      );
      const jwtToken = response.jwt;
      const pCode = await AsyncStorage.getItem('pCode');
      setConferenceOptions((previousDetails) => ({
        ...previousDetails,
        room: meetingId,
        pcode: pCode,
        token: jwtToken
      }));
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        response.message,
      );
    }
  };

  const viewMeeting = async (isManual = false) => {
    setIsLoading(true);
    let response;
    try {
      if ((await AsyncStorage.getItem('accessToken')) === undefined) {
        Alert.alert('Please generate your access token.');
        return;
      }
      if (isManual === true) {
        if (meetingId.includes('https://')) {
          const modifiedId = meetingId.slice(20, 34)
          setMeetingId(modifiedId);
          await AsyncStorage.setItem('meetingId', modifiedId);
        } else {
          const id = meetingId
          await AsyncStorage.setItem('meetingId', id);
        }
      }
      if (!(await AsyncStorage.getItem('meetingId'))) {
        setIsContinued(false);
        return;
      }
      setIsLoading(true);
      const id = await AsyncStorage.getItem('meetingId');
      response = await ApiServices.viewMeeting(
        await AsyncStorage.getItem('accessToken'),
        {
          meeting_id: id,
        },
      );
      await AsyncStorage.setItem("pCode", response?.meeting?.pcode);
      const meetingBody = {
        organizer: response?.organizer,
        hosts: response?.meeting?.hosts,
        attendees: response?.meeting?.meeting_attendees,
      };
      setIsContinued(true);
      setMeetingAttendees(meetingBody);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", response.message)
      resetMeetingDetails()
    } finally {
      setIsLoading(false);
    }
  };
  const resetMeetingDetails = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('meetingId');
      await AsyncStorage.removeItem('pCode');
      props.setSelectedScreen('ScheduleMeeting');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conferenceOptions.room !== '') {
      if (Platform.OS === 'android') {
        startMeetHourAsNativeController(); // Recommeneded to use for Android if you require Screen Sharing functionality.
      }
      else {
        props.setShowMeetHourView((prev) => true);
      }
    }
  }, [conferenceOptions]);

  React.useEffect(() => {
    viewMeeting();
  }, []);

  return isLoading ? (
    <View style={{ marginTop: 80 }}>
      <LoaderCompenent />
    </View>
  ) : (
    props.showMeetHourView ? (
      <View
        style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
        }}>
        <MeetHourView
          style={styles.meetHourViewContainer}
          options={conferenceOptions}
          onConferenceTerminated={(_) => props.setShowMeetHourView(false)}
          onConferenceJoined={(e) => console.log(e.nativeEvent)}
          onConferenceWillJoin={(e) => console.log(e.nativeEvent)}
        />
      </View>
    ) : <View style={{ marginTop: 80 }}>
      <ImageBackground
        source={require('../images/MeetHour_logo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {isContinued ? (
        <View>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 25 }}>Whom would you like to join as?</Text>
            <Pressable style={{ borderColor: "gray", marginBottom: 4, borderWidth: 2, paddingLeft: 4, paddingVertical: 10, borderRadius: 5 }}
              onPress={() => {
                generateJwtToken(); // If organizer/account owner is trying to join, no need of passing contact id as arguments for getjwt api.
              }}
              key={meetingAttendees?.organizer?.id}>
              <Text>
                {meetingAttendees?.organizer?.name}(Organizer / Account Owner)
              </Text>
            </Pressable>
            {meetingAttendees?.hosts?.map((host) => (
              <Pressable style={{ borderColor: "gray", marginBottom: 4, borderWidth: 2, paddingLeft: 4, paddingVertical: 10, borderRadius: 5 }}
                onPress={() => {
                  generateJwtToken(host.id);
                }}
                key={host.id}>
                <Text>{host.first_name} {host.last_name} (Moderator / Host)</Text>
              </Pressable>
            ))}
            {meetingAttendees.attendees ? (
              meetingAttendees.attendees.map((attendee) => (
                <Pressable style={{ borderColor: "gray", borderWidth: 2, marginBottom: 4, paddingLeft: 4, paddingVertical: 10, borderRadius: 5 }}
                  onPress={() => {
                    generateJwtToken(attendee.id);
                  }}
                  key={attendee.id}>
                  <Text>{attendee.first_name}</Text>
                  <Text>{attendee.last_name} (Attendee)</Text>
                </Pressable>
              ))
            ) : (
              <></>
            )}
            <Button
              title="Reset Meeting ID"
              onPress={() => {
                resetMeetingDetails();
              }}
            />
          </View>

        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Meeting ID or Meeting URL here."
            onChangeText={(text) => {
              setMeetingId(text);
            }}
          />

          <Pressable
            onPress={() => {
              viewMeeting(true);
            }}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.5 : 1 },
            ]}>
            <Text style={styles.buttonText}>Join</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
