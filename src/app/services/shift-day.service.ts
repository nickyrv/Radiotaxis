import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShiftDay {

  id: number;

  vehicle_id: number;

  driver_id: number | null;

  shift_date: string;

  source: string;

  notes: string | null;

  created_at: string | null;
}

export interface ShiftDayRequest {

  vehicle_id: number;

  driver_id: number | null;

  shift_date: string;

  source?: string;

  notes?: string | null;
}

export interface ProgramShiftDaysRequest {
  vehicle_id: number;
  driver_ids: number[];
  start_date: string;
  days_to_generate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftDayService {

  private apiUrl =
    'http://127.0.0.1:8000/shift-days/';

  constructor(
    private http: HttpClient
  ) {}

  getShiftDays(): Observable<ShiftDay[]> {
    return this.http.get<ShiftDay[]>(
      this.apiUrl
    );
  }

  getShiftDaysByVehicle(
    vehicleId: number
  ): Observable<ShiftDay[]> {

    return this.http.get<ShiftDay[]>(
      `${this.apiUrl}vehicle/${vehicleId}`
    );
  }

  programShiftDays(
    data: ProgramShiftDaysRequest
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}program`,
      data
    );
  }

  createShiftDay(
    shiftDay: ShiftDayRequest
  ): Observable<ShiftDay> {

    return this.http.post<ShiftDay>(
      this.apiUrl,
      shiftDay
    );
  }

  updateShiftDay(
    id: number,
    shiftDay: Partial<ShiftDayRequest>
  ): Observable<ShiftDay> {

    return this.http.put<ShiftDay>(
      `${this.apiUrl}${id}`,
      shiftDay
    );
  }

  deleteShiftDay(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }
}