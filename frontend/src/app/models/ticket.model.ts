export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdById: number;
  createdByEmail: string;
  categoryId?: number;
  categoryName?: string;
  createdAt: string;
  closedAt?: string;
}

export interface TicketCreate {
  subject: string;
  description: string;
  priority?: TicketPriority;
  categoryId?: number;
}

export interface TicketUpdate {
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface TicketMessage {
  id: number;
  content: string;
  senderId: number;
  senderEmail: string;
  senderRole: string;
  sentAt: string;
}

export interface MessageCreate {
  content: string;
}
