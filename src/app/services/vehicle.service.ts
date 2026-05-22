import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  year: number;
  owner_id: number | null;
  status: string;
  last_maintenance: string | null;
  next_maintenance: string | null;
  document_expiry: string | null;
}

export interface VehicleRequest {
  plate: string;
  model: string;
  year: number;
  owner_id: number | null;
  status: string;
  last_maintenance: string | null;
  next_maintenance: string | null;
  document_expiry: string | null;
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

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}