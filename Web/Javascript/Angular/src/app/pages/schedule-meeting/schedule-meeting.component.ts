import { Component, Input, OnInit } from '@angular/core';
import { ApiService, ScheduleMeetingType, UserObjectType } from 'angular-meethour';
import { DescriptionComponent } from '../../components/description/description.component';
import { ScheduleMeetingFormComponent } from '../../components/schedule-meeting-form/schedule-meeting-form.component';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css'],
  imports: [DescriptionComponent, ScheduleMeetingFormComponent],
  standalone: true
})
export class ScheduleMeetingComponent implements OnInit {
  open: boolean = false;
  isLoading: boolean = false;
  @Input() requestBody: any = {
    meeting_name: '',
    passcode: '',
    meeting_date: '',
    meeting_time: '',
    timezone: '',
    instructions: '',
    is_show_portal: 1,
    options: [],
    hostusers: [],
    meeting_meridiem: '',
    attend: []
  };
  popupFields: any = {};

  constructor(private apiServices: ApiService) {}

  ngOnInit(): void {}

  onSubmitHandler(): void {}

  timeConvert(time: any[]): any {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = Number(time[0]) < 12 ? ' AM' : ' PM';
      time[0] = Number(time[0]) % 12 || 12;
      if (time[0] < 10) {
        time[0] = `0${Number(time[0]) % 12}` || 12;
      }
    }
    console.log(time);
    return time.join('');
  }

  inputChangeHandler(event: any): void {
    const { name, value } = event.target || event.target;
    console.log(name, 'sm-comp===')
    if (name === 'meeting_date') {
      let date = value;
      date = date.split('-').reverse().join('-');
      this.requestBody[name] = date;
      return;
    }
    if (name === 'meeting_time') {
      const [time, meridiem] = this.timeConvert(value).split(' ');
      this.requestBody[name] = time;
      this.requestBody['meeting_meridiem'] = meridiem;
      return;
    }
    if (name === 'options') {
      const options = [value];
      if (!this.requestBody.options.includes(value)) {
        this.requestBody[name] = options;
        return;
      }
      options.shift();
      return;
    }
    this.requestBody[name] = value;
  }

  // async onSubmitHandler(): Promise<void> {
  //   try {
  //     this.isLoading = true;
  //     const response = await this.apiServices.scheduleMeeting(localStorage.getItem('accessToken') || '', this.requestBody);
  //     if (response.success) {
  //       this.open = true;
  //     }
  //     this.popupFields = {
  //       meeting_id: response.data.meeting_id,
  //       passcode: response.data.passcode,
  //       joinURL: response.data.joinURL
  //     };
  //     localStorage.setItem('meetingId', response.data.meeting_id);
  //   } catch (error) {
  //     console.log(error);
  //     // this.appContext.setIsError(true);
  //     // this.appContext.setErrorMessage(response.message);
  //     setTimeout(() => {
  //       // this.appContext.setIsError(false);
  //     }, 6000);
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  addParticipant(participant: any): void {
    if (typeof participant !== 'number' && (!participant.first_name || !participant.last_name || !participant.email)) {
      alert('Please set all the required fields');
      return;
    }
    const attendParticipants = this.requestBody.attend ? [...this.requestBody.attend] : [];
    if (!attendParticipants.includes(participant)) {
      attendParticipants.push(participant);
      this.requestBody.attend = attendParticipants;
    }
  }

  removeParticipant(participant: any): void {
    const existing = this.requestBody.attend ? [...this.requestBody.attend] : [];
    if (existing.length === 1) {
      existing.pop();
      this.requestBody.attend = existing;
      return;
    }
    existing.splice(existing.indexOf(participant), 1);
    this.requestBody.attend = existing;
  }

  addModerator(moderator: any): void {
    const moderators = this.requestBody.hostusers ? [...this.requestBody.hostusers] : [];
    if (!moderators.includes(moderator)) {
      moderators.push(moderator);
      this.requestBody.hostusers = moderators;
    }
  }

  removeModerator(moderator: any): void {
    const existing = this.requestBody.hostusers ? [...this.requestBody.hostusers] : [];
    if (existing.length === 1) {
      existing.pop();
      this.requestBody.hostusers = existing;
      return;
    }
    existing.splice(existing.indexOf(moderator), 1);
    this.requestBody.hostusers = existing;
  }
}
