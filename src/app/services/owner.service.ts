import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Owner {
  id: number;

  name: string;
  ci: string | null;
  phone: string | null;
  email: string | null;

  address: string | null;
  address_lat: number | null;
  address_lng: number | null;

  status: string;

  join_date: string | null;
}

export interface OwnerRequest {

  name: string;
  ci: string | null;
  phone: string | null;
  email: string | null;

  address: string | null;
  address_lat: number | null;
  address_lng: number | null;

  status: string;

  join_date: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = 'http://127.0.0.1:8000/owners/';

  constructor(private http: HttpClient) {}

  getOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>(this.apiUrl);
  }

  createOwner(owner: OwnerRequest): Observable<Owner> {
    return this.http.post<Owner>(this.apiUrl, owner);
  }

  updateOwner(id: number, owner: OwnerRequest): Observable<Owner> {
    return this.http.put<Owner>(`${this.apiUrl}${id}`, owner);
  }

  deleteOwner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}