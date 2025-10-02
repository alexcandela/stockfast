import { Component, HostListener, signal, AfterViewInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { UserComponent } from './components/user-component/user-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  // Señal para el toggle del sidebar
  show = signal(true);

  constructor() {}

  toggle() {
    this.show.set(!this.show());
  }

  ngAfterViewInit() {
    // Solo en navegador
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
      // Si la pantalla es menor a 1024px, cerrar sidebar por defecto
      this.show.set(window.innerWidth >= 1024);
    }
  }
}
