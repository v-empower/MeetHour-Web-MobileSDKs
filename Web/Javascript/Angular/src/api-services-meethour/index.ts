import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { API_VERSION, GRANT_TYPE } from './constants';
import { LoginType } from './types';

interface PathParam {
  key: string;
  value: string;
}

type ApiEndpoint = 'add_contact' | 'login' | 'contacts_list' | 'schedule_meeting' | 'get_jwt' | 'upcoming_meeting' | 'timezone' | 'recordings_list' | 'edit_meeting' | 'edit_contact' | 'view_meeting' | 'archive_meeting' | 'missed_meetings' | 'completed_meetings' | 'user_details' | 'refresh_token';

@Injectable({
    providedIn: 'root'
  })
  export default class ApiService {
    private static BASE_URL = 'https://api.meethour.io';
  
    constructor(private http: HttpClient) {}
  
    private static getHeaders(token: string): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
    }
  
    private static apiEndpointUrl(baseUrl: string, endpoint: ApiEndpoint): string {
      switch (endpoint) {
        case 'login':
          return `${baseUrl}/oauth/token`;
        case 'add_contact':
          return `${baseUrl}/api/${API_VERSION}/customer/addcontact`;
        case 'contacts_list':
          return `${baseUrl}/api/${API_VERSION}/customer/contacts`;
        case 'schedule_meeting':
          return `${baseUrl}/api/${API_VERSION}/meeting/schedulemeeting`;
        case 'get_jwt':
          return `${baseUrl}/api/${API_VERSION}/getjwt`;
        case 'upcoming_meeting':
          return `${baseUrl}/api/${API_VERSION}/meeting/upcomingmeetings`;
        case 'timezone':
          return `${baseUrl}/api/${API_VERSION}/getTimezone`;
        case 'recordings_list':
          return `${baseUrl}/api/${API_VERSION}/customer/videorecordinglist`;
        case 'edit_meeting':
          return `${baseUrl}/api/${API_VERSION}/meeting/editmeeting`;
        case 'edit_contact':
          return `${baseUrl}/api/${API_VERSION}/customer/editcontact`;
        case 'view_meeting':
          return `${baseUrl}/api/${API_VERSION}/meeting/viewmeeting`;
        case 'archive_meeting':
          return `${baseUrl}/api/${API_VERSION}/meeting/archivemeeting`;
        case 'missed_meetings':
          return `${baseUrl}/api/${API_VERSION}/meeting/missedmeetings`;
        case 'completed_meetings':
          return `${baseUrl}/api/${API_VERSION}/meeting/completedmeeting`;
        case 'user_details':
          return `${baseUrl}/api/${API_VERSION}/customer/user_details`;
        case 'refresh_token':
          return `${baseUrl}/oauth/token`;
      }
    }
  
    private substitutePathParameter(url: string, pathParam: PathParam[] = []): string {
      let constructedUrl = url;
      pathParam.forEach((item: PathParam) => {
        constructedUrl = constructedUrl.replace(`{${item.key}}`, item.value ? item.value : '');
      });
      return constructedUrl;
    }
  
    private postFetch<T>(token: string, endpoint: ApiEndpoint, body: any, pathParam: PathParam[] = []): Observable<T> {
        const constructedUrl = this.substitutePathParameter(ApiService.apiEndpointUrl(ApiService.BASE_URL, endpoint), pathParam);
      
        // console.log('Constructed URL:', constructedUrl);
        // console.log('Request Body:', body);
      
        return new Observable<T>(observer => {
          this.http.post<T>(constructedUrl, body, {
            headers: ApiService.getHeaders(token)
          }).pipe(
            map(response => {
              console.log('Response received:', response);
              observer.next(response as T);
              observer.complete();
              return response as T;
            }),
            catchError(error => {
              console.error('Error occurred:', error);
              observer.error(error);
              return throwError(error);  // Ensure you return a new observable with the error
            })
          ).subscribe();
        });
      }
  
    login(data: LoginType): Observable<any> {
        console.log('login')
      return this.postFetch('', 'login', {
        grant_type: GRANT_TYPE,
        ...data
      });
    }
  
    // getRefreshToken(token: string, body: RefreshTokenType): Observable<any> {
    //   return this.postFetch(token, 'refresh_token', body);
    // }
  
    // userDetails(token: string): Observable<any> {
    //   return this.postFetch(token, 'user_details', {});
    // }
  
    // generateJwt(token: string, body: GenerateJwtType): Observable<any> {
    //   return this.postFetch(token, 'get_jwt', body);
    // }
  
    // addContact(token: string, body: AddContactType): Observable<any> {
    //   return this.postFetch(token, 'add_contact', body);
    // }
  
    // timezone(token: string): Observable<any> {
    //   return this.postFetch(token, 'timezone', {});
    // }
  
    // contactsList(token: string, body: ContactsType): Observable<any> {
    //   return this.postFetch(token, 'contacts_list', body);
    // }
  
    // editContact(token: string, body: EditContactType): Observable<any> {
    //   return this.postFetch(token, 'edit_contact', body);
    // }
  
    // scheduleMeeting(token: string, body: ScheduleMeetingType): Observable<any> {
    //   return this.postFetch(token, 'schedule_meeting', body);
    // }
  
    // upcomingMeetings(token: string, body: { limit: number; page: number; }): Observable<any> {
    //   return this.postFetch(token, 'upcoming_meeting', body);
    // }
  
    // archiveMeeting(token: string, body: { id?: number; }): Observable<any> {
    //   return this.postFetch(token, 'archive_meeting', body);
    // }
  
    // missedMeetings(token: string, body: { limit: number; page: number; }): Observable<any> {
    //   return this.postFetch(token, 'missed_meetings', body);
    // }
  
    // completedMeetings(token: string, body: { limit: number; page: number; }): Observable<any> {
    //   return this.postFetch(token, 'completed_meetings', body);
    // }
  
    // editMeeting(token: string, body: EditMeetingType): Observable<any> {
    //   return this.postFetch(token, 'edit_meeting', body);
    // }
  
    // viewMeeting(token: string, body: { meeting_id: string; }): Observable<any> {
    //   return this.postFetch(token, 'view_meeting', body);
    // }
  
    // recordingsList(token: string, body: RecordingsList): Observable<any> {
    //   return this.postFetch(token, 'recordings_list', body);
    // }
  }
  