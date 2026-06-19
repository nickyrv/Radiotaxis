import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestItem {
  id: number;
  requester_role: string;
  requester_id: number;

  owner_id: number | null;
  driver_id: number | null;
  vehicle_id: number | null;

  request_type: string;
  request_status: string;

  deactivation_type: string | null;
  start_date: string | null;
  end_date: string | null;

  reason: string | null;
  details: string | null;
  admin_response: string | null;

  created_at: string | null;
  reviewed_at: string | null;
}

export interface RequestCreate {
  requester_role: string;
  requester_id: number;

  owner_id: number | null;
  driver_id: number | null;
  vehicle_id: number | null;

  request_type: string;
  request_status?: string;

  deactivation_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;

  reason?: string | null;
  details?: string | null;

  admin_response?: string | null;
}

export interface RequestUpdate {
  request_status: string;
  admin_response?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://127.0.0.1:8000/requests/';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(this.apiUrl);
  }

  getPendingCount(): Observable<{ pending: number }> {
    return this.http.get<{ pending: number }>(
      `${this.apiUrl}pending-count`
    );
  }

  getOwnerRequests(ownerId: number): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(
      `${this.apiUrl}owner/${ownerId}`
    );
  }

  getDriverRequests(driverId: number): Observable<RequestItem[]> {
    return this.http.get<RequestItem[]>(
      `${this.apiUrl}driver/${driverId}`
    );
  }

  createRequest(request: RequestCreate): Observable<RequestItem> {
    return this.http.post<RequestItem>(
      this.apiUrl,
      request
    );
  }

  updateRequest(
    id: number,
    request: RequestUpdate
  ): Observable<RequestItem> {
    return this.http.put<RequestItem>(
      `${this.apiUrl}${id}`,
      request
    );
  }
}