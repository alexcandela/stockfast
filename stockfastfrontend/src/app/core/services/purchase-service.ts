import { Injectable } from '@angular/core';
import { Purchase } from '../interfaces/purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authservice } from './authservice'; // tu AuthService

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://127.0.0.1:8000/api/crear-lote';

  constructor(private http: HttpClient, private authService: Authservice) { }

  crearLote(purchase: Purchase): Observable<any> {
    const token = this.authService.getToken(); // obtenemos el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, purchase, { headers });
  }
}
