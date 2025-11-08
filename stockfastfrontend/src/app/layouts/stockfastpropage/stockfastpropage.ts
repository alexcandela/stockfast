import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stockfastpropage',
  imports: [],
  templateUrl: './stockfastpropage.html',
  styleUrl: './stockfastpropage.scss'
})
export class Stockfastpropage {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  subscribe() {
    console.log('¡Próximamente! Sistema de suscripción en desarrollo.');
  }

}
