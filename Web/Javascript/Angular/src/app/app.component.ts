import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService, MeetHourMeeting } from 'angular-meethour';
import { API_KEY, CLIENT_ID, CLIENT_SECRET, PASSWORD, USERNAME } from '../constants';
import { API_BASE_URL } from '../api-services-meethour/constants';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MeetHourMeeting, RouterLink, RouterLinkActive, NavbarComponent, FormsModule],
  // template: `<app-meet-hour-meeting
  //     [apiBaseURL]="apiBaseURL"
  //     [apiKey]="apiKey"
  //     [roomName]="roomName"
  //     [getIFrameRef]="getIFrameRef"></app-meet-hour-meeting>`,
  templateUrl: './app.component.html',
  providers: [ApiService, MeetHourMeeting],
  styleUrls: ['./app.component.css'] // Corrected to styleUrls
})
export class AppComponent implements OnInit {
  title = 'meethour-angular-example';
  apiKey = API_KEY;
  roomName = "MHR240704130053";
  apiBaseURL = API_BASE_URL;
  getIFrameRef = (element: HTMLElement) => {
    element.style.width = '800px';  // Set the desired width
    element.style.height = '600px'; // Set the desired height
  };
  constructor(private services: ApiService, private meeting: MeetHourMeeting) { }

  async ngOnInit() {
    this.services.login({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, username: USERNAME, password: PASSWORD}).subscribe(
      response => {
        console.log('Success:', response);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
