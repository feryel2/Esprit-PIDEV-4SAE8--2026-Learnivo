import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Trophy, Calendar, ArrowRight, Filter, ThumbsUp, ThumbsDown, BarChart3 } from 'lucide-angular';
import { DataService, CompetitionRanking } from '../services/data.service';

type Tab = 'all' | 'ranking';

@Component({
    selector: 'app-competitions',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    template: `
    <div class="min-h-screen bg-background pb-20 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div class="space-y-4 max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Global <span class="text-teal-600 underline underline-offset-8 decoration-4">Competitions</span>
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed">
              Test your skills, compete with the best, and win life-changing prizes.
            </p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-2 mb-10 border-b border-border">
          <button (click)="activeTab.set('all')"
                  [ngClass]="activeTab() === 'all'
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-muted-foreground hover:text-foreground'"
                  class="flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all -mb-px">
            <lucide-icon [name]="Trophy" [size]="16"></lucide-icon>
            All Competitions
          </button>
          <button (click)="loadRanking()"
                  [ngClass]="activeTab() === 'ranking'
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-muted-foreground hover:text-foreground'"
                  class="flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all -mb-px">
            <lucide-icon [name]="BarChart3" [size]="16"></lucide-icon>
            Popularity Ranking
          </button>
        </div>

        <!-- ── ALL COMPETITIONS ────────────────────────────────────────── -->
        @if (activeTab() === 'all') {
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
        }

        <!-- ── POPULARITY RANKING ──────────────────────────────────────── -->
        @if (activeTab() === 'ranking') {
          <div class="space-y-4">
            @if (rankingLoading()) {
              <div class="py-20 text-center">
                <div class="animate-pulse text-teal-600 font-bold">Loading ranking...</div>
              </div>
            } @else if (ranking().length === 0) {
              <div class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-border">
                <p class="text-muted-foreground font-medium">No votes yet. Be the first to vote!</p>
              </div>
            } @else {
              @for (item of ranking(); track item.competitionId; let i = $index) {
                <div class="flex items-center gap-6 bg-white rounded-3xl border border-border p-5 hover:shadow-xl hover:shadow-teal-600/5 transition-all duration-300 hover:-translate-y-0.5">

                  <!-- Rank badge -->
                  <div [ngClass]="{
                    'bg-yellow-400 text-white shadow-lg shadow-yellow-400/40': i === 0,
                    'bg-gray-300 text-white shadow-lg shadow-gray-300/40': i === 1,
                    'bg-orange-400 text-white shadow-lg shadow-orange-400/40': i === 2,
                    'bg-muted text-muted-foreground': i > 2
                  }" class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                    {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + item.rank }}
                  </div>

                  <!-- Image -->
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                    <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover">
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[10px] font-black text-teal-600 uppercase tracking-widest">{{ item.category }}</span>
                      <span [ngClass]="{
                        'bg-teal-100 text-teal-700': item.status === 'ongoing',
                        'bg-orange-100 text-orange-700': item.status === 'upcoming',
                        'bg-gray-100 text-gray-600': item.status === 'completed'
                      }" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {{ item.status }}
                      </span>
                    </div>
                    <h3 class="font-extrabold text-foreground truncate">{{ item.title }}</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      🏆 {{ item.prize }} · {{ item.participantCount }} participants
                    </p>
                  </div>

                  <!-- Vote stats -->
                  <div class="flex items-center gap-4 shrink-0">
                    <div class="flex items-center gap-1.5 text-teal-600 font-bold text-sm">
                      <lucide-icon [name]="ThumbsUp" [size]="15"></lucide-icon>
                      {{ item.likes }}
                    </div>
                    <div class="flex items-center gap-1.5 text-red-500 font-bold text-sm">
                      <lucide-icon [name]="ThumbsDown" [size]="15"></lucide-icon>
                      {{ item.dislikes }}
                    </div>
                    <div class="text-right">
                      <p class="font-black text-lg"
                         [ngClass]="item.score >= 0 ? 'text-teal-600' : 'text-red-500'">
                        {{ item.score >= 0 ? '+' : '' }}{{ item.score }}
                      </p>
                      <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Score</p>
                    </div>
                  </div>

                  <!-- Link -->
                  <a [routerLink]="['/competitions', item.slug]"
                     class="shrink-0 p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white transition-all active:scale-95 shadow-lg shadow-teal-600/20">
                    <lucide-icon [name]="ArrowRight" [size]="18"></lucide-icon>
                  </a>
                </div>
              }
            }
          </div>
        }

      </div>
    </div>
  `
})
export class CompetitionsComponent implements OnInit {
    data = inject(DataService);

    readonly Trophy = Trophy;
    readonly Calendar = Calendar;
    readonly ArrowRight = ArrowRight;
    readonly Filter = Filter;
    readonly ThumbsUp = ThumbsUp;
    readonly ThumbsDown = ThumbsDown;
    readonly BarChart3 = BarChart3;

    activeTab = signal<Tab>('all');
    ranking = signal<CompetitionRanking[]>([]);
    rankingLoading = signal(false);

    ngOnInit() {}

    loadRanking() {
        this.activeTab.set('ranking');
        if (this.ranking().length > 0) return; // already loaded
        this.rankingLoading.set(true);
        this.data.getCompetitionRanking().subscribe(data => {
            this.ranking.set(data);
            this.rankingLoading.set(false);
        });
    }
}
