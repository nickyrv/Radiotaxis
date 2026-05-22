import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Driver {
  id: number;

  name: string;
  ci: string | null;
  phone: string | null;
  email: string | null;

  license: string | null;
  license_expiry: string | null;

  address: string | null;

  status: string;

  vehicle_id: number | null;
}

export interface DriverRequest {

  name: string;
  ci: string | null;
  phone: string | null;
  email: string | null;

  license: string | null;
  license_expiry: string | null;

  address: string | null;

  status: string;

  vehicle_id: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = 'http://127.0.0.1:8000/drivers/';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  createDriver(driver: DriverRequest): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  updateDriver(
    id: number,
    driver: DriverRequest
  ): Observable<Driver> {

    return this.http.put<Driver>(
      `${this.apiUrl}${id}`,
      driver
    );
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }
}