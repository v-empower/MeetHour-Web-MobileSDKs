import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import MeetHour, { MeetHourView } from 'react-native-meet-hour-sdk';

import styles from './styles/styles';
import strings from './lang/strings';

function App() {
 
  const [showMeet, setShowMeet] = useState();
  const [serverUrl, setServerUrl] = useState('');
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [audioMuted, setAudioMuted] = useState();
  const [videoMuted, setVideoMuted] = useState();
  
  const runMeet = () => {
    setShowMeet(true);
    MeetHour.activityMode({
      serverUrl: serverUrl,
      roomId: roomName,
      subject: subject,
      userInfo: {
        displayName: displayName,
        email: email,
        avatar: strings.avatar.avatarURL,
      },
      audioMuted: audioMuted,
      videoMuted: videoMuted
    })
    cleanUp();
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log(nativeEvent)
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log(nativeEvent)
  }

  function onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log(nativeEvent)
    setShowMeet(false);
  }

  function cleanUp() {
    setServerUrl('')
    setRoomName('')
    setSubject('')
    setDisplayName('')
    setEmail('')
    setAudioMuted(false)
    setVideoMuted(false)
  }

  return (
    <View style={styles.container}>
      {showMeet && (
        <MeetHourView
          onConferenceTerminated={e => onConferenceTerminated(e)}
          onConferenceJoined={e => onConferenceJoined(e)}
          onConferenceWillJoin={e => onConferenceWillJoin(e)}
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
          }}
        />
      )}

      <ScrollView>
        <ImageBackground
          source={require('./images/MeetHour_logo.png')}
          style={styles.image}
          resizeMode='contain'
        />
        <TextInput
          style={styles.textInput}
          value={serverUrl}
          placeholder={strings.placeholders.serverURL}
          onChangeText={text => setServerUrl(text)}
          keyboardType={'url'}
          autoCapitalize={'none'}
        />
        <TextInput
          style={styles.textInput}
          value={roomName}
          placeholder={strings.placeholders.roomname}
          onChangeText={text => setRoomName(text)}
        />
        <TextInput
          style={styles.textInput}
          value={subject}
          placeholder={strings.placeholders.subject}
          onChangeText={text => setSubject(text)}
        />
        <TextInput
          style={styles.textInput}
          value={displayName}
          placeholder={strings.placeholders.displayName}
          onChangeText={text => setDisplayName(text)}
          autoCapitalize={'words'}
        />
        <TextInput
          style={styles.textInput}
          value={email}
          placeholder={strings.placeholders.email}
          onChangeText={text => setEmail(text)}
          keyboardType={'email-address'}
        />
        <View style={styles.switch}>
          <Text>{strings.text.startWithAudioMuted}</Text>
          <Switch onValueChange={() => setAudioMuted(!audioMuted)} value={audioMuted} />
        </View>
        <View style={styles.switch}>
          <Text>{strings.text.startWithVideoMuted}</Text>
          <Switch onValueChange={() => setVideoMuted(!videoMuted)} value={videoMuted} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <Text>{strings.avatar.avatar}</Text>
          <Image
            style={styles.avatar}
            resizeMode='contain'
            source={{uri:strings.avatar.avatarURL}}
          />
        </View>
        <TouchableOpacity onPress={runMeet} style={styles.button}>
          <Text style={styles.buttonText}>{strings.buttons.join}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default App;
