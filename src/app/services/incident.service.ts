import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incident {

  id: number;

  driver_id: number | null;

  vehicle_id: number | null;

  type: string;

  description: string;

  incident_date: string;

  status: string;
}

export interface IncidentRequest {

  driver_id: number | null;

  vehicle_id: number | null;

  type: string;

  description: string;

  incident_date: string;

  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl =
    'http://127.0.0.1:8000/incidents/';

  constructor(
    private http: HttpClient
  ) {}

  getIncidents(): Observable<Incident[]> {

    return this.http.get<Incident[]>(
      this.apiUrl
    );
  }

  createIncident(
    incident: IncidentRequest
  ): Observable<Incident> {

    return this.http.post<Incident>(
      this.apiUrl,
      incident
    );
  }

  updateIncident(
    id: number,
    incident: IncidentRequest
  ): Observable<Incident> {

    return this.http.put<Incident>(
      `${this.apiUrl}${id}`,
      incident
    );
  }

  deleteIncident(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }

  resolveIncident(
    id: number
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}${id}/resolve`,
      {}
    );
  }
}