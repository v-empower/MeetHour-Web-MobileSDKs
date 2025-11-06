import 'package:flutter/material.dart';
import 'package:MeetHourSDKTest/pages/homepage.dart';
import 'package:meet_hour/meet_hour.dart';

void main() async {

  // final brandedURL = 'https://your.branded.domain';

  // Set it once — use throughout the app
  // ApiServices.setBaseUrl(brandedURL); // Uncomment if you want to pass dynamic url.

  runApp(MaterialApp(home: Homepage()));
}