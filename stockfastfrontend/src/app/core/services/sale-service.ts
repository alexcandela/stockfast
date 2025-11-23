import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './authservice';
import { Sale } from '../interfaces/sale';
import { Observable } from 'rxjs';
import { Venta, VentaResponse } from '../interfaces/venta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: Authservice) { }

  makeSale(sale: Sale): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/make-sale`, sale, { headers });
  }

  deleteSale(saleId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/delete-sale/${saleId}`, { headers });
  }
  
  updateSale(saleId: number, saleData: Partial<Sale>): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update-sale/${saleId}`, saleData, { headers });
  }  

  getSales(): Observable<VentaResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<VentaResponse>(`${this.apiUrl}/getsales`, { headers });
  }
  
}
