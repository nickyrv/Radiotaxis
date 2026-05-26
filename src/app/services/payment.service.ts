import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {

  id: number;

  driver_id: number | null;

  vehicle_id: number | null;

  trip_id: number | null;

  amount: number;

  type: string;

  concept: string;

  payment_date: string;

  status: string;

  observations: string | null;
}

export interface PaymentRequest {

  driver_id: number | null;

  vehicle_id: number | null;

  trip_id: number | null;

  amount: number;

  type: string;

  concept: string;

  payment_date: string;

  status: string;

  observations: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl =
    'http://127.0.0.1:8000/payments/';

  constructor(
    private http: HttpClient
  ) {}

  getPayments(): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      this.apiUrl
    );
  }

  createPayment(
    payment: PaymentRequest
  ): Observable<Payment> {

    return this.http.post<Payment>(
      this.apiUrl,
      payment
    );
  }

  updatePayment(
    id: number,
    payment: PaymentRequest
  ): Observable<Payment> {

    return this.http.put<Payment>(
      `${this.apiUrl}${id}`,
      payment
    );
  }

  deletePayment(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${id}`
    );
  }
}