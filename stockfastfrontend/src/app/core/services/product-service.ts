import { Injectable } from '@angular/core';
import { Authservice } from './authservice';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product, ProductResponse } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private authService: Authservice) {}

  private apiUrl = 'http://127.0.0.1:8000/api';

  getProducts(): Observable<ProductResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ProductResponse>(`${this.apiUrl}/get-products`, { headers });
  }
}
