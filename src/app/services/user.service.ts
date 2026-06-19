import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  related_id: number | null;
  status: string;
  photo_url: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/users/';

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}${id}`
    );
  }

  uploadUserPhoto(
    id: number,
    file: File
  ): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UserProfile>(
      `${this.apiUrl}${id}/upload-photo`,
      formData
    );
  }
}