import { Injectable } from '@angular/core';
import { Purchase } from '../interfaces/purchase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://127.0.0.1:8000/api/crear-lote';

  constructor(private http: HttpClient) { }

  crearLote(purchase: Purchase): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }
  
}
