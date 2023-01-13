export interface ScheduleMeetingBodyType{
    meeting_name: string,
    passcode: string,
    meeting_date: string,
    meeting_time: string,
    meeting_meridiem: string,
    timezone: string,
    options: Array<string>,
    attend: Array<number> | Array<User> | Array<User | number>,
    hostusers: Array<number> | Array<User> | Array<User | number>
    is_show_portal: number,
  }

  export interface User {
    first_name?: string;
    last_name?: string;
    email?: string
  }

  export interface UpcomingMeetingsBodyType{
    limit: number,
    page: number
  }