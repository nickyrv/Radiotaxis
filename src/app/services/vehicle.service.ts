import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  year: number;

  owner_id: number | null;

  service_type: string;
  radio_code: string | null;

  status: string;

  last_maintenance: string | null;
  next_maintenance: string | null;

  photo_url: string | null;
  color: string | null;
  restriction_day: string | null;

  registration_date: string | null;
  deactivation_date: string | null;

  management_status: string;
  management_type: string;

  current_driver_id: number | null;
  admin_id: number | null;
}

export interface VehicleRequest {
  plate: string;
  model: string;
  year: number;

  owner_id: number | null;

  service_type: string;
  radio_code: string | null;

  status: string;

  last_maintenance: string | null;
  next_maintenance: string | null;

  photo_url: string | null;
  color: string | null;
  restriction_day: string | null;

  registration_date: string | null;
  deactivation_date: string | null;

  management_status: string;
  management_type: string;

  current_driver_id: number | null;
  admin_id: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://127.0.0.1:8000/vehicles/';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  createVehicle(vehicle: VehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: VehicleRequest): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}${id}`, vehicle);
  }

  deactivateVehicle(id: number): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.apiUrl}${id}/deactivate`, {});
  }

  activateVehicle(id: number): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.apiUrl}${id}/activate`, {});
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
  uploadVehiclePhoto(id: number, file: File): Observable<Vehicle> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<Vehicle>(
    `${this.apiUrl}${id}/upload-photo`,
    formData
    );
  }
}