import { Component, OnInit } from '@angular/core';
import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-user-component',
  imports: [],
  templateUrl: './user-component.html',
  styleUrl: './user-component.scss'
})
export class UserComponent {

username: string | null = null;

  constructor(private authService: Authservice) {
    this.username = this.authService.getUsername();
  }
  
  logout() {
    this.authService.logout();
  }
}
