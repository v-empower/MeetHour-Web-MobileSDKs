import 'package:MeetHourSDKTest/pages/homepage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_datetime_picker_plus/flutter_datetime_picker_plus.dart' as picker;
import 'package:meet_hour/meet_hour.dart';
import 'package:meet_hour/types/contacts_type.dart';
import 'package:meet_hour/types/schedule_meeting_type.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';
import 'package:dropdown_search/dropdown_search.dart';
import 'package:intl/intl.dart';
import 'package:flutter_native_timezone/flutter_native_timezone.dart';
import 'joinmeeting.dart';

void main() {
  runApp(ScheduleMeeting());
}

class ScheduleMeeting extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    const appTitle = 'Schedule a Meeting';
    return MaterialApp(
      title: appTitle,
      home: Scaffold(
        appBar: AppBar(
          title: const Text(appTitle),
        ),
        body: MyCustomForm(),
      ),
    );
  }
}

// Create a Form widget.
class MyCustomForm extends StatefulWidget {
  @override
  MyCustomFormState createState() {
    return MyCustomFormState();
  }
}

// Create a corresponding State class.
// This class holds data related to the form.
class MyCustomFormState extends State<MyCustomForm> {
  String meetingName = "";
  String passcode = "";
  String meetingDate = "";
  String meetingTime = "";
  String meetingMeridiem = "";
  String meetingTimezone = "";
  var attend = [];
  var hostusers = [];
  List<String> timezones = [];
  List<String> contacts = [];
  List<String> contactIds = [];
  final _formKey = GlobalKey<FormState>();
  bool isLoader = false;
  bool isInstant = false;
  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  void _onItemTapped(int index) {
    print(index);
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    this.getContacts();
    this.getTimezone();
  }

  // Create a global key that uniquely identifies the Form widget
  // and allows validation of the form.
  //
  // Note: This is a GlobalKey<FormState>,
  // not a GlobalKey<MyCustomFormState>.

  Widget loader() {
    return Container(
      child: CircularProgressIndicator(
        semanticsLabel: 'Circular progress indicator',
      ),
    );
  }

  Widget emptyWidget() {
    return SizedBox.shrink();
  }

  void onDateSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    print(args.value);
  }

  Future<dynamic> getTimezone() async {
    final prefs = await SharedPreferences.getInstance();
    final String? access_token = prefs.getString('access_token');
    Map<String, dynamic> response =
        await ApiServices.timezone(access_token.toString());
    setState(() {
      for (var timezone in response['timezones']) {
        timezones.add(timezone['value'].toString());
      }
    });
  }

  void addParticipant(List participants) {
    var attendees = [];
    participants.forEach((element) {
      attendees.add(element.toString().split(',')[0].split('-')[1]);
    });
    print(attendees);
    setState(() {
      attend = attendees;
    });
  }

  void addModerator(List moderators) {
    var hosts = [];
    moderators.forEach((element) =>
        {hosts.add(element.toString().split(',')[0].split('-')[1])});
    print(hosts);
    setState(() {
      hostusers = hosts;
    });
  }

  Future<dynamic> getContacts() async {
    final prefs = await SharedPreferences.getInstance();
    final String? access_token = prefs.getString('access_token');
    Map<String, dynamic> response = await ApiServices.contactsList(
        access_token.toString(),
        ContactsType(exclude_hosts: 0, limit: 0, page: 0));
    setState(() {
      for (var contact in response['contacts']) {
        contacts.add('ID-' +
            contact['id'].toString() +
            ', Email-' +
            contact['email'].toString());
        ;
      }
      print(contactIds);
    });
  }

  Future<dynamic> instantMeeting() async {
    setState(() {
      isInstant = true;
    });
    String timezoneResponse = '';
    try {
      timezoneResponse = await FlutterNativeTimezone.getLocalTimezone();
      var now = new DateTime.now();
      var formatter = new DateFormat('dd-MM-yyyy');
      String formattedDate = formatter.format(now);
      var time = DateFormat.jm().format(now).split(" ")[0];
      var meridiem = DateFormat.jm().format(now).split(" ")[1];
      if (time[1] == ':') {
        time = '0' + time;
      }
      final prefs = await SharedPreferences.getInstance();
      final String? access_token = prefs.getString('access_token');
      Map<String, dynamic> response = await ApiServices.scheduleMeeting(
          access_token.toString(),
          ScheduleMeetingType(
              meetingDate: formattedDate,
              meetingMeridiem: meridiem,
              meetingName: "Quick Meeting",
              meetingTime: time,
              passcode: "123456",
              timezone: timezoneResponse));
      if (response['success'] == true) {
        prefs.setString('meeting_id', response['data']['meeting_id']);
        return response;
      }
    } catch (e) {
      print(e);
    } finally {
      setState(() {
        isInstant = false;
      });
    }
  }

  Future<dynamic> scheduleMeeting() async {
    setState(() {
      isLoader = true;
    });
    try {
      var time = '';
      if (meetingTime.split(':')[0].length == 1) {
        time = '0' + meetingTime;
      }
      final prefs = await SharedPreferences.getInstance();
      final String? access_token = prefs.getString('access_token');
      Map<String, dynamic> response = await ApiServices.scheduleMeeting(
          access_token.toString(),
          ScheduleMeetingType(
              meetingDate: meetingDate,
              meetingMeridiem: meetingMeridiem,
              meetingName: meetingName,
              meetingTime: time,
              passcode: passcode,
              timezone: meetingTimezone,
              attend: attend,
              hostusers: hostusers));
      if (response['success'] == true) {
        print("Working");
        prefs.setString('meeting_id', response['data']['meeting_id']);
        return response;
      }
      print(response);
    } catch (error) {
      print(error);
    } finally {
      setState(() {
        isLoader = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Build a Form widget using the _formKey created above.
    return Scaffold(
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
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Homepage()),
              );
            } else if (index == 1) {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ScheduleMeeting()),
              );
            } else {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => JoinMeeting()),
              );
            }
          },
        ),
        body: SingleChildScrollView(
          padding: EdgeInsets.all(10),
          child: Form(
              key: _formKey,
              child: Column(
                children: [
                  Container(
                    child: Column(
                      children: [
                        Container(
                            margin: EdgeInsets.all(15),
                            child: Text("MeetHour Example - Flutter",
                                style: TextStyle(
                                    fontSize: 25,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.blueAccent))),
                        Container(
                            child: Text(
                                "Step One -  Fill the required fields like meeting name, passcode, meeting date, meeting time, meeting meridiem and timezone in the Schedule a Meeting Form.",
                                style: TextStyle(fontSize: 20))),
                        SizedBox(
                          height: 30, // <-- SEE HERE
                        ),
                        Container(
                            child: Text(
                                "Step Two - After adding all the necessary fields, now add participants and moderators. Note: To start a meeting, atleast one moderator is required.",
                                style: TextStyle(fontSize: 20))),
                        SizedBox(
                          height: 30, // <-- SEE HERE
                        ),
                        Container(
                            child: Text(
                                "Step Three - You can choose general options according to your requirements.",
                                style: TextStyle(fontSize: 20))),
                        SizedBox(
                          height: 30, // <-- SEE HERE
                        ),
                        Container(
                            child: Text(
                                "Step Four - After filling all the fields, now you can click on Schedule a Meeting button which will take you to the joining page.",
                                style: TextStyle(fontSize: 20))),
                        SizedBox(
                          height: 30, // <-- SEE HERE
                        ),
                        Container(
                            child: Text(
                                "Step Five - In joining page you will be asked, whom do you want to join as. Choose and go ahead to the meeting.",
                                style: TextStyle(fontSize: 20))),
                        SizedBox(
                          height: 30, // <-- SEE HERE
                        )
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: TextFormField(
                          onChanged: (text) {
                            setState(() {
                              meetingName = text;
                            });
                          },
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Meeting Name'),
                          // The validator receives the text that the user has entered.
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some text';
                            }
                            return null;
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: TextFormField(
                          onChanged: (text) {
                            setState(() {
                              passcode = text;
                            });
                          },
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Meeting Passcode'),
                          // The validator receives the text that the user has entered.
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Cannot leave this field empty';
                            }
                            return null;
                          },
                        ),
                      ),

                      //   SfDateRangePicker(
                      //   onSelectionChanged: onDateSelectionChanged,
                      //   selectionMode: DateRangePickerSelectionMode.single,
                      // ),
                      TextButton(
                          onPressed: () {
                            picker.DatePicker.showDatePicker(context,
                                showTitleActions: true,
                                minTime: DateTime(DateTime.now().year,
                                    DateTime.now().month, DateTime.now().day),
                                onChanged: (date) {}, onConfirm: (date) {
                              setState(() {
                                meetingDate = DateFormat('dd-MM-yyyy')
                                    .format(date)
                                    .toString();
                              });
                              print(meetingDate);
                            },
                                currentTime: DateTime.now(),
                                locale: picker.LocaleType.en);
                          },
                          child: Text(
                            'Select Meeting Date',
                            style: TextStyle(color: Colors.blue),
                          )),
                      TextButton(
                          onPressed: () {
                            picker.DatePicker.showTimePicker(context,
                                showTitleActions: true, onChanged: (time) {
                              print('change $time');
                            }, onConfirm: (time) {
                              setState(() {
                                meetingTime =
                                    DateFormat.jm().format(time).split(' ')[0];
                                meetingMeridiem =
                                    DateFormat.jm().format(time).split(' ')[1];
                              });
                            },
                                currentTime: DateTime.now(),
                                locale: picker.LocaleType.en);
                          },
                          child: Text(
                            'Select Meeting Time',
                            style: TextStyle(color: Colors.blue),
                          )),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: DropdownSearch<String>(
                          popupProps: PopupProps.menu(
                            showSelectedItems: true,
                          ),
                          items: timezones,
                          dropdownDecoratorProps: DropDownDecoratorProps(
                            dropdownSearchDecoration: InputDecoration(
                              labelText: "Select Timezone",
                              hintText: "Select your timezone",
                            ),
                          ),
                          onChanged: (timezone) {
                            setState(() {
                              meetingTimezone = timezone.toString();
                            });
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: DropdownSearch<String>.multiSelection(
                          items: contacts,
                          dropdownDecoratorProps: DropDownDecoratorProps(
                            dropdownSearchDecoration: InputDecoration(
                              labelText: "Select Participant/s",
                              hintText: "Select Participant/s",
                            ),
                          ),
                          popupProps: PopupPropsMultiSelection.menu(
                            showSelectedItems: true,
                          ),
                          onChanged: (participants) {
                            addParticipant(participants);
                            // addParticipant(participants);
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: DropdownSearch<String>.multiSelection(
                          items: contacts,
                          dropdownDecoratorProps: DropDownDecoratorProps(
                            dropdownSearchDecoration: InputDecoration(
                              labelText: "Select Moderator/s",
                              hintText: "Select Moderator/s",
                            ),
                          ),
                          popupProps: PopupPropsMultiSelection.menu(
                            showSelectedItems: true,
                          ),
                          onChanged: (moderators) {
                            addModerator(moderators);
                          },
                        ),
                      ),
                      Container(
                        child: isLoader ? loader() : emptyWidget(),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: ElevatedButton(
                          onPressed: () async {
                            // Validate returns true if the form is valid, or false otherwise.
                            var response = await scheduleMeeting();
                            if (response['success'] == true) {
                              var meetingId = response['data']['meeting_id'];
                              var topic = response['data']['topic'];
                              var joinURL = response['data']['joinURL'];
                              var pcode = response['data']['pcode'];
                              showModalBottomSheet<void>(
                                context: context,
                                builder: (BuildContext context) {
                                  return Container(
                                    height: 400,
                                    child: Center(
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        mainAxisSize: MainAxisSize.min,
                                        children: <Widget>[
                                          Container(
                                              child:
                                                  Text("Meeting name - $topic",
                                                      style: TextStyle(
                                                        fontSize: 20,
                                                      ))),
                                          Container(
                                              child: SelectableText(
                                                  "Meeting Id - $meetingId",
                                                  style:
                                                      TextStyle(fontSize: 20))),
                                          Container(
                                              child: Text("Pcode - $pcode",
                                                  style:
                                                      TextStyle(fontSize: 20))),
                                          Container(
                                              child: SelectableText(
                                                  "Meeting Join Url - $joinURL",
                                                  style:
                                                      TextStyle(fontSize: 20))),
                                          ElevatedButton(
                                            child:
                                                const Text('Close BottomSheet'),
                                            onPressed: () =>
                                                Navigator.pop(context),
                                          ),
                                          ElevatedButton(
                                            child: const Text('Join Meeting'),
                                            onPressed: () {
                                              Navigator.of(context).push(
                                                MaterialPageRoute(
                                                    builder: (context) =>
                                                        JoinMeeting()),
                                              );
                                            },
                                          )
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              );
                            }
                          },
                          child: const Text('Schedule a meeting',
                              style: TextStyle(fontSize: 20)),
                        ),
                      ),
                      Container(
                        child: isInstant ? loader() : emptyWidget(),
                      ),
                      ElevatedButton(
                        onPressed: () async {
                          // Validate returns true if the form is valid, or false otherwise.
                          var response = await instantMeeting();
                          if (response['success'] == true) {
                            var meetingId = response['data']['meeting_id'];
                            var topic = response['data']['topic'];
                            var joinURL = response['data']['joinURL'];
                            var pcode = response['data']['pcode'];
                            showModalBottomSheet<void>(
                              context: context,
                              builder: (BuildContext context) {
                                return Container(
                                  height: 400,
                                  child: Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      mainAxisSize: MainAxisSize.min,
                                      children: <Widget>[
                                        Container(
                                            child: Text("Meeting name - $topic",
                                                style: TextStyle(
                                                  fontSize: 20,
                                                ))),
                                        Container(
                                            child: SelectableText(
                                                "Meeting Id - $meetingId",
                                                style:
                                                    TextStyle(fontSize: 20))),
                                        Container(
                                            child: Text("Pcode - $pcode",
                                                style:
                                                    TextStyle(fontSize: 20))),
                                        Container(
                                            child: SelectableText(
                                                "Meeting Join Url - $joinURL",
                                                style:
                                                    TextStyle(fontSize: 20))),
                                        ElevatedButton(
                                          child:
                                              const Text('Close BottomSheet'),
                                          onPressed: () =>
                                              Navigator.pop(context),
                                        ),
                                        ElevatedButton(
                                          child: const Text('Join Meeting'),
                                          onPressed: () {
                                            Navigator.of(context).push(
                                                MaterialPageRoute(
                                                    builder: (context) =>
                                                        JoinMeeting()),
                                              );
                                          },
                                        )
                                      ],
                                    ),
                                  ),
                                );
                              },
                            );
                          }
                        },
                        child: const Text(
                          'Instant Meeting',
                          style: TextStyle(fontSize: 20),
                        ),
                      )
                    ],
                  ),
                ],
              )),
        ));
  }
}
