import { Injectable } from '@angular/core';
import { Purchase } from '../interfaces/purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authservice } from './authservice'; // tu AuthService
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: Authservice) { }

  crearLote(purchase: Purchase): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/crear-lote`, purchase, { headers });
  }
}
