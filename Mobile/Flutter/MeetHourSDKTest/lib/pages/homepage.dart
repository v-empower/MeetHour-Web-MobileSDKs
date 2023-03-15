import 'package:MeetHourSDKTest/pages/joinmeeting.dart';
import 'package:MeetHourSDKTest/pages/schedulemeeting.dart';
import 'package:flutter/material.dart';
import 'package:meet_hour/meet_hour.dart';
import 'package:meet_hour/types/login_type.dart';
import 'package:MeetHourSDKTest/constants/index.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(Homepage());
}

class Homepage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(debugShowCheckedModeBanner: false, home: _Homepage());
  }
}

class _Homepage extends StatefulWidget {
  @override
  State<_Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<_Homepage> {
  bool isLoader = false;
  bool? isError;

  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget alert() {
    return AlertDialog(
          title: const Text('AlertDialog Title'),
          content: const Text('AlertDialog description'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.pop(context, 'Cancel'),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, 'OK'),
              child: const Text('OK'),
            ),
          ],
        );
  }

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

  @override
  Widget build(BuildContext context) {
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
            appBar: AppBar(
              title: const Text("Homepage"),
            ),
            body: SingleChildScrollView(
              padding: EdgeInsets.all(10),
              child: Container(
                child: Column(children: [
                  Container(
                      margin: EdgeInsets.all(15),
                      child: Text("MeetHour Example - Flutter",
                          style: TextStyle(
                              fontSize: 25,
                              fontWeight: FontWeight.w600,
                              color: Colors.blueAccent))),
                  Container(
                      child: Text(
                          "Step One - Go to meethour.io and signup for Developer or Higher plan. Currently we offer 28 days free trial.",
                          style: TextStyle(fontSize: 20))),
                  SizedBox(
                    height: 30, // <-- SEE HERE
                  ),
                  Container(
                      child: Text(
                          "Step Two - Go to the dashboard and then click on the developers menu.",
                          style: TextStyle(fontSize: 20))),
                  SizedBox(
                    height: 30, // <-- SEE HERE
                  ),
                  Container(
                      child: Text(
                          "Step Three - Copy your Client ID, Client Secret, Api Key, Email/Username and Password (Meet Hour account). After copying, paste each copied text to the respective constant in the source code lib/constants/index.dart",
                          style: TextStyle(fontSize: 20))),
                  SizedBox(
                    height: 30, // <-- SEE HERE
                  ),
                  Container(
                      child: Text(
                          "Step Four - After completing all the steps given above, now click on Get Access Token given below.",
                          style: TextStyle(fontSize: 20))),
                  SizedBox(
                    height: 30, // <-- SEE HERE
                  ),
                  Container(
                      child: Text(
                          "Step Five - As you click, your access token will be received and stored it in brower\'s localstorage. The received access token is then used for making Meet Hour rest api calls.",
                          style: TextStyle(fontSize: 20))),
                  SizedBox(
                    height: 30, // <-- SEE HERE
                  ),
                  Container(
                    child: isLoader ? loader() : emptyWidget(),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      // Validate returns true if the form is valid, or false otherwise.
                      getAccessToken();
                    },
                    child: const Text(
                      'Get Access Token',
                      style: TextStyle(fontSize: 20),
                    ),
                  )
                ]),
              ),
            )));
  }

  Future<dynamic> getAccessToken() async {
    setState(() {
      isLoader = true;
    });
    try {
      // Obtain shared preferences.
      LoginType body = LoginType(
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        password: PASSWORD,
        grant_type: 'password',
        username: USERNAME
    );
      Map<String, dynamic> response = await ApiServices.login(
          body);
      final prefs = await SharedPreferences.getInstance();
      prefs.setString('access_token', response['access_token']);
      final String? access_token = prefs.getString('access_token');
      return access_token;
    } catch (error) {
      print(error);
    } finally {
      setState(() {
        isLoader = false;
      });
    }
  }
}
