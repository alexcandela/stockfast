import { Component, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification-card',
  imports: [NgClass],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.scss',
})
export class NotificationCard implements OnInit {
  @Input() type!: string;
  @Input() label!: string;
  icon = signal('');
  
  constructor() {}
  
  private setIcon(type: string) {
    switch (type) {
      case 'info':
        this.icon.set('assets/icons/info2.svg');
        break;
      case 'error':
        this.icon.set('assets/icons/error.svg');
        break;
      case 'success':
        this.icon.set('assets/icons/success.svg');
        break;
      case 'warning':
        this.icon.set('assets/icons/warning.svg');
        break;
      default:
        this.icon.set('');
        break;
    }
  }
  
  ngOnInit() {
    this.setIcon(this.type);
  }
}