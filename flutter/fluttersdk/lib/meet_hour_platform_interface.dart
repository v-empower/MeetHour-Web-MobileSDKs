import 'package:flutter/material.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'meet_hour_options.dart';
import 'meet_hour_response.dart';
import 'meet_hour_meeting_listener.dart';
import 'method_channel_meet_hour.dart';

export 'meet_hour_meeting_listener.dart';
export 'meet_hour_options.dart';
export 'meet_hour_response.dart';
export 'feature_flag/feature_flag_helper.dart';
export 'feature_flag/feature_flag_enum.dart';

abstract class MeetHourPlatform extends PlatformInterface {
  /// Constructs a MeetHourPlatform.
  MeetHourPlatform() : super(token: _token);

  static final Object _token = Object();

  static MeetHourPlatform _instance = MethodChannelMeetHour();

  /// The default instance of [MeetHourPlatform] to use.
  ///
  /// Defaults to [MethodChannelMeetHour].
  static MeetHourPlatform get instance => _instance;

  static set instance(MeetHourPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  /// Joins a meeting based on the MeetHourMeetingOptions passed in.
  /// A MeetHourMeetingListener can be attached to this meeting that 
  /// will automatically be removed when the meeting has ended
  Future<MeetHourMeetingResponse> joinMeeting(MeetHourMeetingOptions options,
      {MeetHourMeetingListener? listener}) async {
    throw UnimplementedError('joinMeeting has not been implemented.');
  }

  closeMeeting() {
    throw UnimplementedError('joinMeeting has not been implemented.');
  }

  /// Adds a MeetHourMeetingListener that will broadcast conference events
  addListener(MeetHourMeetingListener meetHourMeetingListener) {
    throw UnimplementedError('addListener has not been implemented.');
  }

  /// remove MeetHourListener
  removeListener(MeetHourMeetingListener meetHourMeetingListener) {
    throw UnimplementedError('removeListener has not been implemented.');
  }

  /// Removes all MeetHourMeetingListeners
  removeAllListeners() {
    throw UnimplementedError('removeAllListeners has not been implemented.');
  }

  void initialize() {
    throw UnimplementedError('_initialize has not been implemented.');
  }

  /// execute command interface, use only in web
  void executeCommand(String command, List<String> args) {
    throw UnimplementedError('executeCommand has not been implemented.');
  }

  /// buildView
  /// Method added to support Web plugin, the main purpose is return a <div>
  /// to contain the conferencing screen when start
  /// additionally extra JS can be added usin `extraJS` argument
  /// for mobile is not need because the conferecing view get all device screen
  Widget buildView(List<String> extraJS) {
    throw UnimplementedError('_buildView has not been implemented.');
  }
}
