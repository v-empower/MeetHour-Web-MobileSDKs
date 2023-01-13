export default interface EditMeeting {
    meeting_id: number,
    meeting_name?: string,
    agenda?: string,
    passcode?: string,
    meeting_date?: string,
    meeting_time?: string,
    meeting_meridiem?: string,
    duration_hr?: number,
    duration_min?: number,
    timezone?: string,
    is_recurring?: number,
    recurring_type?: string,
    repeat_interval?: number,
    endBy?: string,
    end_date_time?: string,
    instructions?: string,
    is_show_portal?: number,
    enable_pre_registration?: number,
    meeting_topic?: string,
    meeting_agenda?: string,
    options?: Array<string>,
    old_attend?: Array<number> | Array<UserObjectType> | Array<number & UserObjectType>,
    attend?: Array<number> | Array<UserObjectType> | Array<number & UserObjectType>,
    groups?: Array<number>,
    hostusers?: Array<number> | Array<UserObjectType> | Array<number & UserObjectType>,
  }

  interface UserObjectType{
    first_name?: string
    last_name?: string
    email?: string
  }