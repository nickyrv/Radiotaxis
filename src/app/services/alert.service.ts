import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alert {

  id: number;

  title: string;

  description: string | null;

  type: string;

  severity: string;

  status: string;

  alert_date: string;

  related_entity: string | null;

  related_id: number | null;
}

export interface AlertRequest {

  title: string;

  description: string | null;

  type: string;

  severity: string;

  status: string;

  alert_date: string;

  related_entity: string | null;

  related_id: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private apiUrl =
    'http://127.0.0.1:8000/alerts/';

  constructor(
    private http: HttpClient
  ) {}

  getAlerts(): Observable<Alert[]> {

    return this.http.get<Alert[]>(
      this.apiUrl
    );
  }

  createAlert(
    alert: AlertRequest
  ): Observable<Alert> {

    return this.http.post<Alert>(
      this.apiUrl,
      alert
    );
  }

  updateAlert(
    id: number,
    alert: AlertRequest
  ): Observable<Alert> {

    return this.http.put<Alert>(
      `${this.apiUrl}${id}`,
      alert
    );
  }

  deleteAlert(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }

  resolveAlert(
    id: number
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}${id}/resolve`,
      {}
    );
  }
}