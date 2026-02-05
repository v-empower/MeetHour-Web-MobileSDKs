import 'package:MeetHourSDKTest/pages/homepage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_datetime_picker_plus/flutter_datetime_picker_plus.dart'
    as picker;
import 'package:meet_hour/meet_hour.dart';
import 'package:meet_hour/types/contacts_type.dart';
import 'package:meet_hour/types/schedule_meeting_type.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';
import 'package:intl/intl.dart';
import 'joinmeeting.dart';
import 'package:MeetHourSDKTest/utils/app_storage.dart';
import 'package:MeetHourSDKTest/utils/timezone_util.dart';

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
  List<String> selectedModerators = [];
  List<String> selectedParticipants = [];
  var attend = [];
  var hostusers = [];
  List<String> timezones = [];
  List<String> contacts = [];
  List<String> selectedContacts = [];
  var contactIds = [];
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
    super.initState();
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

  Future<void> getTimezone() async {
    try {
      final String? access_token = await AppStorage.getString('access_token');
      if (access_token == null) {
        print('Error: access_token is null');
        return;
      }

      Map<String, dynamic> response = await ApiServices.timezone(access_token);

      setState(() {
        timezones.clear(); // Clear the list to avoid duplicates
        if (response['timezones'] != null && response['timezones'] is List) {
          for (var timezone in response['timezones']) {
            timezones.add(timezone['value']
                .toString()); // Ensure value is converted to String
          }
          timezones.sort((a, b) => a
              .toLowerCase()
              .compareTo(b.toLowerCase())); // Case-insensitive sort
        } else {
          print('Error: response["timezones"] is null or not a list');
        }
      });
    } catch (e) {
      print('Error in getTimezone: $e');
    }
  }

  void addParticipant(List participants) {
    var attendees = [];
    participants.forEach((element) {
      attendees.add(element.toString().split(',')[0].split('-')[1]);
    });
    setState(() {
      attend = attendees;
    });
  }

  void addModerator(List moderators) {
    var hosts = [];
    moderators.forEach((element) {
      hosts.add(element.toString().split(',')[0].split('-')[1]);
    });
    setState(() {
      hostusers = hosts;
    });
  }

  Future<dynamic> getContacts() async {
    final String? access_token = await AppStorage.getString('access_token');
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
    });
  }

  Future<dynamic> instantMeeting() async {
    setState(() {
      isInstant = true;
    });

    String timezoneResponse = '';
    try {
      // Get timezone using browser's local timezone with fallback
      timezoneResponse = getLocalTimezoneWithFallback(
        selectedTimezone: meetingTimezone,
        availableTimezones: timezones,
        defaultTimezone: 'UTC',
      );
      var now = DateTime.now();

      String formattedDate = DateFormat('dd-MM-yyyy').format(now);

      String timeString = DateFormat('hh:mm a').format(now);
      List<String> parts = timeString.split(' ');

      String time = '';
      String meridiem = '';
      if (parts.length >= 2) {
        time = parts[0]; // '09:45'
        meridiem = parts[1]; // 'AM'
      } else {
        // Fallback if format is unexpected
        time = parts[0];
        meridiem = 'AM'; // or handle error
      }
        final String? access_token = await AppStorage.getString('access_token');

      Map<String, dynamic> response = await ApiServices.scheduleMeeting(
          access_token.toString(),
          ScheduleMeetingType(
              meetingDate: formattedDate,
              meetingMeridiem: meridiem,
              meetingName: "Quick Meeting",
              meetingTime: time,
              send_calendar_invite: 1,
              is_show_portal: 1,
              options: ['ALLOW_GUEST', 'ENABLE_LOBBY', 'JOIN_ANYTIME', 'LIVEPAD', 'WHITE_BOARD', 'ENABLE_RECORDING'],
              passcode: "123456",
              timezone: timezoneResponse));
      if (response['success'] == true) {
        await AppStorage.setString(
          'meeting_id', response['data']['meeting_id'].toString());
        return response;
      }
    } catch (e) {
      print("Error In InstantMeeting: $e");
    } finally {
      setState(() {
        isInstant = false;
      });
    }
  }

  Future<void> _showMultiSelectDialog({
    required BuildContext context,
    required List<String> items,
    required List<String> selectedItems,
    required String title,
    required void Function(List<String>) onConfirm,
  }) async {
    final tempSelected = List<String>.from(selectedItems);

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(title),
          content: SingleChildScrollView(
            child: Column(
              children: items.map((item) {
                final isSelected = tempSelected.contains(item);
                return CheckboxListTile(
                  title: Text(item),
                  value: isSelected,
                  onChanged: (bool? value) {
                    if (value == true) {
                      tempSelected.add(item);
                    } else {
                      tempSelected.remove(item);
                    }
                    (context as Element)
                        .markNeedsBuild(); // Refresh dialog state
                  },
                );
              }).toList(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                onConfirm(tempSelected);
              },
              child: const Text("Confirm"),
            ),
          ],
        );
      },
    );
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
        final String? access_token = await AppStorage.getString('access_token');
      Map<String, dynamic> response = await ApiServices.scheduleMeeting(
          access_token.toString(),
          ScheduleMeetingType(
              meetingDate: meetingDate,
              meetingMeridiem: meetingMeridiem,
              meetingName: meetingName,
              meetingTime: meetingTime,
              passcode: passcode,
              timezone: meetingTimezone,
              is_show_portal: 1,
              send_calendar_invite: 1,
              attend: attend,
              options: ['ALLOW_GUEST', 'ENABLE_LOBBY', 'JOIN_ANYTIME', 'LIVEPAD', 'WHITE_BOARD', 'ENABLE_RECORDING'],
              hostusers: hostusers));
      if (response['success'] == true) {
        await AppStorage.setString(
          'meeting_id', response['data']['meeting_id'].toString());
        return response;
      }
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
              backgroundColor: Color.fromARGB(255, 5, 5, 5),
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
                          picker.DatePicker.showTimePicker(
                            context,
                            showTitleActions: true,
                            onChanged: (time) {
                              print('change $time'); // Debug: Log time changes
                            },
                            onConfirm: (time) {
                              try {
                                // Format time in 12-hour format with leading zero for hours
                                int hour = time.hour % 12;
                                if (hour == 0)
                                  hour = 12; // Handle midnight/noon
                                String formattedTime =
                                    '${hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')} ${time.hour >= 12 ? 'PM' : 'AM'}';

                                // Split the formatted time
                                List<String> timeParts =
                                    formattedTime.split(' ');
                                String meetingTimeTemp = '';
                                String meetingMeridiemTemp = '';

                                // Check if split produced at least two parts
                                if (timeParts.length >= 2) {
                                  meetingTimeTemp =
                                      timeParts[0]; // e.g., "06:50"
                                  meetingMeridiemTemp =
                                      timeParts[1]; // e.g., "PM"
                                } else {
                                  meetingTimeTemp = DateFormat.Hm('en_US')
                                      .format(time); // e.g., "18:50"
                                  meetingMeridiemTemp =
                                      time.hour >= 12 ? 'PM' : 'AM';
                                  // Convert to 12-hour format with leading zero
                                  hour = time.hour % 12;
                                  if (hour == 0) hour = 12;
                                  meetingTimeTemp =
                                      '${hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                                }

                                setState(() {
                                  meetingTime = meetingTimeTemp;
                                  meetingMeridiem = meetingMeridiemTemp;
                                });
                              } catch (e) {
                                print('Error formatting time: $e');
                                // Fallback values
                                setState(() {
                                  int hour = time.hour % 12;
                                  if (hour == 0) hour = 12;
                                  meetingTime =
                                      '${hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                                  meetingMeridiem =
                                      time.hour >= 12 ? 'PM' : 'AM';
                                });
                              }
                            },
                            currentTime:
                                DateTime.now(), // Default to 07:10 PM IST
                            locale:
                                picker.LocaleType.en, // Ensure 12-hour format
                          );
                        },
                        child: Text(
                          'Select Meeting Time',
                          style: TextStyle(color: Colors.blue),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: DropdownButtonFormField<String>(
                          decoration: const InputDecoration(
                            labelText: "Select Timezone",
                            hintText: "Select your timezone",
                            border: OutlineInputBorder(),
                          ),
                          value: meetingTimezone.isNotEmpty
                              ? meetingTimezone
                              : null,
                          items: timezones.map((String timezone) {
                            return DropdownMenuItem<String>(
                              value: timezone,
                              child: Text(timezone),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            if (newValue != null) {
                              setState(() {
                                meetingTimezone = newValue;
                              });
                            }
                          },
                        ),
                      ),

                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Select Participant/s"),
                            const SizedBox(height: 5),
                            ElevatedButton(
                              onPressed: () {
                                _showMultiSelectDialog(
                                  context: context,
                                  items: contacts,
                                  selectedItems: selectedParticipants,
                                  title: "Select Participant/s",
                                  onConfirm: (selected) {
                                    setState(() {
                                      selectedParticipants = selected;
                                      selectedModerators.retainWhere((moderator) => selectedParticipants.contains(moderator));
                                    });
                                    addParticipant(selected);
                                  },
                                );
                              },
                              child: const Text("Choose Participants"),
                            ),
                            Wrap(
                              spacing: 6.0,
                              children: selectedParticipants
                                  .map((e) => Chip(label: Text(e)))
                                  .toList(),
                            ),
                          ],
                        ),
                      ),

                      Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Select Moderator/s"),
                            const SizedBox(height: 5),
                            ElevatedButton(
                              onPressed: () {
                                _showMultiSelectDialog(
                                  context: context,
                                  items: selectedParticipants,
                                  selectedItems: selectedModerators,
                                  title: "Select Moderator/s",
                                  onConfirm: (selected) {
                                    setState(() {
                                      selectedModerators = selected;
                                    });
                                    addModerator(selected);
                                  },
                                );
                              },
                              child: const Text("Choose Moderators"),
                            ),
                            Wrap(
                              spacing: 6.0,
                              children: selectedModerators
                                  .map((e) => Chip(label: Text(e)))
                                  .toList(),
                            ),
                          ],
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
                          print("Response " +response.toString());
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
