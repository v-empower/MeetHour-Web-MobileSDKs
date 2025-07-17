import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ScheduleMeetingComponent } from './pages/schedule-meeting/schedule-meeting.component';
import { JoinMeetingComponent } from './pages/join-meeting/join-meeting.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'schedule-meeting', component: ScheduleMeetingComponent },
    { path: 'join-meeting', component: JoinMeetingComponent }
];