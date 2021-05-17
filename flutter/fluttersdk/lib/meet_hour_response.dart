class MeetHourMeetingResponse {
  final bool isSuccess;
  final String? message;
  final dynamic? error;

  MeetHourMeetingResponse({
    required this.isSuccess,
    this.message,
    this.error,
  });

  @override
  String toString() {
    return 'MeetHourMeetingResponse{isSuccess: $isSuccess, '
        'message: $message, error: $error}';
  }
}
