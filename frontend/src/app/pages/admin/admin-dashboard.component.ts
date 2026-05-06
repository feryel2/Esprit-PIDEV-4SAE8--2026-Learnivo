import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  GraduationCap,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  ArrowDownRight
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="animate-slide-up space-y-10">
      <!-- Welcome Header -->
      <div class="admin-page-header">
        <div class="header-info">
          <h1>Dashboard <span class="text-gradient">Overview</span></h1>
          <p>Analyzing Learnivo performance and community engagement.</p>
        </div>
        <div class="flex items-center gap-3">
           <div class="flex -space-x-3">
              <div *ngFor="let i of [1,2,3]" class="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
           </div>
           <span class="text-xs font-bold text-slate-400">+12 Users Online</span>
        </div>
      </div>

      <!-- Luxury Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div class="admin-glass-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Academic Content</p>
            <h3 class="text-4xl font-black text-slate-800">{{ data.trainings().length }}</h3>
            <p class="text-xs font-bold text-teal-500 mt-2 flex items-center gap-1">
              <lucide-icon [name]="ArrowUpRight" [size]="12"></lucide-icon>
              +12% Since last month
            </p>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all text-slate-900">
             <lucide-icon [name]="GraduationCap" [size]="120"></lucide-icon>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="admin-glass-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Active Communities</p>
            <h3 class="text-4xl font-black text-slate-800">{{ data.clubs().length }}</h3>
            <p class="text-xs font-bold text-teal-500 mt-2 flex items-center gap-1">
              <lucide-icon [name]="ArrowUpRight" [size]="12"></lucide-icon>
              +5% Growth rate
            </p>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all text-slate-900">
             <lucide-icon [name]="Users" [size]="120"></lucide-icon>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="admin-glass-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Scheduled Events</p>
            <h3 class="text-4xl font-black text-slate-800">{{ upcomingEventsCount }}</h3>
            <p class="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
              <lucide-icon [name]="ArrowDownRight" [size]="12"></lucide-icon>
              Live updates active
            </p>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all text-slate-900">
             <lucide-icon [name]="Calendar" [size]="120"></lucide-icon>
          </div>
        </div>

        <!-- Stat Card 4 -->
        <div class="admin-glass-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Platform Revenue</p>
            <h3 class="text-4xl font-black text-slate-800">24.5<span class="text-lg opacity-40">K</span></h3>
            <p class="text-xs font-bold text-teal-500 mt-2 flex items-center gap-1">
              <lucide-icon [name]="TrendingUp" [size]="12"></lucide-icon>
              Exceeding targets
            </p>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all text-slate-900">
             <lucide-icon [name]="TrendingUp" [size]="120"></lucide-icon>
          </div>
        </div>
      </div>

      <!-- Luxury Data Presentation -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Card 1 -->
        <div class="admin-glass-card !p-0 overflow-hidden">
           <div class="p-8 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <lucide-icon [name]="GraduationCap" [size]="20"></lucide-icon>
                 </div>
                 <h3 class="font-black text-slate-800 tracking-tight">Featured Trainings</h3>
              </div>
              <button class="text-xs font-black text-teal-600 uppercase tracking-widest hover:tracking-[2px] transition-all">Manifest</button>
           </div>
           <div class="divide-y divide-slate-50">
              <div *ngFor="let training of data.trainings().slice(0, 4)" class="p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-all group">
                 <div class="relative">
                   <img [src]="training.image" class="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform">
                   <div class="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full"></div>
                 </div>
                 <div class="flex-1 min-w-0">
                    <p class="font-bold text-slate-800 truncate mb-0.5">{{ training.title }}</p>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ training.instructor }}</p>
                 </div>
                 <div class="text-right">
                    <p class="font-black text-teal-600">{{ training.price }}</p>
                    <div class="flex items-center justify-end gap-1 mt-1">
                       <div *ngFor="let s of [1,2,3,4,5]" class="w-1.5 h-1.5 rounded-full bg-teal-500/20"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Card 2 -->
        <div class="admin-glass-card !p-0 overflow-hidden">
           <div class="p-8 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <lucide-icon [name]="Users" [size]="20"></lucide-icon>
                 </div>
                 <h3 class="font-black text-slate-800 tracking-tight">Active Guilds</h3>
              </div>
              <button class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:tracking-[2px] transition-all">Expand</button>
           </div>
           <div class="divide-y divide-slate-50">
              <div *ngFor="let club of data.clubs().slice(0, 4)" class="p-6 flex items-center gap-5 hover:bg-indigo-50/30 transition-all group">
                 <img [src]="club.image" class="w-14 h-14 rounded-full object-cover border-4 border-white shadow-xl group-hover:rotate-6 transition-transform">
                 <div class="flex-1 min-w-0">
                    <p class="font-bold text-slate-800 truncate mb-0.5">{{ club.name }}</p>
                    <p class="text-xs font-bold text-slate-400">{{ club.members || 0 }} Elite Members Joined</p>
                 </div>
                 <button class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <lucide-icon [name]="ArrowUpRight" [size]="18"></lucide-icon>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  data = inject(DataService);

  get upcomingEventsCount() {
    return this.data.events().filter(e => e.type === 'next').length;
  }

  readonly GraduationCap = GraduationCap;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly TrendingUp = TrendingUp;
  readonly ArrowUpRight = ArrowUpRight;
  readonly TrendingDown = TrendingDown;
  readonly ArrowDownRight = ArrowDownRight;
}
