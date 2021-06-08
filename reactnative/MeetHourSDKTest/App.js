import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ImageBackground,
  Dimensions
} from 'react-native';
import MeetHour, { MeetHourView } from 'react-native-meet-hour-sdk';

const {width, height} = Dimensions.get("window")

function App() {
 
  const [showMain, setShowMain] = useState(true);  
  const [showMeet, setShowMeet] = useState();
  const [serverUrl, setServerUrl] = useState('https://meethour.io/');
  const [roomName, setRoomName] = useState('MeetHourSampleTest');
  const [subject, setSubject] = useState();
  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState();
  const [audioMuted, setAudioMuted] = useState()
  const [videoMuted, setVideoMuted] = useState();
  
  const runMeet = () => {
    setShowMeet(true);
    setShowMain(false);
    const url = serverUrl + roomName;  
    const userInfo = {
      subject: subject,
      displayName: displayName,
      email: email
    };
    if (videoMuted) {
      MeetHour.audioCall(url, userInfo);  
    } else {
      MeetHour.call(url, userInfo);
    }
  }

  const leaveMeet = () => {
    // MeetHour.leaveMeet()
  }

  const runActivity = () => {
    // MeetHour.activityMode({
    //   roomId: "cowboybtr125d44d5",
    //   userInfo: {
    //     displayName: "APJ"
    //   }
    // })
  }

  const muteAudio = () => {
    // MeetHour.muteAudio(true)
  }

  function onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log(nativeEvent)
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log(nativeEvent)
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log(nativeEvent)
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

    {showMain && (
      <View>
        <ImageBackground
          source={require('./images/MeetHour_logo.png')}
          style={styles.image}
          resizeMode='contain'
        />
        <TextInput
          style={styles.textInput}
          value={serverUrl}
          placeholder={"Server URL"}
          onChangeText={text => setServerUrl(text)}
        />
        <TextInput
          style={styles.textInput}
          value={roomName}
          placeholder={"Room Name"}
          onChangeText={text => setRoomName(text)}
        />
        <TextInput
          style={styles.textInput}
          value={subject}
          placeholder={"Subject"}
          onChangeText={text => setSubject(text)}
        />
        <TextInput
          style={styles.textInput}
          value={displayName}
          placeholder={"Display Name"}
          onChangeText={text => setDisplayName(text)}
        />
        <TextInput
          style={styles.textInput}
          value={email}
          placeholder={"Email"}
          onChangeText={text => setEmail(text)}
        />
        <View style={styles.switch}>
          <Text>Start with audio muted</Text>
          <Switch onValueChange={() => setAudioMuted(!audioMuted)} value={audioMuted} />
        </View>
        <View style={styles.switch}>
          <Text>Start with video muted</Text>
          <Switch onValueChange={() => setVideoMuted(!videoMuted)} value={videoMuted} />
        </View>
        <TouchableOpacity onPress={runMeet} style={styles.button}>
          <Text style={styles.buttonText}>Join Meeting</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    margin: 10,
    height: 50,
  },
  textInput: {
    borderRadius: 10,
    padding:10,
    margin:5,
    borderWidth:2,
    borderColor: "gray",
    justifyContent:"center",
    alignItems:"center",
  },
  button: {
    borderRadius: 10,
    padding:10,
    margin:10,
    borderWidth:2,
    borderColor: "gray",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#007aff"
  },
  buttonText: {
    color: "#fff"
  },
  switch: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between'
  }
});

export default App;
