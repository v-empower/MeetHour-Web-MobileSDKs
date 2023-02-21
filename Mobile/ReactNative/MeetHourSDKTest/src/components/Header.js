import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Button from './ButtonComponent'
import ScheduleMeetingPage from '../pages/ScheduleMeetingPage'

export default function Header(props) {
  
  return (
    <View style={styles.container}>
      <Button title="Home" backgroundColor="blue" width= {130}
      height={70} onPress={() => props.setSelectedScreen("HomePage")}/>
      <Button title="Schedule a Meeting"  backgroundColor="green" width= {130}
      height={70} onPress={() => props.setSelectedScreen("ScheduleMeeting")}/>
      <Button title="Join Meeting"  backgroundColor="orange" width= {130}
      height={70} onPress={() => props.setSelectedScreen("JoinMeeting")}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    position: 'absolute',
    top: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  }
})