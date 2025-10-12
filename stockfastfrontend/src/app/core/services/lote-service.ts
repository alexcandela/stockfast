import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../interfaces/lote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://127.0.0.1:8000/api/crear-lote';

  constructor(private http: HttpClient) { }

  crearLote(lote: Lote): Observable<any> {
    return this.http.post(this.apiUrl, lote);
  }
}
