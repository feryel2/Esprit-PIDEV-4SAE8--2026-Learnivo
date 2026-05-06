import { Component, inject, signal, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-header-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ClickOutsideDirective],
  template: `
    <div class="relative inline-block" (appClickOutside)="isOpen.set(false)">
      <button (click)="isOpen.set(!isOpen())" 
              class="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-300 group overflow-hidden"
              aria-label="Calendrier">
        <div class="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors"></div>
        <lucide-icon [name]="CalendarIconName" [size]="20" 
                     class="text-slate-500 group-hover:text-teal-600 transition-colors relative z-10"></lucide-icon>
      </button>

      <!-- Calendar Dropdown -->
      <div *ngIf="isOpen()" 
           [ngClass]="position === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'"
           class="absolute top-full mt-4 w-[320px] bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[999] overflow-hidden animate-calendar-pop">
        
        <!-- Glass Header -->
        <div class="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100/50">
          <div class="flex items-center justify-between mb-4">
             <button (click)="prevMonth()" class="nav-btn">
                <lucide-icon [name]="ChevronLeft" [size]="16"></lucide-icon>
             </button>
             <div class="text-center">
                <h3 class="font-black text-slate-800 text-lg capitalize tracking-tight">{{ monthName }}</h3>
                <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest">{{ viewDate.getFullYear() }}</p>
             </div>
             <button (click)="nextMonth()" class="nav-btn">
                <lucide-icon [name]="ChevronRight" [size]="16"></lucide-icon>
             </button>
          </div>

          <!-- Week Days Grid -->
          <div class="calendar-grid mb-2">
            <div *ngFor="let day of weekDays" class="weekday-label">
              {{ day }}
            </div>
          </div>
        </div>

        <!-- Days Grid -->
        <div class="p-4 bg-white">
          <div class="calendar-grid">
            <div *ngFor="let day of calendarDays" 
                 class="day-cell"
                 [ngClass]="{
                   'is-dimmed': !day.isCurrentMonth,
                   'is-today': day.isToday,
                   'is-next': day.isNext && !day.isToday,
                   'has-event': day.hasEvents && !day.isToday && !day.isNext,
                   'is-active': day.isCurrentMonth && !day.isToday && !day.isNext
                 }">
              <span class="relative z-10">{{ day.value }}</span>
              <div *ngIf="day.hasEvents" class="event-dot"></div>
            </div>
          </div>
        </div>

        <!-- Upcoming Fast Info -->
        <div class="p-6 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100">
           <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Événements à venir</span>
              <div class="h-1 w-8 bg-teal-200 rounded-full"></div>
           </div>
           
           <div class="space-y-3">
              @if (upcomingEvents().length === 0) {
                <p class="text-[10px] text-slate-400 italic text-center py-2">Aucun événement prévu</p>
              }
              <div *ngFor="let event of upcomingEvents()" class="event-item group">
                 <div class="event-date-box">
                    <span class="event-month">{{ event.month }}</span>
                    <span class="event-day">{{ event.day }}</span>
                 </div>
                 <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-700 truncate group-hover:text-teal-600 transition-colors">{{ event.title }}</p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                       <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                       <p class="text-[10px] font-bold text-slate-400">{{ event.time }}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-btn {
      @apply p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all text-slate-400 hover:text-teal-600 active:scale-95;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .weekday-label {
      @apply text-[10px] font-black text-slate-300 uppercase text-center py-1;
    }

    .day-cell {
      @apply aspect-square flex flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition-all relative cursor-pointer;
    }

    .is-dimmed { @apply text-slate-200; }
    .is-active:hover { @apply bg-slate-50 text-slate-800 scale-105; }
    
    .is-today { 
      @apply bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-110 z-10; 
    }

    .is-next {
      @apply bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-110 z-10 ring-4 ring-violet-500/20 animate-pulse-subtle;
    }
    
    .has-event { 
      @apply bg-amber-50 text-amber-600 border border-amber-100/50; 
    }

    @keyframes pulse-subtle {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.15); }
    }

    .event-dot {
      @apply absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-50;
    }

    .event-item {
      @apply flex items-center gap-3 p-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all cursor-pointer;
    }

    .event-date-box {
      @apply w-10 h-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm;
    }

    .event-month { @apply text-[8px] font-black text-teal-500 leading-none; }
    .event-day { @apply text-xs font-black text-slate-800 leading-none mt-0.5; }

    .animate-calendar-pop {
      animation: calendarPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes calendarPop {
      from { opacity: 0; transform: scale(0.9) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class HeaderCalendarComponent {
  private data = inject(DataService);
  
  @Input() position: 'left' | 'right' = 'right';
  
  isOpen = signal(false);
  viewDate = new Date();

  nextEvent = computed(() => {
    const events = this.data.events();
    const futureEvents = events
      .filter(e => new Date(e.date) >= new Date())
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futureEvents.length > 0 ? futureEvents[0] : null;
  });
  
  readonly CalendarIconName = CalendarIcon;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly X = X;

  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  get monthName() {
    return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(this.viewDate);
  }

  get calendarDays() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    
    // First day of month (Adjusting for Monday as first day)
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayOfMonth = (firstDay === 0 ? 6 : firstDay - 1);
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: any[] = [];
    
    // Prev month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ value: daysInPrevMonth - i, isCurrentMonth: false });
    }
    
    // Current month days
    const today = new Date();
    const events = this.data.events();

    for (let i = 1; i <= daysInMonth; i++) {
       const date = new Date(year, month, i);
       const dateString = date.toDateString();
       
       const hasEvents = events.some(e => e.startTime && new Date(e.startTime).toDateString() === dateString);
       const isNext = this.nextEvent() && new Date(this.nextEvent()!.startTime!).toDateString() === dateString;

       days.push({
         value: i,
         isCurrentMonth: true,
         isToday: dateString === today.toDateString(),
         isNext,
         hasEvents
       });
    }
    
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ value: i, isCurrentMonth: false });
    }
    
    return days;
  }

  upcomingEvents = computed(() => {
    const now = new Date();
    return this.data.events()
      .filter(e => e.startTime && new Date(e.startTime) >= now)
      .sort((a,b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime())
      .slice(0, 3)
      .map(e => {
        const d = new Date(e.startTime!);
        return {
          title: e.title,
          day: d.getDate(),
          month: new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d).toUpperCase().replace('.', ''),
          time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      });
  });

  ngOnInit() {
    this.data.loadEventsFromBackend(true);
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }
}
