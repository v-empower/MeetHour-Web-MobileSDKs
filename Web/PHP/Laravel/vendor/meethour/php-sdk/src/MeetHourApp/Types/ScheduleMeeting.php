<?php

namespace MeetHourApp\Types;
class ScheduleMeeting
{
  public ?string $agenda;
  public ?array $attend;
  public string $default_recording_storage;
  public ?int $duration_hr;
  public ?int $duration_min;
  public ?int $enable_pre_registration;
  public ?string $endBy;
  public ?string $end_date_time;
  public ?int $end_times;
  public ?array $groups;
  public ?array $hostusers;
  public ?string $instructions;
  public ?int $is_recurring;
  public ?int $is_show_portal;
  public ?string $meeting_agenda;
  public string $meeting_date;
  public string $meeting_meridiem;
  public string $meeting_name;
  public string $meeting_time;
  public ?string $meeting_topic;
  public ?string $monthlyBy;
  public ?string $monthlyByDay;
  public ?string $monthlyByWeekday;
  public ?string $monthlyByWeekdayIndex;
  public ?array $options;
  public string $passcode;
  public ?string $recurring_type;
  public ?int $repeat_interval;
  public int $send_calendar_invite;
  public string $timezone;
  public ?int $weeklyWeekDays;

  public function __construct(
    string $meeting_name,
    string $passcode,
    string $meeting_time,
    string $meeting_meridiem,
    string $meeting_date,
    string $timezone
  ) {
    $this->agenda = null;
    $this->attend = null;
    $this->default_recording_storage = "Dropbox";
    $this->duration_hr = null;
    $this->duration_min = null;
    $this->enable_pre_registration = null;
    $this->endBy = null;
    $this->end_date_time = null;
    $this->end_times = null;
    $this->groups = null;
    $this->hostusers = null;
    $this->instructions = null;
    $this->is_recurring = null;
    $this->is_show_portal = 0;
    $this->meeting_agenda = null;
    $this->meeting_date = $meeting_date;
    $this->meeting_meridiem = $meeting_meridiem;
    $this->meeting_name = $meeting_name;
    $this->meeting_time = $meeting_time;
    $this->meeting_topic = null;
    $this->monthlyBy = null;
    $this->monthlyByDay = null;
    $this->monthlyByWeekday = null;
    $this->monthlyByWeekdayIndex = null;
    $this->options = null;
    $this->passcode = $passcode;
    $this->recurring_type = null;
    $this->repeat_interval = null;
    $this->send_calendar_invite = 0;
    $this->timezone = $timezone;
    $this->weeklyWeekDays = null;
  }
  public function prepare():array
  {
    $scheduleMeetingProperties = [
      "agenda" => $this->agenda,
      "attend" => $this->attend,
      "default_recording_storage" => $this->default_recording_storage,
      "duration_hr" => $this->duration_hr,
      "duration_min" => $this->duration_min,
      "enable_pre_registration" => $this->enable_pre_registration,
      "endBy" => $this->endBy,
      "end_date_time" => $this->end_date_time,
      "end_times" => $this->end_times,
      "groups" => $this->groups,
      "hostusers" => $this->hostusers,
      "instructions" => $this->instructions,
      "is_recurring" => $this->is_recurring,
      "is_show_portal" => $this->is_show_portal,
      "meeting_agenda" => $this->meeting_agenda,
      "meeting_date" => $this->meeting_date,
      "meeting_meridiem" => $this->meeting_meridiem,
      "meeting_name" => $this->meeting_name,
      "meeting_time" => $this->meeting_time,
      "meeting_topic" => $this->meeting_topic,
      "monthlyBy" => $this->monthlyBy,
      "monthlyByDay" => $this->monthlyByDay,
      "monthlyByWeekday" => $this->monthlyByWeekday,
      "monthlyByWeekdayIndex" => $this->monthlyByWeekdayIndex,
      "options" => $this->options,
      "passcode" => $this->passcode,
      "recurring_type" => $this->recurring_type,
      "repeat_interval" => $this->repeat_interval,
      "send_calendar_invite" => $this->send_calendar_invite,
      "timezone" => $this->timezone,
      "weeklyWeekDays" => $this->weeklyWeekDays,
    ];
    foreach ($scheduleMeetingProperties as $key => $value) {
      if ($value === null) {
        unset($scheduleMeetingProperties[$key]);
      }
    }
    return $scheduleMeetingProperties;
  }
}
