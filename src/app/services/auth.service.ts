import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  servicios: any[] = [];
  private apiUrl = environment.apiUrl;

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: 'Bearer ' + token } : {};
  }


  async login(identifier: string, password: string) {
    return await axios.post(this.apiUrl + '/auth/local', { identifier, password });
  }

  async loginGoogle(access_token: string) {
    return await axios.get(`${this.apiUrl}/auth/google/callback?access_token=${access_token}`);
  }

  async forgot(email: string) {
    return await axios.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  async reset(code: string, password: string, passwordConfirmation: string) {
    return await axios.post(`${this.apiUrl}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    });
  }
  }
