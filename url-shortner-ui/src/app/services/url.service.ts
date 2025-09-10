import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShortenRequest {
  long_url: string;
  custom_code?: string;
  expire_minutes?: number;
}

export interface ShortenResponse {
  short_url: string;
}

export interface UrlStats {
  long_url: string;
  expiry_time: string;
  created_at: string;
  short_url: string;
}

export interface UrlEntry {
  long_url: string;
  expiry_time: string | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  shortenUrl(request: ShortenRequest): Observable<ShortenResponse> {
    return this.http.post<ShortenResponse>(`${this.apiUrl}/shorten`, request);
  }

  getAllUrls(): Observable<{[key: string]: UrlEntry}> {
    return this.http.get<{[key: string]: UrlEntry}>(`${this.apiUrl}/list`);
  }

  getUrlStats(shortCode: string): Observable<UrlStats> {
    return this.http.get<UrlStats>(`${this.apiUrl}/stats/${shortCode}`);
  }
}
