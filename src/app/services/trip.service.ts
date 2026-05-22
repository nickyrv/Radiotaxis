import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  trip_date: string;
  price: number;
  status: string;
  driver_id: number | null;
  vehicle_id: number | null;
  passenger_name: string | null;
  passenger_phone: string | null;
  observations: string | null;
}

export interface TripRequest {
  origin: string;
  destination: string;
  trip_date: string;
  price: number;
  status: string;
  driver_id: number | null;
  vehicle_id: number | null;
  passenger_name: string | null;
  passenger_phone: string | null;
  observations: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://127.0.0.1:8000/trips/';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  createTrip(trip: TripRequest): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  updateTrip(id: number, trip: TripRequest): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}${id}`, trip);
  }

  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}