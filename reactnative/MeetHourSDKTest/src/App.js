import MeetHour, { MeetHourView } from 'react-native-meet-hour-sdk';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';

import styles from './styles/styles';
import strings from './lang/strings';

const conferenceOptions = {
  room: strings.roomName,
  userInfo: {
    displayName: strings.alien,
    email: strings.avatar.email,
    avatar: strings.avatar.avatarURL,
  },
  featureFlags: {
    'live-streaming.enabled': false,
  },
};

function App() {
  const [showMeetHourView, setShowMeetHourView] = useState(false);
  const [meetInfo, setMeetInfo] = useState({
    room: strings.roomName,
    userInfo: {
      displayName: strings.displayName,
      email: strings.avatar.email,
      avatar: strings.avatar.avatarURL,
    },
    featureFlags: {
      'live-streaming.enabled': true,
    },
    serverUrl: strings.serverURL,
    subject: strings.subject,
    audioMuted: false,
    videoMuted: false,
    token: strings.token
  });

  const startMeetHourAsNativeController = async () => {
    /* 
      Mode 1 - Starts a new MeetHour Activity/UIViewController on top of RN Application (outside of JS).
      It doesn't require rendering MeetHourView Component.
    */

    await MeetHour.launchMeetHourView(meetInfo);

    /*
      Note:
        MeetHour.launchMeetHourView will return a promise, which is resolved once the conference is terminated and the MeetHourView is dismissed.
    */
  };

  if (showMeetHourView) {
    /* Mode 2 - Starts MeetHour as a RN View */

    return (
      <MeetHourView
        style={styles.meetHourViewContainer}
        options={conferenceOptions}
        onConferenceTerminated={(_) => setShowMeetHourView(false)}
        onConferenceJoined={(e) => console.log(e.nativeEvent)}
        onConferenceWillJoin={(e) => console.log(e.nativeEvent)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={require('./images/MeetHour_logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <TextInput
          style={styles.textInput}
          value={meetInfo.serverUrl}
          placeholder={strings.placeholders.serverURL}
          onChangeText={(text) =>
            setMeetInfo((prev) => ({ ...prev, serverUrl: text }))
          }
          keyboardType={'url'}
          autoCapitalize={'none'}
        />
        <TextInput
          style={styles.textInput}
          value={meetInfo.room}
          placeholder={strings.placeholders.roomname}
          onChangeText={(text) =>
            setMeetInfo((prev) => ({ ...prev, room: text }))
          }
        />
        <TextInput
          style={styles.textInput}
          value={meetInfo.subject}
          placeholder={strings.placeholders.subject}
          onChangeText={(text) =>
            setMeetInfo((prev) => ({ ...prev, subject: text }))
          }
        />
        <TextInput
          style={styles.textInput}
          value={meetInfo.userInfo.displayName}
          placeholder={strings.placeholders.displayName}
          onChangeText={(text) =>
            setMeetInfo((prev) => ({
              ...prev,
              userInfo: { ...prev.userInfo, displayName: text },
            }))
          }
          autoCapitalize={'words'}
        />
        <TextInput
          style={styles.textInput}
          value={meetInfo.userInfo.email}
          placeholder={strings.placeholders.email}
          onChangeText={(text) =>
            setMeetInfo((prev) => ({
              ...prev,
              userInfo: { ...prev.userInfo, email: text },
            }))
          }
          keyboardType={'email-address'}
        />
        <View style={styles.switch}>
          <Text>{strings.text.startWithAudioMuted}</Text>
          <Switch
            onValueChange={() =>
              setMeetInfo((prev) => ({
                ...prev,
                audioMuted: !meetInfo.audioMuted,
              }))
            }
            value={meetInfo.audioMuted}
          />
        </View>
        <View style={styles.switch}>
          <Text>{strings.text.startWithVideoMuted}</Text>
          <Switch
            onValueChange={() =>
              setMeetInfo((prev) => ({
                ...prev,
                videoMuted: !meetInfo.videoMuted,
              }))
            }
            value={meetInfo.videoMuted}
          />
        </View>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Text>{strings.avatar.avatar}</Text>
          <Image
            style={styles.avatar}
            resizeMode="contain"
            source={{ uri: strings.avatar.avatarURL }}
          />
        </View>
        <Pressable
          onPress={startMeetHourAsNativeController}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>{strings.buttons.joinAsRN}</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowMeetHourView(true)}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>{strings.buttons.joinAsView}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
export default App;
