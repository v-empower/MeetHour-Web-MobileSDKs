import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import HomePage from './pages/Homepage';
import Header from './components/Header';
import ScheduleMeetingPage from './pages/ScheduleMeetingPage';
import JoinMeeting from './pages/JoinMeeting';

function App() {
  const [selectedScreen, setSelectedScreen] = React.useState("HomePage")
  const [showMeetHourView, setShowMeetHourView] = React.useState(false);
  return (
      <View>
        <ScrollView>
          {showMeetHourView ? <></> : <Header setSelectedScreen={setSelectedScreen}/>}
          {selectedScreen === "HomePage" ? <HomePage/> : (selectedScreen === "ScheduleMeeting" ? <ScheduleMeetingPage setSelectedScreen={setSelectedScreen}/> : <JoinMeeting showMeetHourView={showMeetHourView} setShowMeetHourView={setShowMeetHourView} setSelectedScreen={setSelectedScreen}/>)}
        </ScrollView>
      </View>
  );
}
export default App;
