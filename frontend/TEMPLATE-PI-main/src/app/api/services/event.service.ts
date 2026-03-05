import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  list(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events');
  }

  get(id: number): Observable<Event> {
    return this.http.get<Event>(`/api/events/${id}`);
  }

  create(dto: EventRequest): Observable<Event> {
    return this.http.post<Event>('/api/events', dto);
  }

  update(id: number, dto: EventRequest): Observable<Event> {
    return this.http.put<Event>(`/api/events/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/events/${id}`);
  }
}
