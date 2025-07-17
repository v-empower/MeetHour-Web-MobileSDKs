import { Component, OnInit } from '@angular/core';
import { ApiService } from 'angular-meethour';
// import { AppContext } from '../app.context'; // Assuming you have an AppContext service for global state
import { CLIENT_ID, CLIENT_SECRET, PASSWORD, USERNAME } from '../../../constants';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomePageComponent implements OnInit {
  isHomepage: boolean = true;
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('ngOnInitHomepage==')
    this.route.url.subscribe(url => {
      console.log('Current URL:', url);
    });
   }

  showToast(messageType: string) {
    var toast = document.getElementById(messageType);
    toast?.classList.add("show");
    setTimeout(function() {
      toast?.classList.remove("show");
    }, 3000); // Duration in milliseconds (3 seconds)
  }

  getAccessToken(): void {
    this.isLoading = true;
    this.apiService.login({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, username: USERNAME, password: PASSWORD}).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.access_token);
        this.showToast("toast-success");
        this.isLoading = false;
      },
      error: (error) => {
        // this.appContext.setIsError(true);
        this.showToast("toast-failure");
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  get localStorage() {
    return window.localStorage;
  }
}
