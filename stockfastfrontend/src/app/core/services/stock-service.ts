import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './authservice';
import { Observable } from 'rxjs';
import { StockResponse } from '../interfaces/stock';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient, private authService: Authservice) {}

  private apiUrl = environment.apiUrl;

  getStockData(): Observable<StockResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<StockResponse>(`${this.apiUrl}/get-stock-data`, { headers });
  }
}
