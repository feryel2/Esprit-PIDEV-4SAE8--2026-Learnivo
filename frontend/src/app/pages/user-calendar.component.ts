import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, PlatformEvent } from '../services/data.service';

@Component({
  selector: 'app-user-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="calendar-page">
      <div class="calendar-sidebar">
        <div class="sidebar-header">
          <a routerLink="/" class="back-link">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            RETOUR
          </a>
          <h2 class="sidebar-title">Événements <span class="highlight">Prochains</span></h2>
        </div>

        <div class="upcoming-list">
          <div *ngIf="upcomingEvents.length === 0" class="empty-state">
            Aucun événement prévu prochainement.
          </div>
          <div *ngFor="let event of upcomingEvents" class="event-card-mini" [routerLink]="['/events', event.slug]">
            <div class="event-date-badge">
              <span class="day">{{ getDay(event.startTime) }}</span>
              <span class="month">{{ getMonthShort(event.startTime) }}</span>
            </div>
            <div class="event-info-mini">
              <h3 class="event-title-mini">{{ event.title }}</h3>
              <p class="event-time-mini">{{ getTime(event.startTime) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="calendar-main">
        <div class="calendar-header">
          <div class="month-selector">
            <button (click)="prevMonth()" class="nav-btn">&lt;</button>
            <h1 class="current-month">{{ monthNames[currentMonth] }} {{ currentYear }}</h1>
            <button (click)="nextMonth()" class="nav-btn">&gt;</button>
          </div>
          <div class="view-options">
            <span class="today-marker" (click)="goToToday()">Aujourd'hui</span>
          </div>
        </div>

        <div class="calendar-grid">
          <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
          
          <div *ngFor="let emptyDay of emptyDays" class="day-cell empty"></div>
          
          <div *ngFor="let day of daysInMonth" 
               class="day-cell" 
               [class.today]="isToday(day)"
               [class.has-events]="getEventsForDay(day).length > 0">
            <span class="day-number">{{ day }}</span>
            <div class="event-indicators">
              <div *ngFor="let event of getEventsForDay(day)" 
                   class="event-dot" 
                   [title]="event.title"
                   [style.background-color]="getEventColor(event)">
              </div>
            </div>
            
            <div class="day-popover" *ngIf="getEventsForDay(day).length > 0">
              <div *ngFor="let event of getEventsForDay(day)" class="popover-event" [routerLink]="['/events', event.slug]">
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-page {
      display: flex;
      height: 100vh;
      background-color: #0f172a;
      color: white;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }

    /* Sidebar */
    .calendar-sidebar {
      width: 350px;
      background-color: #1e1b4b;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      padding: 24px;
    }

    .sidebar-header {
      margin-bottom: 32px;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #d2f500;
    }

    .sidebar-title {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
    }

    .highlight {
      color: #d2f500;
    }

    .upcoming-list {
      flex: 1;
      overflow-y: auto;
      padding-right: 8px;
    }

    .upcoming-list::-webkit-scrollbar {
      width: 4px;
    }

    .upcoming-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .event-card-mini {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .event-card-mini:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      border-color: #d2f500;
    }

    .event-date-badge {
      width: 50px;
      height: 50px;
      background: #312e81;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .event-date-badge .day {
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
    }

    .event-date-badge .month {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0.6;
    }

    .event-info-mini {
      min-width: 0;
    }

    .event-title-mini {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-time-mini {
      font-size: 12px;
      opacity: 0.5;
      margin: 0;
    }

    /* Main Calendar */
    .calendar-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 24px 40px;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .month-selector {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .current-month {
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      min-width: 250px;
      text-align: center;
    }

    .nav-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .nav-btn:hover {
      background: #d2f500;
      color: #0f172a;
    }

    .today-marker {
      background: rgba(210, 245, 0, 0.1);
      color: #d2f500;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .today-marker:hover {
      background: #d2f500;
      color: #0f172a;
    }

    .calendar-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: auto repeat(6, 1fr);
      gap: 12px;
    }

    .weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.3);
      padding-bottom: 12px;
    }

    .day-cell {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 80px;
      transition: all 0.2s;
    }

    .day-cell.empty {
      background: transparent;
      border: none;
    }

    .day-cell:not(.empty):hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .day-cell.today {
      background: rgba(210, 245, 0, 0.05);
      border-color: #d2f500;
    }

    .day-cell.today .day-number {
      color: #d2f500;
      font-weight: 900;
    }

    .day-number {
      font-size: 16px;
      font-weight: 700;
      opacity: 0.8;
      margin-bottom: 8px;
    }

    .event-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .event-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    /* Popover on hover */
    .day-popover {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #312e81;
      border-radius: 12px;
      padding: 8px;
      z-index: 10;
      width: 150px;
      display: none;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .day-cell:hover .day-popover {
      display: block;
    }

    .popover-event {
      font-size: 11px;
      padding: 6px 8px;
      border-radius: 6px;
      margin-bottom: 4px;
      background: rgba(255, 255, 255, 0.1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .popover-event:hover {
      background: rgba(210, 245, 0, 0.2);
      color: #d2f500;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      opacity: 0.5;
      font-style: italic;
      font-size: 14px;
    }
  `]
})
export class UserCalendarComponent implements OnInit {
  private dataService = inject(DataService);

  monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  daysInMonth: number[] = [];
  emptyDays: number[] = [];
  upcomingEvents: PlatformEvent[] = [];
  eventsInMonth: PlatformEvent[] = [];

  constructor() {
    effect(() => {
      this.dataService.events();
      this.updateEvents();
    });
  }

  ngOnInit() {
    this.dataService.loadEventsFromBackend(true);
    this.generateCalendar();
    this.updateEvents();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.emptyDays = Array(firstDay).fill(0);
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  updateEvents() {
    const allEvents = this.dataService.events();
    const now = new Date();

    // Upcoming events (today and future)
    this.upcomingEvents = allEvents
      .filter(e => e.startTime && new Date(e.startTime) >= now)
      .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime())
      .slice(0, 10);

    // Events in current month
    this.eventsInMonth = allEvents.filter(e => {
      if (!e.startTime) return false;
      const d = new Date(e.startTime);
      return d.getMonth() === this.currentMonth && d.getFullYear() === this.currentYear;
    });
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.updateEvents();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.updateEvents();
  }

  goToToday() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
    this.updateEvents();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === this.currentMonth && 
           today.getFullYear() === this.currentYear;
  }

  getEventsForDay(day: number): PlatformEvent[] {
    return this.eventsInMonth.filter(e => {
      if (!e.startTime) return false;
      const d = new Date(e.startTime);
      return d.getDate() === day;
    });
  }

  getEventColor(event: PlatformEvent): string {
    if (event.clubId) return '#10b981'; // Club event - green
    return '#6366f1'; // General event - indigo
  }

  getDay(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).getDate().toString();
  }

  getMonthShort(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('default', { month: 'short' }).replace('.', '');
  }

  getTime(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
