import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './authservice';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient, private authService: Authservice) {}

  private apiUrl = environment.apiUrl;

  getUserData() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/get-userdata`, { headers });
  }

  updateUserProfile(profileData: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/update-userdata`, profileData, { headers });
  }

  updateUserPassword(passwordData: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/update-password`, passwordData, { headers });
  }
}
