import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleManagementEvent {
  id: number;
  vehicle_id: number;
  event_type: string;
  event_datetime: string;
  notes: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleManagementEventService {

  private apiUrl =
    'http://127.0.0.1:8000/vehicle-management-events/';

  constructor(
    private http: HttpClient
  ) {}

  getEvents(): Observable<VehicleManagementEvent[]> {
    return this.http.get<VehicleManagementEvent[]>(
      this.apiUrl
    );
  }

  getVehicleEvents(
    vehicleId: number
  ): Observable<VehicleManagementEvent[]> {

    return this.http.get<VehicleManagementEvent[]>(
      `${this.apiUrl}vehicle/${vehicleId}`
    );
  }

}