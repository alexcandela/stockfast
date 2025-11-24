// dashboard-layout.ts
import { Component, HostListener, signal, AfterViewInit, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { UserComponent } from '../../components/user-component/user-component';
import { CommonModule } from '@angular/common';
import { Authservice } from '../../core/services/authservice';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserComponent, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout implements AfterViewInit, OnInit {
  show = signal(true);
  userPlan: string | null = 'Free';

  constructor(private authService: Authservice) {}

  toggle() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.show.set(!this.show());
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
    }
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        this.show.set(true);
      } else {
        this.show.set(false);
      }
    }
  }

  ngOnInit(): void {
    this.userPlan = this.authService.getUserPlan();
  }

  isPro(): boolean {
    return this.userPlan?.toLowerCase() === 'pro';
  }
}