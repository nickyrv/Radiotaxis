import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shift {

  id: number;

  driver_id: number | null;

  vehicle_id: number | null;

  start_time: string;

  end_time: string;

  status: string;

  turn_order: number;

  is_active: number;
}

export interface ShiftRequest {

  driver_id: number | null;

  vehicle_id: number | null;

  start_time: string;

  end_time: string;

  status: string;

  turn_order: number;

  is_active: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private apiUrl =
    'http://127.0.0.1:8000/shifts/';

  constructor(
    private http: HttpClient
  ) {}

  getShifts(): Observable<Shift[]> {

    return this.http.get<Shift[]>(
      this.apiUrl
    );
  }

  createShift(
    shift: ShiftRequest
  ): Observable<Shift> {

    return this.http.post<Shift>(
      this.apiUrl,
      shift
    );
  }

  updateShift(
    id: number,
    shift: ShiftRequest
  ): Observable<Shift> {

    return this.http.put<Shift>(
      `${this.apiUrl}${id}`,
      shift
    );
  }

  deleteShift(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }
}