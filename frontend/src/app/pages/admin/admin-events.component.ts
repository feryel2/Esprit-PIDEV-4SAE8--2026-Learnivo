import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, PlatformEvent } from '../../services/data.service';
import {
    Calendar,
    Plus,
    MapPin,
    Clock,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-events',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Event <span class="text-teal-600 underline decoration-2 underline-offset-4">Manager</span></h1>
          <p class="text-muted-foreground">Schedule and manage platform-wide events and summits.</p>
        </div>
        <button class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Create New Event
        </button>
      </div>

      <!-- Events List -->
      <div class="space-y-4">
        <div *ngFor="let event of data.events()" class="bg-white p-4 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                <div class="relative w-full lg:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                    <img [src]="event.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div class="flex-1 space-y-2">
                    <div class="flex items-center gap-2">
                        <span [class]="event.type === 'next' ? 'bg-teal-600' : 'bg-muted-foreground'" 
                              class="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded text-white italic">
                            {{ event.type }} event
                        </span>
                        <div *ngIf="event.type === 'next'" class="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                            <lucide-icon [name]="CheckCircle2" [size]="12"></lucide-icon>
                            Published
                        </div>
                    </div>
                    <h3 class="text-xl font-extrabold tracking-tight group-hover:text-teal-600 transition-colors">{{ event.title }}</h3>
                    <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="Calendar" [size]="14"></lucide-icon>
                            {{ event.date }}
                        </div>
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="MapPin" [size]="14"></lucide-icon>
                            {{ event.location }}
                        </div>
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="Clock" [size]="14"></lucide-icon>
                            2:00 PM - 5:00 PM
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button class="px-4 py-2 hover:bg-muted rounded-xl transition-all font-bold text-sm">Edit</button>
                    <button class="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all font-bold text-sm flex items-center gap-2 group/btn">
                        Manage
                        <lucide-icon [name]="ChevronRight" [size]="14" class="group-hover/btn:translate-x-1 transition-transform"></lucide-icon>
                    </button>
                    <button class="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground">
                        <lucide-icon [name]="MoreVertical" [size]="18"></lucide-icon>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class AdminEventsComponent {
    data = inject(DataService);
    readonly Calendar = Calendar;
    readonly Plus = Plus;
    readonly MapPin = MapPin;
    readonly Clock = Clock;
    readonly ChevronRight = ChevronRight;
    readonly MoreVertical = MoreVertical;
    readonly CheckCircle2 = CheckCircle2;
    readonly AlertCircle = AlertCircle;
}
