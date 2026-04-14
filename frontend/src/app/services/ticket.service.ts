import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MessageCreate,
  Ticket,
  TicketCreate,
  TicketMessage,
  TicketUpdate,
} from '../models/ticket.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:8081/api/tickets';

  constructor(private http: HttpClient) {}

  createTicket(ticket: TicketCreate): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  getAllTickets(page: number = 0, size: number = 20): Observable<PageResponse<Ticket>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Ticket>>(this.apiUrl, { params });
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  updateTicket(id: number, update: TicketUpdate): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, update);
  }

  addMessage(ticketId: number, message: MessageCreate): Observable<TicketMessage> {
    return this.http.post<TicketMessage>(`${this.apiUrl}/${ticketId}/messages`, message);
  }

  getTicketMessages(ticketId: number): Observable<TicketMessage[]> {
    return this.http.get<TicketMessage[]>(`${this.apiUrl}/${ticketId}/messages`);
  }
}
