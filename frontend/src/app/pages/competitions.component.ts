import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Trophy, Calendar, ArrowRight, Filter } from 'lucide-angular';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-competitions',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    template: `
    <div class="min-h-screen bg-background pb-20 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="space-y-4 max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Global <span class="text-teal-600 underline underline-offset-8 decoration-4">Competitions</span>
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              Test your skills, compete with the best, and win life-changing prizes. Our contests are designed to push your limits.
            </p>
          </div>
          
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border font-bold text-sm hover:bg-muted transition-all">
              <lucide-icon [name]="Filter" [size]="18"></lucide-icon>
              Filter
            </button>
          </div>
        </div>

        <!-- Competitions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (comp of data.competitions(); track comp.id) {
            <div class="group relative flex flex-col bg-white rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-teal-600/10 transition-all duration-500 hover:-translate-y-1">
              <!-- Image -->
              <div class="relative aspect-[16/10] overflow-hidden">
                <img [src]="comp.image" [alt]="comp.title" class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                  <span [ngClass]="{
                    'bg-teal-600': comp.status === 'ongoing',
                    'bg-orange-500': comp.status === 'upcoming',
                    'bg-muted-foreground': comp.status === 'completed'
                  }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-black/20">
                    {{ comp.status }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs font-bold text-teal-600 uppercase tracking-wider">{{ comp.category }}</span>
                </div>
                
                <h3 class="text-xl font-extrabold text-foreground mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                  {{ comp.title }}
                </h3>
                
                <p class="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 italic">
                  "{{ comp.description }}"
                </p>

                <!-- Prizes & Deadline -->
                <div class="grid grid-cols-2 gap-4 py-4 border-t border-border mt-auto">
                  <div class="space-y-1">
                    <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Grand Prize</span>
                    <div class="flex items-center gap-1.5 text-teal-600 font-bold text-xs">
                      <lucide-icon [name]="Trophy" [size]="14"></lucide-icon>
                      {{ comp.prize }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <span class="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deadline</span>
                    <div class="flex items-center gap-1.5 text-foreground font-bold text-xs">
                      <lucide-icon [name]="Calendar" [size]="14"></lucide-icon>
                      {{ comp.deadline }}
                    </div>
                  </div>
                </div>

                <!-- Action -->
                <a [routerLink]="['/competitions', comp.slug]" 
                   class="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group/btn shadow-lg shadow-teal-600/20 active:scale-[0.98]">
                  View Challenge
                  <lucide-icon [name]="ArrowRight" [size]="18" class="group-hover/btn:translate-x-1 transition-transform"></lucide-icon>
                </a>
              </div>
            </div>
          }
        </div>
        
        @if (data.competitions().length === 0) {
          <div class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-border">
            <p class="text-muted-foreground font-medium">No competitions available right now. Check back later!</p>
          </div>
        }
      </div>
    </div>
  `
})
export class CompetitionsComponent {
    data = inject(DataService);

    readonly Trophy = Trophy;
    readonly Calendar = Calendar;
    readonly ArrowRight = ArrowRight;
    readonly Filter = Filter;
}
