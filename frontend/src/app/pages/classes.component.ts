import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, Clock, Globe, Video, Calendar, Users,
  X, AlertTriangle, ChevronRight, Check, Zap, BookOpen, ExternalLink
} from 'lucide-angular';
import { DataService, PlatformClass } from '../services/data.service';

type JoinStep = 'form' | 'confirm' | 'success';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-background pb-24 pt-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        <!-- Header -->
        <div class="text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 class="text-5xl md:text-7xl font-black tracking-tight text-foreground">
            Weekly <span class="text-teal-600 underline underline-offset-8 decoration-4 italic">Live</span> Schedule
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive sessions led by world-class instructors. Practice, ask questions, and grow in real-time.
          </p>

          <!-- Day filter tabs -->
          <div class="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button (click)="filterDay.set('')"
                    [ngClass]="filterDay() === '' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-white border border-border text-muted-foreground hover:border-teal-600 hover:text-teal-600'"
                    class="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all">All</button>
            @for (d of days; track d) {
              <button (click)="filterDay.set(d)"
                      [ngClass]="filterDay() === d ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-white border border-border text-muted-foreground hover:border-teal-600 hover:text-teal-600'"
                      class="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all">{{ d.slice(0,3) }}</button>
            }
          </div>
        </div>

        <!-- Stats bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
          @for (s of statsRow(); track s.label) {
            <div class="bg-white rounded-3xl border border-border p-5 flex items-center gap-4 shadow-sm">
              <div [ngClass]="s.bg" class="w-11 h-11 rounded-2xl flex items-center justify-center">
                <lucide-icon [name]="s.icon" [size]="20" [ngClass]="s.color"></lucide-icon>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{{ s.label }}</p>
                <p class="text-2xl font-black">{{ s.value }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Class Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          @for (cls of filtered(); track cls.id) {
            <div class="group relative bg-white rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-teal-600/10 transition-all duration-500 hover:-translate-y-2 flex flex-col">

              <!-- Status ribbon -->
              @if (cls.status === 'full') {
                <div class="absolute top-4 right-4 z-10 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Full</div>
              } @else if (cls.status === 'cancelled') {
                <div class="absolute top-4 right-4 z-10 bg-gray-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Cancelled</div>
              } @else if (enrolledFrac(cls) > 0.75) {
                <div class="absolute top-4 right-4 z-10 bg-orange-400 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Almost Full</div>
              } @else if (cls.recurring) {
                <div class="absolute top-4 right-4 z-10 bg-purple-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Weekly</div>
              }

              <div class="p-8 flex-1 space-y-6">
                <!-- Day & Time -->
                <div class="flex items-center justify-between">
                  <div class="px-4 py-2 rounded-2xl bg-teal-50 text-teal-600 text-sm font-black uppercase tracking-widest shadow-inner">{{ cls.day }}</div>
                  <div class="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <lucide-icon [name]="Clock" [size]="14"></lucide-icon>
                    {{ cls.time }}
                  </div>
                </div>

                <!-- Title & Instructor -->
                <div class="space-y-3">
                  <span class="text-[9px] font-black uppercase tracking-widest text-teal-600 bg-teal-100/60 px-2 py-0.5 rounded italic">{{ cls.type }}</span>
                  <h3 class="text-xl font-extrabold text-foreground group-hover:text-teal-600 transition-colors leading-tight">{{ cls.title }}</h3>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-teal-600/20">{{ cls.instructor.charAt(0) }}</div>
                    <span class="text-sm font-bold">with {{ cls.instructor }}</span>
                  </div>
                </div>

                <!-- Meta grid -->
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  <div>
                    <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Level</span>
                    <div class="flex items-center gap-1 mt-1 text-xs font-bold">
                      <lucide-icon [name]="Globe" [size]="13" class="text-teal-600"></lucide-icon>
                      {{ cls.level }}
                    </div>
                  </div>
                  <div>
                    <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Duration</span>
                    <div class="flex items-center gap-1 mt-1 text-xs font-bold">
                      <lucide-icon [name]="Clock" [size]="13" class="text-orange-500"></lucide-icon>
                      {{ cls.duration }}
                    </div>
                  </div>
                  <div>
                    <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Enrolled</span>
                    <div class="flex items-center gap-1 mt-1 text-xs font-bold">
                      <lucide-icon [name]="Users" [size]="13" class="text-purple-500"></lucide-icon>
                      {{ (cls.enrolled || []).length }}/{{ cls.maxCapacity ?? '∞' }}
                    </div>
                  </div>
                  @if ((cls.materials || []).length > 0) {
                    <div>
                      <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Materials</span>
                      <div class="flex items-center gap-1 mt-1 text-xs font-bold">
                        <lucide-icon [name]="BookOpen" [size]="13" class="text-blue-500"></lucide-icon>
                        {{ (cls.materials || []).length }} files
                      </div>
                    </div>
                  }
                </div>

                <!-- Capacity bar -->
                @if (cls.maxCapacity) {
                  <div class="space-y-1.5">
                    <div class="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Capacity</span>
                      <span>{{ Math.round(enrolledFrac(cls) * 100) }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700"
                           [ngClass]="enrolledFrac(cls) >= 1 ? 'bg-red-500' : enrolledFrac(cls) > 0.75 ? 'bg-orange-400' : 'bg-teal-600'"
                           [style.width.%]="Math.round(enrolledFrac(cls) * 100)"></div>
                    </div>
                  </div>
                }

                <!-- Notes preview -->
                @if (cls.notes) {
                  <p class="text-xs text-muted-foreground italic bg-muted/30 rounded-xl px-3 py-2 line-clamp-2">📌 {{ cls.notes }}</p>
                }
              </div>

              <!-- Action footer -->
              <div class="px-8 pb-8">
                @if (isAlreadyJoined(cls)) {
                  <div class="w-full py-3 bg-teal-50 border-2 border-teal-200 text-teal-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                    <lucide-icon [name]="Check" [size]="16"></lucide-icon> You're Enrolled!
                  </div>
                } @else if (cls.status === 'full' || cls.status === 'cancelled') {
                  <div class="w-full py-3 bg-muted border border-border text-muted-foreground rounded-2xl font-bold text-sm text-center">
                    {{ cls.status === 'full' ? 'Class Full' : 'Cancelled' }}
                  </div>
                } @else {
                  <button (click)="openJoinModal(cls)"
                          class="w-full py-4 bg-white border-2 border-teal-600 text-teal-600 group-hover:bg-teal-600 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg group-hover:shadow-teal-600/20 active:scale-95 overflow-hidden relative">
                    <span class="relative z-10 flex items-center gap-2">
                      <lucide-icon [name]="Zap" [size]="18"></lucide-icon>
                      Join Class
                    </span>
                    <div class="absolute inset-0 bg-teal-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                }
              </div>
            </div>
          } @empty {
            <div class="col-span-3 py-24 text-center bg-white rounded-3xl border-2 border-dashed border-border">
              <p class="text-muted-foreground font-bold text-lg">No classes scheduled for this day.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- ── JOIN CLASS MODAL ──────────────────────────────────────── -->
    @if (showModal() && targetClass()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="closeModal()"></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden">

          @if (joinStep() === 'form') {
            <div class="px-8 pt-8 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Step 1 of 2</p>
                <h2 class="text-xl font-extrabold">Enroll in Class</h2>
              </div>
              <button (click)="closeModal()" class="p-2 hover:bg-muted rounded-xl transition-all">
                <lucide-icon [name]="X" [size]="20"></lucide-icon>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <!-- Class preview -->
              <div class="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{{ targetClass()!.instructor.charAt(0) }}</div>
                <div class="min-w-0">
                  <p class="font-bold text-sm truncate">{{ targetClass()!.title }}</p>
                  <p class="text-xs text-teal-600 font-medium">{{ targetClass()!.day }} · {{ targetClass()!.time }} · {{ targetClass()!.level }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5">with {{ targetClass()!.instructor }}</p>
                </div>
              </div>

              @if (joinError()) {
                <div class="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
                  <lucide-icon [name]="AlertTriangle" [size]="16" class="shrink-0"></lucide-icon>
                  <p class="text-sm font-medium">{{ joinError() }}</p>
                </div>
              }

              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name *</label>
                <input [(ngModel)]="joinName" placeholder="e.g. James Okafor"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Email *</label>
                <input [(ngModel)]="joinEmail" type="email" placeholder="you@example.com"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Current Level</label>
                <select [(ngModel)]="joinLevel" class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                  <option value="">Select your level…</option>
                  @for (l of levels; track l) { <option [value]="l">{{ l }}</option> }
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Learning Goal (optional)</label>
                <textarea [(ngModel)]="joinGoal" rows="2" placeholder="What do you want to achieve in this class?"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none transition-all"></textarea>
              </div>

              <button (click)="goToJoinConfirm()" [disabled]="!joinName || !joinEmail"
                      class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2">
                Continue <lucide-icon [name]="ChevronRight" [size]="18"></lucide-icon>
              </button>
            </div>
          }

          @if (joinStep() === 'confirm') {
            <div class="px-8 pt-8 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Step 2 of 2</p>
                <h2 class="text-xl font-extrabold">Confirm Enrollment</h2>
              </div>
              <button (click)="closeModal()" class="p-2 hover:bg-muted rounded-xl transition-all">
                <lucide-icon [name]="X" [size]="20"></lucide-icon>
              </button>
            </div>
            <div class="p-8 space-y-5">
              <div class="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                @for (row of confirmRows(); track row.label) {
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">{{ row.label }}</span>
                    <span class="font-bold text-right ml-4">{{ row.value }}</span>
                  </div>
                }
              </div>

              @if (joinError()) {
                <div class="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
                  <lucide-icon [name]="AlertTriangle" [size]="16" class="shrink-0"></lucide-icon>
                  <p class="text-sm font-medium">{{ joinError() }}</p>
                </div>
              }

              <div class="flex gap-3">
                <button (click)="joinStep.set('form')" class="flex-1 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">← Edit</button>
                <button (click)="submitJoin()" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                  Confirm ✓
                </button>
              </div>
            </div>
          }

          @if (joinStep() === 'success') {
            <div class="p-10 text-center space-y-6">
              <div class="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-5xl animate-in zoom-in duration-500">🎓</div>
              <div class="space-y-2">
                <h2 class="text-2xl font-extrabold">You're Enrolled!</h2>
                <p class="text-muted-foreground">Welcome, <strong>{{ joinName }}</strong>! You've successfully joined <strong>{{ targetClass()!.title }}</strong>.</p>
              </div>
              <div class="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-sm text-teal-700 font-medium space-y-1.5">
                <p>📅 <strong>{{ targetClass()!.day }}</strong> at <strong>{{ targetClass()!.time }}</strong></p>
                <p>👨‍🏫 Instructor: <strong>{{ targetClass()!.instructor }}</strong></p>
                @if (targetClass()!.link) {
                  <a [href]="targetClass()!.link" target="_blank" class="flex items-center justify-center gap-1.5 mt-2 font-black underline text-teal-600 hover:text-teal-700 transition-colors">
                    <lucide-icon [name]="ExternalLink" [size]="13"></lucide-icon> Open Session Link
                  </a>
                }
              </div>
              <button (click)="closeModal()" class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all active:scale-95">
                Done 🚀
              </button>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class ClassesComponent implements OnInit {
  data = inject(DataService);

  readonly Clock = Clock; readonly Globe = Globe; readonly Video = Video;
  readonly Calendar = Calendar; readonly Users = Users; readonly X = X;
  readonly AlertTriangle = AlertTriangle; readonly ChevronRight = ChevronRight;
  readonly Check = Check; readonly Zap = Zap; readonly BookOpen = BookOpen;
  readonly ExternalLink = ExternalLink;
  readonly Math = Math;

  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly levels = ['A1', 'A2', 'A2/B1', 'B1', 'B2', 'C1', 'C2', 'All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  filterDay = signal('');
  showModal = signal(false);
  targetClass = signal<PlatformClass | null>(null);
  joinStep = signal<JoinStep>('form');
  joinError = signal<string | null>(null);

  joinName = '';
  joinEmail = '';
  joinLevel = '';
  joinGoal = '';

  /** Set of class IDs stored in localStorage */
  private joinedIds = new Set<string>();

  ngOnInit() {
    const stored = localStorage.getItem('joined_classes');
    if (stored) {
      try { JSON.parse(stored).forEach((id: string) => this.joinedIds.add(id)); } catch { }
    }
  }

  statsRow() {
    const all = this.data.classes();
    return [
      { label: 'Total Classes', value: all.length, bg: 'bg-teal-50', color: 'text-teal-600', icon: this.Video },
      { label: 'Instructors', value: new Set(all.map(c => c.instructor)).size, bg: 'bg-purple-50', color: 'text-purple-600', icon: this.Users },
      { label: 'Active', value: all.filter(c => c.status === 'active').length, bg: 'bg-teal-50', color: 'text-teal-600', icon: this.Check },
      { label: 'Days Per Week', value: new Set(all.map(c => c.day)).size, bg: 'bg-orange-50', color: 'text-orange-500', icon: this.Calendar },
    ];
  }

  filtered() {
    const day = this.filterDay();
    return day ? this.data.classes().filter(c => c.day === day) : this.data.classes();
  }

  enrolledFrac(cls: PlatformClass): number {
    if (!cls.maxCapacity) return 0;
    return Math.min(1, (cls.enrolled?.length ?? 0) / cls.maxCapacity);
  }

  isAlreadyJoined(cls: PlatformClass): boolean {
    return this.joinedIds.has(String(cls.id));
  }

  confirmRows() {
    const cls = this.targetClass();
    if (!cls) return [];
    const rows = [
      { label: 'Name', value: this.joinName },
      { label: 'Email', value: this.joinEmail },
      { label: 'Class', value: cls.title },
      { label: 'Instructor', value: cls.instructor },
      { label: 'Schedule', value: `${cls.day} · ${cls.time}` },
      { label: 'Level', value: cls.level },
    ];
    if (this.joinLevel) rows.push({ label: 'Your Level', value: this.joinLevel });
    return rows;
  }

  openJoinModal(cls: PlatformClass) {
    this.targetClass.set(cls);
    this.joinStep.set('form');
    this.joinError.set(null);
    this.joinName = '';
    this.joinEmail = '';
    this.joinLevel = '';
    this.joinGoal = '';
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  goToJoinConfirm() {
    if (!this.joinName.trim() || !this.joinEmail.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.joinEmail)) {
      this.joinError.set('Please enter a valid email address.');
      return;
    }
    this.joinError.set(null);
    this.joinStep.set('confirm');
  }

  submitJoin() {
    const cls = this.targetClass();
    if (!cls) return;
    const err = this.data.joinClass(cls.id, this.joinName.trim(), this.joinEmail.trim());
    if (err) { this.joinError.set(err); return; }

    // Persist joined state
    this.joinedIds.add(String(cls.id));
    localStorage.setItem('joined_classes', JSON.stringify([...this.joinedIds]));

    // Refresh the class card from the service
    const updated = this.data.classes().find(c => c.id === cls.id);
    if (updated) this.targetClass.set(updated);

    this.joinError.set(null);
    this.joinStep.set('success');
  }
}
