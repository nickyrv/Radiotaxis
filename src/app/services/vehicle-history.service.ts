import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface VehicleHistory {
  id: number;

  vehicle_id: number;
  driver_id: number | null;

  category: string;
  detail: string | null;

  event_date: string;
  cost: number | null;

  description: string | null;
  created_at: string;
}

export interface VehicleHistoryRequest {
  vehicle_id: number;
  driver_id: number | null;

  category: string;
  detail: string | null;

  event_date: string;
  cost: number | null;

  description: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleHistoryService {

  private apiUrl = 'http://127.0.0.1:8000/vehicle-history/';

  constructor(
    private http: HttpClient
  ) {}

  getVehicleHistory(
    vehicleId: number
  ): Observable<VehicleHistory[]> {

    return this.http.get<VehicleHistory[]>(
      `${this.apiUrl}vehicle/${vehicleId}`
    );
  }

  getAllHistory(): Observable<VehicleHistory[]> {
    return this.http.get<VehicleHistory[]>(
      this.apiUrl
    );
  }

  createHistory(data: VehicleHistoryRequest): Observable<VehicleHistory> {
    return this.http.post<VehicleHistory>(
      this.apiUrl,
      data
    );
  }

  updateHistory(
    id: number,
    data: VehicleHistoryRequest
  ): Observable<VehicleHistory> {
    return this.http.put<VehicleHistory>(
      `${this.apiUrl}${id}`,
      data
    );
  }

  deleteHistory(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }

}