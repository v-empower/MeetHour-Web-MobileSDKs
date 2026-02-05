import 'dart:js_interop';
import 'package:web/web.dart' as web;

@JS('Intl.DateTimeFormat')
external JSObject _createDateTimeFormat();

@JS()
@staticInterop
class _ResolvedOptions {}

extension _ResolvedOptionsExt on _ResolvedOptions {
  external String get timeZone;
}

@JS()
@staticInterop
class _DateTimeFormat {}

extension _DateTimeFormatExt on _DateTimeFormat {
  external _ResolvedOptions resolvedOptions();
}

/// Gets the local timezone from the browser using JavaScript Intl API.
/// Returns the IANA timezone string (e.g., "America/New_York", "Asia/Kolkata").
String _getBrowserTimezone() {
  try {
    final formatter = _createDateTimeFormat() as _DateTimeFormat;
    final options = formatter.resolvedOptions();
    final timezone = options.timeZone;
    if (timezone.isNotEmpty) {
      return timezone;
    }
  } catch (e) {
    print('Error getting browser timezone: $e');
  }
  return '';
}

/// Gets the local timezone, using the browser's timezone.
/// Falls back to the provided fallback timezone list if browser timezone is unavailable.
String getLocalTimezoneWithFallback({
  String? selectedTimezone,
  List<String>? availableTimezones,
  String defaultTimezone = 'UTC',
}) {
  // First priority: user-selected timezone
  if (selectedTimezone != null && selectedTimezone.isNotEmpty) {
    return selectedTimezone;
  }

  // Second priority: browser's local timezone
  try {
    final browserTimezone = _getBrowserTimezone();
    if (browserTimezone.isNotEmpty) {
      return browserTimezone;
    }
  } catch (e) {
    print('Error getting browser timezone: $e');
  }

  // Third priority: first available timezone from the list
  if (availableTimezones != null && availableTimezones.isNotEmpty) {
    return availableTimezones.first;
  }

  // Last resort: default timezone
  return defaultTimezone;
}
