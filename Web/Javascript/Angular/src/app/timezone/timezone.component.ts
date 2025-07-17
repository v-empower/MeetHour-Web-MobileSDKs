import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ScheduleMeetingType } from 'angular-meethour';
import * as MomentTimezone from 'moment-timezone';

@Component({
  selector: 'app-timezone',
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule]
})
export class TimezoneComponent implements OnInit {
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
  @Output() inputChange = new EventEmitter<any>();
  @Output() setRequestBody = new EventEmitter<any>();

  timezoneList: { value: string, name: string }[] = [];

  constructor(private apiService: ApiService) {
    this.requestBody = {
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
  }

  async getTimezone() {
    this.apiService.timezone(localStorage.getItem('accessToken') || '').subscribe(
        response => {
          this.timezoneList = response.timezones;
          console.log(response);
          this.setRequestBody.emit({ ...this.requestBody, timezone: MomentTimezone.tz.guess() });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }

  ngOnInit(): void {
    this.getTimezone();
  }

  onChange(event: any) {
    this.inputChange.emit(event.target.value);
  }
}
