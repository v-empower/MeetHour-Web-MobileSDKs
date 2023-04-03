<?php
namespace MeetHourApp\Types;
class EditMeeting
{
  public string $meeting_id;
  public ?string $meeting_name;
  public ?string $agenda;
  public ?string $passcode;
  public ?string $meeting_date;
  public ?string $meeting_time;
  public ?string $meeting_meridiem;
  public ?int $duration_hr;
  public ?int $duration_min;
  public ?string $timezone;
  public ?int $is_recurring;
  public ?string $recurring_type;
  public ?int $repeat_interval;
  public ?int $weeklyWeekDays;
  public ?string $monthlyBy;
  public ?string $monthlyByDay;
  public ?string $monthlyByWeekdayIndex;
  public ?string $monthlyByWeekday;
  public ?string $endBy;
  public ?string $end_date_time;
  public ?string $instructions;
  public ?int $is_show_portal;
  public ?int $enable_pre_registration;
  public ?string $meeting_topic;
  public ?string $meeting_agenda;
  public ?array $options;
  public ?array $old_attend;
  public ?array $attend;
  public ?array $groups;
  public ?array $hostusers;
  public ?string $default_recording_storage;
  public ?array $live_stream_settings;

  public function __construct(
    string $meeting_id
  ) {
    $this->agenda = null;
    $this->meeting_id = $meeting_id;
    $this->attend = null;
    $this->default_recording_storage = "Dropbox";
    $this->duration_hr = null;
    $this->duration_min = null;
    $this->enable_pre_registration = null;
    $this->endBy = null;
    $this->end_date_time = null;
    $this->groups = null;
    $this->hostusers = null;
    $this->instructions = null;
    $this->is_recurring = null;
    $this->is_show_portal = null;
    $this->meeting_agenda = null;
    $this->meeting_date = null;
    $this->meeting_meridiem = null;
    $this->meeting_name = null;
    $this->meeting_time = null;
    $this->meeting_topic = null;
    $this->monthlyBy = null;
    $this->monthlyByDay = null;
    $this->monthlyByWeekday = null;
    $this->monthlyByWeekdayIndex = null;
    $this->options = null;
    $this->passcode = null;
    $this->recurring_type = null;
    $this->repeat_interval = null;
    $this->timezone = null;
    $this->weeklyWeekDays = null;
    $this->live_stream_settings = null;
  }
  public function prepare():array
  {
    $editMeetingProperties = [
      "meeting_id" => $this->meeting_id,
      "agenda" => $this->agenda,
      "attend" => $this->attend,
      "default_recording_storage" => $this->default_recording_storage,
      "duration_hr" => $this->duration_hr,
      "duration_min" => $this->duration_min,
      "enable_pre_registration" => $this->enable_pre_registration,
      "endBy" => $this->endBy,
      "end_date_time" => $this->end_date_time,
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
      "live_stream_settings" => $this->live_stream_settings,
      "timezone" => $this->timezone,
      "weeklyWeekDays" => $this->weeklyWeekDays,
    ];
    foreach ($editMeetingProperties as $key => $value) {
      if ($value === null) {
        unset($editMeetingProperties[$key]);
      }
    }
    return $editMeetingProperties;
  }
}
