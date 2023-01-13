export default interface ScheduleMeetingType{
    meeting_name: string
    agenda?: string
    passcode: string
    meeting_date: string
    meeting_time: string
    meeting_meridiem: string
    duration_hr?: number,
    duration_min?: number,
    timezone: string
    is_recurring?: number,
    recurring_type?: string
    repeat_interval?: number,
    weeklyWeekDays?: number,
    monthlyBy?: string,
    monthlyByDay?: string,
    monthlyByWeekdayIndex?: string,
    monthlyByWeekday?: string,
    endBy?: string
    end_date_time?: string
    end_times?: number,
    instructions?: string
    is_show_portal?: number,
    enable_pre_registration?: number,
    meeting_topic?: string
    meeting_agenda?: string
    send_calendar_invite?: number,
    options?: Array<string>,
    attend?: Array<number> | Array<UserObjectType> | Array<UserObjectType | number>,
    groups?: Array<number>,
    hostusers?: Array<number> | Array<UserObjectType> | Array<UserObjectType | number>,
    default_recording_storage?: string
  }

  interface UserObjectType{
    first_name?: string
    last_name?: string
    email?: string
  }