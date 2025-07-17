import { Component, OnInit } from '@angular/core';
import { ApiService, MeetHourMeeting } from 'angular-meethour';
import { API_BASE_URL, API_KEY, API_RELEASE, CONFERENCE_URL } from '../../../constants';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css'],
  imports: [CommonModule, MeetHourMeeting],
  standalone: true
})
export class JoinMeetingComponent implements OnInit {
  isStartMeeting = false;
  logItems: any[] = [];
  meetingAttendees: any = {
    organizer: {},
    hosts: [],
    attendees: []
  };
  isLoading = false;
  meetingJwtToken: string | null = '';
  API_KEY = API_KEY;
  roomName: string | null = '';
  pcode = "";
  API_BASE_URL = API_BASE_URL;
  CONFERENCE_URL = CONFERENCE_URL;
  API_RELEASE = API_RELEASE;
  getIFrameRef = (element: HTMLElement) => {
    element.style.width = '100%';  // Set the desired width
    element.style.height = '100%'; // Set the desired height
  };

  constructor(private apiService: ApiService, private storageService: StorageService) {}

  ngOnInit(): void {
    if (!this.storageService.getItem('accessToken')) {
      alert('First generate the access token, then try to join a meeting');
      window.location.pathname = '/';
    }
    this.roomName = this.storageService.getItem('meetingId');
    this.viewMeeting();
  }

  renderSpinner() {
    return '<div style="font-family: sans-serif; text-align: center; height: 30; width: 30;">Loading..</div>';
  }

  handleReadyToClose() {
    alert('Ready to close...');
  }

  handleMeetHourIFrameRef1(iframeRef: any) {
    iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
    iframeRef.style.border = '10px solid #3d3d3d';
    iframeRef.style.background = '#3d3d3d';
    iframeRef.style.width = '100%';
    iframeRef.style.height = '100%';
    iframeRef.style.marginBottom = '20px';
  }

  async generateJwtToken(id?: number) {
    try {
      const meetingId = this.storageService.getItem('meetingId') || '';
      const body: any = {
        meeting_id: meetingId
      };
      if (id !== undefined) body.contact_id = id;

      this.apiService.generateJwt(this.storageService.getItem('accessToken') || '', body).subscribe(
        response => {
          console.log('Success:', response);
          this.meetingJwtToken = response.jwt;
          this.isStartMeeting = true;
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  viewMeeting() {
    if (!this.storageService.getItem('meetingId')) {
      return;
    }
    try {
      this.isLoading = true;
      const accessToken = this.storageService.getItem('accessToken') || '';
      const id = this.storageService.getItem('meetingId') || '';
      console.log(id, 'id====')
      this.apiService.viewMeeting(accessToken, {
        meeting_id: id
      }).subscribe(
        response => {
          console.log('Success:', response);
          const meetingBody = {
            organizer: response.organizer,
            hosts: response.meeting.hosts,
            attendees: response.meeting.meeting_attendees
          };
          this.storageService.setItem('pCode', response?.meeting?.pcode);
          this.meetingAttendees = meetingBody;
          this.roomName = id;
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      this.storageService.removeItem('meetingId');
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  resetMeeting() {
    this.storageService.removeItem('meetingId');
    this.storageService.removeItem('pCode');
    window.location.pathname = '/join-meeting';
  }

  updateMeetingId(event: any) {
    const value = event.target.value;
    if (value.includes('https://')) {
      const id = value.slice(20, 34);
      this.storageService.setItem('meetingId', id);
    } else {
      this.storageService.setItem('meetingId', value);
    }
  }
}
