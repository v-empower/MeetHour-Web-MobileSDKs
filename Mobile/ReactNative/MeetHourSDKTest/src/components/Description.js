import { View, Text, StyleSheet} from "react-native"
import React from "react"

export default function Description(props) {
    return (
        <View>
            <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>{props.isHomepage ? <Text style={{fontSize: 30, fontWeight: "bold", color: 'purple'}}>Welcome to Meet Hour React Native SDK - Example</Text> : <></>}</View>
            <Text style={styles.headingText}> {props.isHomepage ? "Steps to Authorize Meet Hour Developer account and get access token." : "Steps to Schedule a meeting"} </Text>
            <Text style={{fontWeight: "bold"}}>Step One- </Text><Text style={styles.guidelinesText}>{props.isHomepage ? "Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28days free trial." : "Fill the required fields like meeting name, passcode, meeting date, meeting time, meeting meridiem and timezone in the Schedule a Meeting Form."} </Text>
                  <Text style={{fontWeight: "bold"}}>Step Two- </Text><Text style={styles.guidelinesText}>{props.isHomepage ? "Go to the dashboard and then click on developers menu." : "After adding all the necessary fields, now add participants and moderators. Note: To start a meeting, atleast one moderator is required."} </Text>
                  <Text style={{fontWeight: "bold"}}>Step Three- </Text><Text style={styles.guidelinesText}>{props.isHomepage ? "Copy your Client ID, Client Secret, Api Key, Email/Username and Password (Meet Hour account). After copying, paste each copied text to the respective constant in the source code src/constants/index.js" : "In code, 'ALLOW_GUEST' is passed in general options. If you want you can remove it or can add more options."}</Text>
                  <Text style={{fontWeight: "bold"}}>Step Four- </Text><Text style={styles.guidelinesText}>{props.isHomepage ? "After completing all the steps given above, now click on Get Access Token given below." : "After filling all the fields, now you can click on Schedule a Meeting button which will take you to the joining page."}</Text>
                  <Text style={{fontWeight: "bold"}}>Step Five- </Text><Text style={styles.guidelinesText}>{props.isHomepage ? "As you click, your access token will be received and stored it in brower\'s localstorage. The received access token is then used for making Meet Hour rest api calls." : "In joining page you will be asked, whom do you want to join as. Choose and go ahead to the meeting."}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    guidelinesText: {
        fontSize: 17,
        marginVertical: 5
    },
    headingText: {
        fontSize: 25
    }
})