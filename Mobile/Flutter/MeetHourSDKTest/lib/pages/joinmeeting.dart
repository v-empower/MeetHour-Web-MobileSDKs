import 'dart:io';

import 'package:MeetHourSDKTest/pages/homepage.dart';
import 'package:MeetHourSDKTest/pages/schedulemeeting.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:meet_hour/meet_hour.dart';
import 'package:meet_hour/types/generate_jwt_type.dart';
import 'package:meet_hour/types/view_meeting_type.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(JoinMeeting());

class JoinMeeting extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    const appTitle = 'Join Meeting';
    return MaterialApp(
      title: appTitle,
      home: Scaffold(
        appBar: AppBar(
          title: const Text(appTitle),
        ),
        body: Meeting(),
      ),
    );
  }
}

class Meeting extends StatefulWidget {
  @override
  _MeetingState createState() => _MeetingState();
}

class _MeetingState extends State<Meeting> {
  // Create a global key that uniquely identifies the Form widget
  // and allows validation of the form.
  //
  // Note: This is a GlobalKey<FormState>,
  // not a GlobalKey<MyCustomFormState>.
  final serverText = TextEditingController(text: "https://meethour.io");
  bool? isAudioOnly = true;
  bool? isAudioMuted = true;
  bool? isVideoMuted = true;
  bool? isLoader = false;
  final _formKey = GlobalKey<FormState>();
  String meeting_id = "";
  String meetingToken = "";
  bool? isLoading = false;
  String pCode = "";
  bool isScheduled = false;
  List<String> meetingAttendees = [];
  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    // this.resetMeetingDetails();
    this.meetingCheck();
    MeetHour.addListener(MeetHourMeetingListener(
        onConferenceWillJoin: _onConferenceWillJoin,
        onConferenceJoined: _onConferenceJoined,
        onConferenceTerminated: _onConferenceTerminated,
        onError: _onError));
  }

  void meetingCheck() async {
    final prefs = await SharedPreferences.getInstance();
    final String? meeting_id = prefs.getString('meeting_id');
    if (meeting_id != null) {
      this.viewMeeting();
    }
  }

  void resetMeetingDetails() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('meeting_id');
    prefs.remove('pCode');
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => Homepage()),
    );
  }

  @override
  void dispose() {
    super.dispose();
    MeetHour.removeAllListeners();
  }

  Future<dynamic> viewMeeting() async {
    setState(() {
      isLoading = true;
    });
    final prefs = await SharedPreferences.getInstance();
    final String? access_token = prefs.getString('access_token');
    final String? meetingId = prefs.getString('meeting_id');
    try {
      var response = await ApiServices.viewMeeting(
          access_token.toString(),
          ViewMeetingType(
              meeting_id:
                  meetingId != null ? meetingId.toString() : meeting_id));
      prefs.setString('pCode', response['meeting']['pcode']);
      List<String> temporaryArray = [];
temporaryArray.add(
  response['organizer']['name'] + ' (Organizer / Account Owner)');
for (var attendee in response['meeting_attendees']) {
  temporaryArray.add('ID-' +
      attendee['contact_id'].toString() +
      ', Email-' +
      attendee['email'].toString());
}
      
      setState(() {
        pCode = prefs.getString('pCode').toString();
        meetingAttendees = temporaryArray;
        isScheduled = true;
      });
    } catch (error) {
      print(error);
    }
    finally{
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<dynamic> getJwtToken(String details) async {
    var contactId;
    if (details.contains(", Email")) {
      contactId = int.parse(details.toString().split(',')[0].split('-')[1]);
    }
    final prefs = await SharedPreferences.getInstance();
    final String? meetingId = prefs.getString('meeting_id');
    final String? access_token = prefs.getString('access_token');
    try {
      // var response = await ApiServices.generateJwt(
      //     access_token.toString(),
      //     GenerateJwtType(
      //         meetingid: meetingId != null ? meetingId.toString() : meeting_id,
      //         contactid: contactId));
      var response = await ApiServices.generateJwt(
          access_token.toString(),
          GenerateJwtType(
              meetingid: meetingId != null ? meetingId.toString() : meeting_id, contactid: contactId));
      setState(() {
        meetingToken = response['jwt'];
      });
      await _joinMeeting(response['jwt']);
    } catch (error) {
      print(error);
    }
  }

  _onAudioOnlyChanged(bool? value) {
    setState(() {
      isAudioOnly = value;
    });
  }

  _onAudioMutedChanged(bool? value) {
    setState(() {
      isAudioMuted = value;
    });
  }

  _onVideoMutedChanged(bool? value) {
    setState(() {
      isVideoMuted = value;
    });
  }

  _joinMeeting(String token) async {
    String? serverUrl = serverText.text.trim().isEmpty ? null : serverText.text;
    final prefs = await SharedPreferences.getInstance();
    final String? meetingId = prefs.getString('meeting_id');

    // Enable or disable any feature flag here
    // If feature flag are not provided, default values will be used
    // Full list of feature flags (and defaults) available in the README
    Map<FeatureFlagEnum, bool> featureFlags = {
      FeatureFlagEnum.WELCOME_PAGE_ENABLED: false,
    };
    // Here is an example, disabling features for each platform
    if (!kIsWeb) {
      // Here is an example, disabling features for each platform
      if (Platform.isAndroid) {
        // Disable ConnectionService usage on Android to avoid issues (see README)
        featureFlags[FeatureFlagEnum.CALL_INTEGRATION_ENABLED] = true;
      } else if (Platform.isIOS) {
        // Disable PIP on iOS as it looks weird
        featureFlags[FeatureFlagEnum.PIP_ENABLED] = true;
      }
    }

    // Enabling Recording
    featureFlags[FeatureFlagEnum.IOS_RECORDING_ENABLED] = true;
    var options = MeetHourMeetingOptions(
        room: meetingId == null ? meeting_id : meetingId.toString())
      ..serverURL = serverUrl
      ..token = token
      ..pcode = pCode
      // ..iosAppBarRGBAColor = iosAppBarRGBAColor.text
      ..featureFlags.addAll(featureFlags)
      ..audioOnly = isAudioOnly
      ..audioMuted = isAudioMuted
      ..videoMuted = isVideoMuted
      ..prejoinPageEnabled = true // set this to false if you want to skip the prejoin page.
      ..disableInviteFunctions = true;

    debugPrint("MeetHourMeetingOptions: $options");
    await MeetHour.joinMeeting(
      options,
      listener: MeetHourMeetingListener(
          onConferenceWillJoin: (message) {
            debugPrint("${options.room} will join with message: $message");
          },
          onConferenceJoined: (message) {
            debugPrint("${options.room} joined with message: $message");
          },
          onConferenceTerminated: (message) {
            debugPrint("${options.room} terminated with message: $message");
          },
          genericListeners: [
            MeetHourGenericListener(
                eventName: 'readyToClose',
                callback: (dynamic message) {
                  debugPrint("readyToClose callback");
                }),
          ]),
    );
  }

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    Padding child;
    return MaterialApp(
      home: Scaffold(
        bottomNavigationBar: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
              backgroundColor: Colors.pink,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.meeting_room_sharp),
              label: 'Schedule',
              backgroundColor: Colors.green,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.meeting_room_rounded),
              label: 'Join',
              backgroundColor: Colors.purple,
            )
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Colors.black,
          onTap: (index) {
            if (index == 0) {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => Homepage()),
              );
            } else if (index == 1) {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => ScheduleMeeting()),
              );
            } else {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => JoinMeeting()),
              );
            }
          },
        ),
        body: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 16.0,
          ),
          child: kIsWeb
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: width * 0.30,
                      child: meetConfig(),
                    ),
                    Container(
                        width: width * 0.60,
                  child: child= Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Card(
                              color: Colors.white54,
                              child: SizedBox(
                                width: width * 0.60 * 0.70,
                                height: width * 0.60 * 0.70,
                                child: MeetHourConferencing(
                                  extraJS: [
                                    // extraJs setup example
                                    '<script>function echo(){console.log("echo!!!")};</script>',
                                    '<script src="https://code.jquery.com/jquery-3.5.1.slim.js" integrity="sha256-DrT5NfxfbHvMHux31Lkhxg42LY6of8TaYyK50jnxRnM=" crossorigin="anonymous"></script>'
                                  ],
                                ),
                              )),
                        ))
                  ],
                )
              : meetConfig(),
        ),
      ),
    );
  }

  Widget loader() {
    return Container(
      child: CircularProgressIndicator(
        semanticsLabel: 'Circular progress indicator',
      ),
    );
  }

  Widget meetConfig() {
  return Scaffold(
    body: isLoading == true
        ? loader()
        : Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: isScheduled
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        DropdownButtonFormField<String>(
                          decoration: const InputDecoration(
                            labelText: "You would like to join as -",
                            border: OutlineInputBorder(),
                          ),
                          value: meetingAttendees.isNotEmpty
                              ? meetingAttendees[0]
                              : null,
                          items: meetingAttendees.map((String attendee) {
                            return DropdownMenuItem<String>(
                              value: attendee,
                              child: Text(
                                attendee,
                                overflow: TextOverflow.ellipsis,
                              ),
                            );
                          }).toList(),
                          onChanged: (String? selectedAttendee) {
                            if (selectedAttendee != null) {
                              getJwtToken(selectedAttendee);
                            }
                          },
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: resetMeetingDetails,
                          child: const Text('Reset Meeting Details'),
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextFormField(
                          onChanged: (text) {
                            setState(() {
                              meeting_id = text;
                            });
                          },
                          decoration: const InputDecoration(
                            hintText: "Please enter meeting ID",
                            border: OutlineInputBorder(),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter meeting ID';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: viewMeeting,
                          child: const Text('Join Meeting'),
                        ),
                      ],
                    ),
            ),
          ),
  );
}

}

void _onConferenceWillJoin(message) {
  debugPrint("_onConferenceWillJoin broadcasted with message: $message");
}

void _onConferenceJoined(message) {
  debugPrint("_onConferenceJoined broadcasted with message: $message");
}

void _onConferenceTerminated(message) {
  debugPrint("_onConferenceTerminated broadcasted with message: $message");
}

_onError(error) {
  debugPrint("_onError broadcasted: $error");
}
