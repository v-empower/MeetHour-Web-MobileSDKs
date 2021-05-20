import React, {useEffect} from 'react';
import MeetHour, {MeetHourView} from 'react-native-meet-hour-sdk';

function App() {
  useEffect(() => {
    setTimeout(() => {
      const url = 'https://meethour.io/example';
      const userInfo = {
        displayName: 'User',
        // email: 'user@example.com',
        // avatar: 'https:/gravatar.com/avatar/abc123',
      };
      MeetHour.call(url, userInfo);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      MeetHour.endCall();
    };
  });

  function onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log(nativeEvent);
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log(nativeEvent);
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log(nativeEvent);
  }
  return (
    <MeetHourView
      onConferenceTerminated={(e) => onConferenceTerminated(e)}
      onConferenceJoined={(e) => onConferenceJoined(e)}
      onConferenceWillJoin={(e) => onConferenceWillJoin(e)}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    />
  );
}

export default App;
