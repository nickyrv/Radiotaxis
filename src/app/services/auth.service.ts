import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface LoginRequest {

  email: string;

  password: string;

  role: string;
}

export interface LoginResponse {

  id: number;

  name: string;

  email: string;

  role: string;

  related_id: number | null;

  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://127.0.0.1:8000/auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    data: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

}