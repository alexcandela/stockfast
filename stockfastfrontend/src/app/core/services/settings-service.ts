import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, private authService: Authservice) {}

   private apiUrl = 'http://127.0.0.1:8000/api';

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

  changeUserPassword(passwordData: any) {
    // Lógica para cambiar la contraseña del usuario en el backend
  }

  updateNotificationSettings(notificationData: any) {
    // Lógica para actualizar las configuraciones de notificaciones en el backend
  }
}
