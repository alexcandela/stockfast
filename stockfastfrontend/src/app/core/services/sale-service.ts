import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './authservice';
import { Sale } from '../interfaces/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: Authservice) { }

  makeSale(sale: Sale): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/make-sale`, sale, { headers });
  }
  
}
