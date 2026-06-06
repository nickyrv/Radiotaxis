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
  license_category: string | null;
  has_tic: boolean;
  address: string | null;
  address_lat: number | null;
  address_lng: number | null;
  photo_url: string | null;
  house_door_photo_url: string | null;
  ci_front_photo_url: string | null;
  ci_back_photo_url: string | null;
  electricity_bill_photo_url: string | null;
  criminal_record_pdf_url: string | null;
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
  license_category: string | null;
  has_tic: boolean;
  address: string | null;
  address_lat: number | null;
  address_lng: number | null;
  photo_url: string | null;
  house_door_photo_url: string | null;
  ci_front_photo_url: string | null;
  ci_back_photo_url: string | null;
  electricity_bill_photo_url: string | null;
  criminal_record_pdf_url: string | null;
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

  uploadCriminalRecord(
    id: number,
    file: File
  ): Observable<Driver> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Driver>(
      `${this.apiUrl}${id}/upload-criminal-record`,
      formData
    );
  }

  uploadDriverPhoto(
    id: number,
    file: File
  ): Observable<Driver> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<Driver>(
      `${this.apiUrl}${id}/upload-photo`,
      formData
    );
  }

  uploadDriverDocument(
    id: number,
    documentType: 'house_door' | 'ci_front' | 'ci_back' | 'electricity_bill',
    file: File
  ): Observable<Driver> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<Driver>(
      `${this.apiUrl}${id}/upload-document/${documentType}`,
      formData
    );
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }
}