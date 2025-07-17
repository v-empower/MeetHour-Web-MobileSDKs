import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule]
})
export class NavbarComponent {
  navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true },
    { name: 'Schedule a Meeting', href: '/schedule-meeting', current: false },
    { name: 'Join Meeting', href: '/join-meeting', current: false }
  ];
  isMenuOpen: boolean = false;

  classNames(...classes: string[]): string {
    console.log(classes.filter(Boolean).join(' '), 'classNames===');
    return classes.filter(Boolean).join(' ');
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }
}
