import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService, ScheduleMeetingType, UserObjectType } from 'angular-meethour';
import moment from 'moment';
import * as MomentTimezone from 'moment-timezone';
import { TimezoneComponent } from '../../timezone/timezone.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-schedule-meeting-form',
  templateUrl: './schedule-meeting-form.component.html',
  styleUrls: ['./schedule-meeting-form.component.css'],
  imports: [TimezoneComponent, NgFor, FormsModule, CommonModule],
  standalone: true
})
export class ScheduleMeetingFormComponent implements OnInit {
  isLoading: boolean = false;
  isScheduleLoading: boolean = false;
  isInstantLoading: boolean = false;
  isFormLoading: boolean = false;
  showModal: boolean = false;
  roomName = "";
  passcode = "";
  joinURL = "";
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
  @Input() userObject: any = { first_name: "", last_name: "", email: "" }
  @Input() popupFields: any;
  @Input() contacts: any = [];
  selectedModeratorContact: any;
  selectedParticipantContact: any;
  isInstant: boolean = false;
  isModeratorType: boolean = false;

  @Output() setRequestBody = new EventEmitter<any>();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getContactsList();
  }

  showToast(messageType: string) {
    var toast = document.getElementById(messageType);
    toast?.classList.add("show");
    setTimeout(function() {
      toast?.classList.remove("show");
    }, 3000); // Duration in milliseconds (3 seconds)
  }

  toggleDropdown() { }

  getContactsList() {
    if (!localStorage.getItem('accessToken')) {
      return;
    }
    const body = { limit: 0, page: 0, exclude_hosts: 0 };
    this.apiService.contactsList(localStorage.getItem('accessToken') || '', body).subscribe(
      response => {
        this.contacts = response.contacts;
      },
      error => {
        console.log(error, 'ContactsListError==');
      }
    );
  }

  isRequestBodyValid(requestBody: any) {
    const keysToCheck = ['meeting_name', 'passcode', 'meeting_date', 'meeting_time', 'timezone', 'meeting_meridiem', 'hostusers', 'attend'];

    for (let key of keysToCheck) {
      if (Array.isArray(requestBody[key])) {
        // Check if the array is empty
        if (requestBody[key].length === 0) {
          return false;
        }
      } else {
        // Check if the string is empty
        if (requestBody[key] === '') {
          return false;
        }
      }
    }
    return true;
  }

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
    console.log(event)
    const { name, value } = event.target;
    console.log(value, 'value');
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
      console.log(this.requestBody)
      console.log('insideif==')
      const options = [value];
      if (!this.requestBody.options.includes(value)) {
        console.log('insideifif==', event)
        this.requestBody[name] = options;
        return;
      }
      options.shift();
      this.requestBody[name] = options;
      return;
    }
    this.requestBody[name] = value;
  }

  handleTimezoneInput(timezone: any) {
    this.requestBody["timezone"] = timezone;
  }

  isNotNumber(value: any): boolean {
    return typeof value !== 'number';
  }

  handleUserObject(event: any): void {
    const { name, value } = event.target;
    const val = value;
    this.userObject[name] = val;
  }

  addManualParticipant(): void {
    if (!this.userObject.first_name || !this.userObject.last_name || !this.userObject.email) {
      alert('Please set all the required fields');
      return
    }
    const attendParticipants = this.requestBody.attend ? [...this.requestBody.attend] : [];
    const participantCheck = attendParticipants.find((user: any) => user.email === this.userObject.email)
    if (!participantCheck) {
      attendParticipants.push({ ...this.userObject });
      this.requestBody.attend = attendParticipants;
    }
  }

  onSubmitHandler() {
    if (this.isRequestBodyValid(this.requestBody) === false) {
      alert('Please fill all the required fields');
      return
    }
    this.isScheduleLoading = true;
    const token = localStorage.getItem('accessToken') || "";
    this.apiService.scheduleMeeting(token, this.requestBody).subscribe(
      response => {
        if(response.success === false){
          alert(response.message);
          this.isScheduleLoading = false
          this.showToast("toast-failure");
          return
        }
        this.isScheduleLoading = false
        this.showToast("toast-success");
        this.showModal = true;
        localStorage.setItem('meetingId', response.data.meeting_id);
        this.roomName = response.data.meeting_id;
        this.passcode = response.data.passcode;
        this.joinURL = response.data.joinURL;

      },
      error => {
        console.error('Error:', error);
        this.isScheduleLoading = false;
        this.showToast("toast-failure");
      }
    )
  }

  instantMeeting() {
    this.isInstantLoading = true;
    const token = localStorage.getItem('accessToken') || "";
    const host = {
      first_name: "",
      last_name: "",
      email: ""
    };
    this.apiService.userDetails(
      localStorage.getItem('accessToken') || ''
    ).subscribe(response => {
      if(response.success === false) {
        alert(response.message);
        this.isInstantLoading = false;
        this.showToast("toast-failure");
        return
      }
      host.first_name = response.data.name?.split(' ')[0];
      host.last_name = response.data.name?.split(' ')[1];
      host.email = response.data.email;
      const body = {
        meeting_name: 'Quick Meeting',
        agenda: '',
        passcode: '123456',
        meeting_date: moment().format('DD-MM-YYYY'),
        meeting_time: moment().format('hh:mm'),
        meeting_meridiem: moment().format('h:mm a')
          .split(' ')[1].toUpperCase(),
        timezone: MomentTimezone.tz.guess(),
        instructions: 'Team call, join as soon as possible',
        is_show_portal: 1,
        options: ['ALLOW_GUEST', 'JOIN_ANYTIME'],
        hostusers: [host]
      };
      this.apiService.scheduleMeeting(token, body).subscribe(
        response => {
          console.log('Success:', response);
          if(response.success === false) {
            this.showToast("toast-failure");
            this.isInstantLoading = false;
            return
          }
          this.showToast("toast-success");
          this.isInstantLoading = false;
          this.showModal = true;
          localStorage.setItem('meetingId', response.data.meeting_id);
          this.roomName = response.data.meeting_id;
          this.passcode = response.data.passcode;
          this.joinURL = response.data.joinURL;
        },
        error => {
          console.error('Error:', error);
          this.showToast("toast-failure");
          this.isInstantLoading = false;
        }
      )
    }, error => {
      console.error(error);
      this.showToast("toast-failure");
    });

  }

  addParticipant(event?: any): void {
    console.log(event, 'event====')
    let participant = event.id;
    if (typeof participant !== 'number' && (!participant.first_name || !participant.last_name || !participant.email)) {
      alert('Please set all the required fields');
      return;
    }
    const attendParticipants = this.requestBody.attend ? [...this.requestBody.attend] : [];
    if (!attendParticipants.includes(participant)) {
      attendParticipants.push(participant);
      this.requestBody.attend = attendParticipants;
    }
    console.log(this.requestBody)
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

  addModerator(event: any): void {
    // const moderators = this.requestBody.hostusers ? [...this.requestBody.hostusers] : [];
    // if (!moderators.includes(moderator)) {
    //   moderators.push(moderator);
    //   this.requestBody.hostusers = moderators;
    // }

    let moderator = event.id;
    if (typeof moderator !== 'number' && (!moderator.first_name || !moderator.last_name || !moderator.email)) {
      alert('Please set all the required fields');
      return;
    }
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

  closeModal() {
    this.showModal = false;
  }

  joinMeeting() {
    this.showModal = false;
    console.log(window.location, 'location')
    window.location.href = "/#/join-meeting"
  }
}
