import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authservice } from './authservice';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  constructor(private http: HttpClient, private authService: Authservice) {}

  private apiUrl = 'http://127.0.0.1:8000/api';

  getGeneralData(filter: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams();
    if (filter !== 'total') {
      params = params.set('month', filter);
    }

    return this.http.get<any>(`${this.apiUrl}/getgeneraldata`, { headers, params });
  }
}
