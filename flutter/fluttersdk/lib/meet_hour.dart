import 'dart:async';

import 'package:flutter/material.dart';

import 'room_name_constraint.dart';
import 'room_name_constraint_type.dart';

import 'meet_hour_platform_interface.dart';

export 'meet_hour_platform_interface.dart'
    show
        MeetHourMeetingOptions,
        MeetHourMeetingResponse,
        MeetHourMeetingListener,
        MeetHourGenericListener,
        FeatureFlagHelper,
        FeatureFlagEnum;

class MeetHour {
  static bool _hasInitialized = false;

  static final Map<RoomNameConstraintType, RoomNameConstraint>
      defaultRoomNameConstraints = {
    RoomNameConstraintType.MIN_LENGTH: new RoomNameConstraint((value) {
      return value.trim().length >= 3;
    }, "Minimum room length is 3"),
    RoomNameConstraintType.ALLOWED_CHARS: new RoomNameConstraint((value) {
      return RegExp(r"^[a-zA-Z0-9-_]+$", caseSensitive: false, multiLine: false)
          .hasMatch(value);
    }, "Only alphanumeric, dash, and underscore chars allowed"),
  };

  /// Joins a meeting based on the MeetHourMeetingOptions passed in.
  /// A MeetHourMeetingListener can be attached to this meeting that will automatically
  /// be removed when the meeting has ended
  static Future<MeetHourMeetingResponse> joinMeeting(MeetHourMeetingOptions options,
      {MeetHourMeetingListener? listener,
      Map<RoomNameConstraintType, RoomNameConstraint>?
          roomNameConstraints}) async {
    assert(options.room.trim().isNotEmpty, "room is empty");

    // If no constraints given, take default ones
    // (To avoid using constraint, just give an empty Map)
    if (roomNameConstraints == null) {
      roomNameConstraints = defaultRoomNameConstraints;
    }

    // Check each constraint, if it exist
    // (To avoid using constraint, just give an empty Map)
    if (roomNameConstraints.isNotEmpty) {
      for (RoomNameConstraint constraint in roomNameConstraints.values) {
        assert(
            constraint.checkConstraint(options.room), constraint.getMessage());
      }
    }

    // Validate serverURL is absolute if it is not null or empty
    if (options.serverURL?.isNotEmpty ?? false) {
      assert(Uri.parse(options.serverURL!).isAbsolute,
          "URL must be of the format <scheme>://<host>[/path], like https://meethour.io/MeetingID");
    }

    return await MeetHourPlatform.instance
        .joinMeeting(options, listener: listener);
  }

  /// Initializes the event channel. Call when listeners are added
  static _initialize() {
    if (!_hasInitialized) {
      MeetHourPlatform.instance.initialize();
      _hasInitialized = true;
    }
  }

  static closeMeeting() => MeetHourPlatform.instance.closeMeeting();

  /// Adds a MeetHourMeetingListener that will broadcast conference events
  static addListener(MeetHourMeetingListener meetHourMeetingListener) {
    MeetHourPlatform.instance.addListener(meetHourMeetingListener);
    _initialize();
  }

  /// Removes the MeetHourMeetingListener specified
  static removeListener(MeetHourMeetingListener meetHourMeetingListener) {
    MeetHourPlatform.instance.removeListener(meetHourMeetingListener);
  }

  /// Removes all MeetHourMeetingListeners
  static removeAllListeners() {
    MeetHourPlatform.instance.removeAllListeners();
  }

  /// allow execute a command over a MeetHour live session (only for web)
  static executeCommand(String command, List<String> args) {
    MeetHourPlatform.instance.executeCommand(command, args);
  }
}

/// Allow create a interface for web view and attach it as a child
/// optional param `extraJS` allows setup another external JS libraries
/// or Javascript embebed code
class MeetHourConferencing extends StatelessWidget {
  final List<String>? extraJS;
  MeetHourConferencing({this.extraJS});

  @override
  Widget build(BuildContext context) {
    return MeetHourPlatform.instance.buildView(extraJS!);
  }
}
