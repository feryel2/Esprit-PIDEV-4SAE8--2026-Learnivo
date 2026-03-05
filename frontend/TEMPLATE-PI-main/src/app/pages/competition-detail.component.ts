import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideAngularModule, Trophy, Calendar, ArrowRight, Users, Clock,
  CheckCircle2, Flag, Tag, X, AlertTriangle, ChevronRight, Star, Zap
} from 'lucide-angular';
import { DataService, Competition } from '../services/data.service';

type ModalStep = 'form' | 'confirm' | 'success';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    @if (comp()) {
      <div class="min-h-screen bg-background pb-24 pt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <!-- Back link -->
          <a routerLink="/competitions" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-teal-600 transition-colors group">
            <lucide-icon [name]="ArrowRight" [size]="16" class="rotate-180 group-hover:-translate-x-1 transition-transform"></lucide-icon>
            Back to Competitions
          </a>

          <!-- ── HERO ────────────────────────────────────────────────────── -->
          <div class="relative aspect-[21/7] rounded-3xl overflow-hidden shadow-2xl shadow-teal-600/10 border border-border">
            <img [src]="comp()!.image" [alt]="comp()!.title" class="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-end p-10">
              <div class="space-y-4 max-w-2xl">
                <div class="flex items-center gap-3 flex-wrap">
                  <span [ngClass]="{
                    'bg-teal-500': comp()!.status === 'ongoing',
                    'bg-orange-500': comp()!.status === 'upcoming',
                    'bg-gray-500': comp()!.status === 'completed'
                  }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">{{ comp()!.status }}</span>
                  <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-white">{{ comp()!.category }}</span>
                  @for (tag of (comp()!.tags || []); track tag) {
                    <span class="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-[9px] font-bold text-white/80">#{{ tag }}</span>
                  }
                </div>
                <h1 class="text-4xl md:text-5xl font-black text-white leading-tight">{{ comp()!.title }}</h1>
                <p class="text-white/80 text-lg font-medium">🏆 {{ comp()!.prize }}</p>
              </div>
            </div>
          </div>

          <!-- ── MAIN GRID ────────────────────────────────────────────────── -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">

            <!-- Left: Content -->
            <div class="lg:col-span-2 space-y-10">

              <!-- Description -->
              <div class="bg-white rounded-3xl border border-border p-8 space-y-4 shadow-sm">
                <h2 class="text-2xl font-extrabold">About This Competition</h2>
                <p class="text-muted-foreground leading-relaxed text-lg italic border-l-4 border-teal-600 pl-6">"{{ comp()!.description }}"</p>
              </div>

              <!-- Rounds Timeline -->
              @if ((comp()!.rounds || []).length > 0) {
                <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-6">
                  <h2 class="text-2xl font-extrabold flex items-center gap-3">
                    <lucide-icon [name]="Flag" [size]="22" class="text-teal-600"></lucide-icon>
                    Competition Rounds
                  </h2>
                  <div class="space-y-4">
                    @for (round of (comp()!.rounds || []); track round.name; let i = $index; let last = $last) {
                      <div class="flex gap-5">
                        <div class="flex flex-col items-center">
                          <div [ngClass]="{
                            'bg-teal-600 text-white shadow-lg shadow-teal-600/30': round.status === 'active',
                            'bg-blue-600 text-white': round.status === 'done',
                            'bg-muted text-muted-foreground': round.status === 'pending'
                          }" class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-all">
                            {{ round.status === 'done' ? '✓' : (i + 1) }}
                          </div>
                          @if (!last) {
                            <div class="w-0.5 flex-1 bg-border mt-2 mb-2 min-h-[24px]"></div>
                          }
                        </div>
                        <div class="pb-6 flex-1">
                          <div class="flex items-center justify-between">
                            <p class="font-bold text-foreground">{{ round.name }}</p>
                            <span [ngClass]="{
                              'text-teal-600 bg-teal-50': round.status === 'active',
                              'text-blue-600 bg-blue-50': round.status === 'done',
                              'text-muted-foreground bg-muted': round.status === 'pending'
                            }" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{{ round.status }}</span>
                          </div>
                          <p class="text-sm text-muted-foreground mt-1">{{ round.startDate }} → {{ round.endDate }}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Rules -->
              @if (comp()!.rules) {
                <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-4">
                  <h2 class="text-2xl font-extrabold">Rules & Guidelines</h2>
                  <div class="space-y-3">
                    @for (rule of getRules(); track rule; let i = $index) {
                      <div class="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                        <div class="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm shadow-teal-600/20">{{ i + 1 }}</div>
                        <p class="text-sm font-medium text-foreground leading-relaxed">{{ rule }}</p>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Leaderboard (if results published) -->
              @if (comp()!.resultsPublished && (comp()!.participants || []).length > 0) {
                <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-6">
                  <h2 class="text-2xl font-extrabold flex items-center gap-3">
                    <lucide-icon [name]="Star" [size]="22" class="text-yellow-500"></lucide-icon>
                    Leaderboard
                  </h2>
                  <div class="space-y-3">
                    @for (p of getSortedParticipants(); track p.id; let i = $index) {
                      <div class="flex items-center gap-4 p-4 rounded-2xl"
                           [ngClass]="i === 0 ? 'bg-yellow-50 border border-yellow-200' : i === 1 ? 'bg-gray-50 border border-gray-200' : i === 2 ? 'bg-orange-50 border border-orange-200' : 'border border-border'">
                        <span class="text-xl w-8 text-center">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1) }}</span>
                        <div class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{{ p.name.charAt(0) }}</div>
                        <div class="flex-1">
                          <p class="font-bold text-sm">{{ p.name }}</p>
                          <p class="text-xs text-muted-foreground capitalize">{{ p.status }}</p>
                        </div>
                        @if (p.score !== undefined) {
                          <span class="font-black text-teal-600 text-sm">{{ p.score }} pts</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Right: Sticky Sidebar -->
            <div class="space-y-6">
              <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-6 sticky top-32">

                <!-- Countdown -->
                @if (comp()!.status !== 'completed') {
                  <div class="p-5 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white space-y-2 text-center">
                    <p class="text-[10px] font-black uppercase tracking-widest opacity-80">Registration Closes In</p>
                    <div class="grid grid-cols-4 gap-2">
                      @for (unit of countdown(); track unit.label) {
                        <div class="flex flex-col items-center">
                          <span class="text-2xl font-black leading-none">{{ unit.value }}</span>
                          <span class="text-[9px] uppercase tracking-widest opacity-70 mt-1">{{ unit.label }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 rounded-2xl bg-muted/40 text-center space-y-1">
                    <p class="text-2xl font-black text-teal-600">{{ (comp()!.participants || []).length }}</p>
                    <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registered</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-muted/40 text-center space-y-1">
                    <p class="text-2xl font-black text-teal-600">{{ spotsLeft() }}</p>
                    <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Spots Left</p>
                  </div>
                </div>

                <!-- Capacity bar -->
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Capacity</span>
                    <span>{{ capacityPct() }}%</span>
                  </div>
                  <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700"
                         [ngClass]="capacityPct() >= 100 ? 'bg-red-500' : capacityPct() > 75 ? 'bg-orange-400' : 'bg-teal-600'"
                         [style.width.%]="capacityPct()"></div>
                  </div>
                </div>

                <!-- Info cards -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <lucide-icon [name]="Trophy" [size]="18" class="text-teal-600 shrink-0"></lucide-icon>
                    <div>
                      <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Grand Prize</p>
                      <p class="font-bold text-sm">{{ comp()!.prize }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <lucide-icon [name]="Calendar" [size]="18" class="text-orange-500 shrink-0"></lucide-icon>
                    <div>
                      <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Deadline</p>
                      <p class="font-bold text-sm">{{ comp()!.deadline }}</p>
                    </div>
                  </div>
                </div>

                <!-- Register CTA -->
                @if (alreadyRegistered()) {
                  <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                    <p class="text-2xl">✅</p>
                    <p class="font-black text-teal-700 text-sm">You're Registered!</p>
                    <p class="text-xs text-teal-600">Good luck in the competition.</p>
                  </div>
                } @else if (comp()!.status === 'completed') {
                  <div class="p-4 rounded-2xl bg-muted text-center space-y-1">
                    <p class="font-bold text-muted-foreground text-sm">Competition Ended</p>
                  </div>
                } @else {
                  <button (click)="openModal()"
                          class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95 group">
                    <lucide-icon [name]="Zap" [size]="20" class="group-hover:animate-bounce"></lucide-icon>
                    Register Now
                  </button>
                  <p class="text-center text-xs text-muted-foreground italic">Free to enter · {{ spotsLeft() }} spots remaining</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-pulse text-teal-600 font-bold text-lg">Loading...</div>
      </div>
    }

    <!-- ── REGISTRATION MODAL ──────────────────────────────────────────────── -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="closeModal()"></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden">

          @if (step() === 'form') {
            <!-- Step 1: Form -->
            <div class="px-8 pt-8 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Step 1 of 2</p>
                <h2 class="text-xl font-extrabold">Your Information</h2>
              </div>
              <button (click)="closeModal()" class="p-2 hover:bg-muted rounded-xl transition-all">
                <lucide-icon [name]="X" [size]="20"></lucide-icon>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <div class="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center gap-3">
                <lucide-icon [name]="Trophy" [size]="18" class="text-teal-600 shrink-0"></lucide-icon>
                <div>
                  <p class="font-bold text-sm line-clamp-1">{{ comp()!.title }}</p>
                  <p class="text-xs text-teal-600 font-medium">Prize: {{ comp()!.prize }}</p>
                </div>
              </div>

              @if (formError()) {
                <div class="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
                  <lucide-icon [name]="AlertTriangle" [size]="16" class="shrink-0"></lucide-icon>
                  <p class="text-sm font-medium">{{ formError() }}</p>
                </div>
              }

              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name *</label>
                <input [(ngModel)]="regName" placeholder="e.g. Sarah Al-Amin"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address *</label>
                <input [(ngModel)]="regEmail" type="email" placeholder="you@example.com"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone (optional)</label>
                <input [(ngModel)]="regPhone" placeholder="+213 555 000 000"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Why do you want to join?</label>
                <textarea [(ngModel)]="regMotivation" rows="3" placeholder="Tell us about your background and motivation..."
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none transition-all"></textarea>
              </div>

              <button (click)="goToConfirm()" [disabled]="!regName || !regEmail"
                      class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2">
                Continue <lucide-icon [name]="ChevronRight" [size]="18"></lucide-icon>
              </button>
            </div>
          }

          @if (step() === 'confirm') {
            <!-- Step 2: Confirm -->
            <div class="px-8 pt-8 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Step 2 of 2</p>
                <h2 class="text-xl font-extrabold">Confirm Registration</h2>
              </div>
              <button (click)="closeModal()" class="p-2 hover:bg-muted rounded-xl transition-all">
                <lucide-icon [name]="X" [size]="20"></lucide-icon>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <div class="space-y-3">
                <div class="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Name</span>
                    <span class="font-bold">{{ regName }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Email</span>
                    <span class="font-bold">{{ regEmail }}</span>
                  </div>
                  @if (regPhone) {
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground font-medium">Phone</span>
                      <span class="font-bold">{{ regPhone }}</span>
                    </div>
                  }
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Competition</span>
                    <span class="font-bold text-right max-w-[60%] leading-tight">{{ comp()!.title }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Deadline</span>
                    <span class="font-bold">{{ comp()!.deadline }}</span>
                  </div>
                </div>
                <p class="text-xs text-muted-foreground text-center">By confirming, you agree to the competition rules and terms.</p>
              </div>

              @if (formError()) {
                <div class="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
                  <lucide-icon [name]="AlertTriangle" [size]="16" class="shrink-0"></lucide-icon>
                  <p class="text-sm font-medium">{{ formError() }}</p>
                </div>
              }

              <div class="flex gap-3">
                <button (click)="step.set('form')" class="flex-1 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">← Edit</button>
                <button (click)="submitRegistration()" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                  Confirm ✓
                </button>
              </div>
            </div>
          }

          @if (step() === 'success') {
            <!-- Step 3: Success -->
            <div class="p-10 text-center space-y-6">
              <div class="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-5xl animate-in zoom-in duration-500">🎉</div>
              <div class="space-y-2">
                <h2 class="text-2xl font-extrabold text-foreground">You're In!</h2>
                <p class="text-muted-foreground">Welcome, <strong>{{ regName }}</strong>! Your registration for <strong>{{ comp()!.title }}</strong> is confirmed.</p>
              </div>
              <div class="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-sm text-teal-700 font-medium space-y-1">
                <p>🏆 You're competing for: <strong>{{ comp()!.prize }}</strong></p>
                <p>📅 Deadline: <strong>{{ comp()!.deadline }}</strong></p>
                <p>📧 A confirmation will be sent to <strong>{{ regEmail }}</strong></p>
              </div>
              <button (click)="closeModal()" class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all active:scale-95">
                Done — Good Luck! 🚀
              </button>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class CompetitionDetailComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  readonly Trophy = Trophy; readonly Calendar = Calendar; readonly ArrowRight = ArrowRight;
  readonly Users = Users; readonly Clock = Clock; readonly CheckCircle2 = CheckCircle2;
  readonly Flag = Flag; readonly Tag = Tag; readonly X = X; readonly AlertTriangle = AlertTriangle;
  readonly ChevronRight = ChevronRight; readonly Star = Star; readonly Zap = Zap;

  comp = signal<Competition | null>(null);
  showModal = signal(false);
  step = signal<ModalStep>('form');
  formError = signal<string | null>(null);
  alreadyRegistered = signal(false);

  // Form fields
  regName = '';
  regEmail = '';
  regPhone = '';
  regMotivation = '';

  // Countdown
  countdown = signal<{ label: string; value: string }[]>([]);
  private countdownInterval?: ReturnType<typeof setInterval>;

  spotsLeft = computed(() => {
    const c = this.comp();
    if (!c) return 0;
    return Math.max(0, (c.maxParticipants ?? 0) - (c.participants?.length ?? 0));
  });

  capacityPct = computed(() => {
    const c = this.comp();
    if (!c || !c.maxParticipants) return 0;
    return Math.min(100, Math.round(((c.participants?.length ?? 0) / c.maxParticipants) * 100));
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const found = this.dataService.competitions().find(c => c.slug === slug);
      const comp = found ?? this.dataService.competitions()[0];
      this.comp.set(comp ?? null);
      if (comp) {
        this.startCountdown(comp.deadline);
        const key = `reg_comp_${comp.id}`;
        this.alreadyRegistered.set(localStorage.getItem(key) === 'true');
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  private startCountdown(deadlineStr: string) {
    clearInterval(this.countdownInterval);
    const tick = () => {
      const target = new Date(deadlineStr).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0 || isNaN(diff)) {
        this.countdown.set([
          { label: 'Days', value: '00' }, { label: 'Hrs', value: '00' },
          { label: 'Min', value: '00' }, { label: 'Sec', value: '00' }
        ]);
        return;
      }
      const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
      this.countdown.set([
        { label: 'Days', value: pad(diff / 86400000) },
        { label: 'Hrs', value: pad((diff % 86400000) / 3600000) },
        { label: 'Min', value: pad((diff % 3600000) / 60000) },
        { label: 'Sec', value: pad((diff % 60000) / 1000) }
      ]);
    };
    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  getRules(): string[] {
    return (this.comp()?.rules ?? '').split('\n').map(r => r.replace(/^\d+\.\s*/, '').trim()).filter(r => !!r);
  }

  getSortedParticipants() {
    return [...(this.comp()?.participants ?? [])]
      .filter(p => p.status !== 'disqualified')
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  }

  openModal() { this.step.set('form'); this.formError.set(null); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  goToConfirm() {
    if (!this.regName.trim() || !this.regEmail.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.regEmail)) {
      this.formError.set('Please enter a valid email address.');
      return;
    }
    this.formError.set(null);
    this.step.set('confirm');
  }

  submitRegistration() {
    const comp = this.comp();
    if (!comp) return;
    const err = this.dataService.registerForCompetition(comp.id, this.regName.trim(), this.regEmail.trim());
    if (err) {
      this.formError.set(err);
      return;
    }
    // Refresh comp from service
    const updated = this.dataService.competitions().find(c => c.id === comp.id);
    if (updated) this.comp.set(updated);
    // Persist registration state in localStorage
    localStorage.setItem(`reg_comp_${comp.id}`, 'true');
    this.alreadyRegistered.set(true);
    this.step.set('success');
    this.formError.set(null);
  }
}
