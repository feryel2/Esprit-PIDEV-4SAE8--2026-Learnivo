import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Competition, Participant, CompetitionRound } from '../../services/data.service';
import {
  LucideAngularModule, Trophy, Plus, Calendar, Search, Pencil, Trash2, X,
  CheckCircle2, Clock, AlertTriangle, Users, ListChecks, BookOpen, Tag,
  ChevronDown, ChevronUp, Medal, Star, Flag
} from 'lucide-angular';

const EMPTY_COMP = (): Omit<Competition, 'id'> => ({
  title: '', description: '', image: '/images/event-1.jpg', slug: '',
  status: 'upcoming', deadline: '', prize: '', category: '',
  tags: [], maxParticipants: 50, participants: [], rounds: [],
  rules: '', resultsPublished: false
});

@Component({
  selector: 'app-admin-competitions',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold">Competition <span class="text-teal-600 underline decoration-2 underline-offset-4">Manager</span></h1>
          <p class="text-muted-foreground mt-1">Full lifecycle management: participants, rounds, leaderboard.</p>
        </div>
        <button (click)="openCreate()" class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          New Competition
        </button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white rounded-3xl border border-border p-5 flex items-center gap-4 hover:border-teal-600/30 transition-colors">
            <div [ngClass]="stat.bg" class="w-11 h-11 rounded-2xl flex items-center justify-center">
              <lucide-icon [name]="stat.icon" [size]="20" [ngClass]="stat.color"></lucide-icon>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{{ stat.label }}</p>
              <p class="text-2xl font-black">{{ stat.value }}</p>
            </div>
          </div>
        }
      </div>

      <!-- List / Detail split -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left: Competition list -->
        <div class="lg:col-span-1 space-y-4">
          <div class="relative">
            <lucide-icon [name]="Search" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
            <input [(ngModel)]="searchQuery" type="text" placeholder="Search…"
                   class="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-border font-medium focus:ring-2 focus:ring-teal-600/20 outline-none text-sm">
          </div>

          <div class="space-y-3">
            @for (comp of filtered(); track comp.id) {
              <div (click)="select(comp)"
                   [ngClass]="selected()?.id === comp.id ? 'border-teal-600 bg-teal-50/50 shadow-md shadow-teal-600/10' : 'border-border hover:border-teal-600/40'"
                   class="bg-white rounded-2xl border p-4 cursor-pointer transition-all group">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm truncate group-hover:text-teal-600 transition-colors">{{ comp.title }}</p>
                    <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span [ngClass]="{
                        'bg-teal-600/10 text-teal-600': comp.status === 'ongoing',
                        'bg-orange-500/10 text-orange-600': comp.status === 'upcoming',
                        'bg-muted text-muted-foreground': comp.status === 'completed'
                      }" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">{{ comp.status }}</span>
                      <span class="text-[10px] text-muted-foreground font-medium">{{ (comp.participants || []).length }}/{{ comp.maxParticipants }} entries</span>
                    </div>
                  </div>
                  <div class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="openEdit(comp); $event.stopPropagation()" class="p-1.5 hover:bg-teal-100 hover:text-teal-700 rounded-lg transition-all">
                      <lucide-icon [name]="Pencil" [size]="13"></lucide-icon>
                    </button>
                    <button (click)="confirmDelete(comp); $event.stopPropagation()" class="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all">
                      <lucide-icon [name]="Trash2" [size]="13"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <p class="text-center text-muted-foreground py-8 font-medium text-sm">No competitions found.</p>
            }
          </div>
        </div>

        <!-- Right: Detail Panel -->
        <div class="lg:col-span-2">
          @if (selected()) {
            <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">

              <!-- Banner -->
              <div class="relative h-40 overflow-hidden">
                <img [src]="selected()!.image" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <h2 class="text-lg font-extrabold text-white leading-tight line-clamp-2">{{ selected()!.title }}</h2>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      @for (tag of (selected()!.tags || []); track tag) {
                        <span class="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[9px] font-bold text-white">#{{ tag }}</span>
                      }
                    </div>
                  </div>
                   <span class="text-lg font-black text-teal-400">{{ selected()!.prize }}</span>
                </div>
              </div>

              <!-- Tabs -->
              <div class="border-b border-border">
                <div class="flex overflow-x-auto">
                  @for (tab of tabs; track tab) {
                    <button (click)="activeTab.set(tab)"
                            [ngClass]="activeTab() === tab ? 'border-b-2 border-teal-600 text-teal-600 font-bold' : 'text-muted-foreground hover:text-foreground'"
                            class="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors">{{ tab }}</button>
                  }
                </div>
              </div>

              <!-- Tab: Overview -->
              @if (activeTab() === 'Overview') {
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline</p>
                      <p class="font-bold">{{ selected()!.deadline }}</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</p>
                      <p class="font-bold">{{ selected()!.category }}</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registrations</p>
                      <p class="font-bold">{{ (selected()!.participants || []).length }} / {{ selected()!.maxParticipants }}</p>
                      <div class="w-full bg-muted rounded-full h-1.5 mt-2">
                        <div class="bg-teal-600 h-1.5 rounded-full transition-all"
                             [style.width.%]="((selected()!.participants || []).length / (selected()!.maxParticipants || 1)) * 100"></div>
                      </div>
                    </div>
                    <div class="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Results</p>
                      <div class="flex items-center gap-2">
                        <div [ngClass]="selected()!.resultsPublished ? 'bg-teal-500' : 'bg-muted-foreground'" class="w-2 h-2 rounded-full"></div>
                        <p class="font-bold text-sm">{{ selected()!.resultsPublished ? 'Published' : 'Not published' }}</p>
                      </div>
                      <button (click)="toggleResults()" class="text-xs font-bold text-teal-600 hover:underline mt-1">
                        {{ selected()!.resultsPublished ? 'Unpublish' : 'Publish Results' }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground leading-relaxed">{{ selected()!.description }}</p>
                  </div>
                </div>
              }

              <!-- Tab: Participants -->
              @if (activeTab() === 'Participants') {
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between mb-2">
                    <p class="font-bold text-sm text-muted-foreground">{{ (selected()!.participants || []).length }} registered</p>
                    <button (click)="openAddParticipant()" class="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                      <lucide-icon [name]="Plus" [size]="14"></lucide-icon> Add manually
                    </button>
                  </div>
                  @for (p of (selected()!.participants || []); track p.id) {
                    <div class="flex items-center gap-4 p-4 rounded-2xl border border-border hover:bg-muted/20 transition-all group">
                      <div class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{{ p.name.charAt(0) }}</div>
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-sm truncate">{{ p.name }}</p>
                        <p class="text-xs text-muted-foreground">{{ p.email }}</p>
                      </div>
                      @if (p.score !== undefined) {
                        <span class="font-black text-teal-600 text-sm">{{ p.score }} pts</span>
                      }
                      <select [value]="p.status" (change)="updateParticipantStatus(p, $any($event.target).value)"
                              class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border bg-white outline-none cursor-pointer"
                              [ngClass]="{
                                'text-teal-600': p.status === 'registered',
                                'text-yellow-600': p.status === 'winner',
                                'text-red-500': p.status === 'disqualified'
                              }">
                        <option value="registered">Registered</option>
                        <option value="winner">Winner</option>
                        <option value="disqualified">Disqualified</option>
                      </select>
                      <button (click)="removeParticipant(p.id)" class="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <lucide-icon [name]="Trash2" [size]="13"></lucide-icon>
                      </button>
                    </div>
                  } @empty {
                    <p class="text-center text-muted-foreground py-8 font-medium text-sm">No participants yet.</p>
                  }
                </div>
              }

              <!-- Tab: Leaderboard -->
              @if (activeTab() === 'Leaderboard') {
                <div class="p-6 space-y-3">
                  @for (p of leaderboard(); track p.id; let i = $index) {
                    <div class="flex items-center gap-4 p-4 rounded-2xl"
                         [ngClass]="i === 0 ? 'bg-yellow-50 border border-yellow-200' : i === 1 ? 'bg-gray-50 border border-gray-200' : i === 2 ? 'bg-orange-50 border border-orange-200' : 'border border-border'">
                      <div class="w-8 text-center font-black text-lg"
                           [ngClass]="i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'">
                        {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1) }}
                      </div>
                      <div class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0">{{ p.name.charAt(0) }}</div>
                      <div class="flex-1">
                        <p class="font-bold text-sm">{{ p.name }}</p>
                        <p class="text-xs text-muted-foreground">{{ p.email }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-black text-teal-600">{{ p.score ?? '—' }} pts</p>
                        <input type="number" [value]="p.score ?? ''" (change)="setScore(p, $any($event.target).value)"
                               placeholder="Score" class="text-xs w-16 px-2 py-1 rounded-lg border border-border text-center font-medium outline-none focus:ring-2 focus:ring-teal-600/20 mt-1">
                      </div>
                    </div>
                  } @empty {
                    <p class="text-center text-muted-foreground py-8 text-sm">No scored participants yet.</p>
                  }
                </div>
              }

              <!-- Tab: Rounds -->
              @if (activeTab() === 'Rounds') {
                <div class="p-6 space-y-4">
                  <button (click)="addRound()" class="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                    <lucide-icon [name]="Plus" [size]="14"></lucide-icon> Add Round
                  </button>
                  @for (round of (selected()!.rounds || []); track round.name; let i = $index) {
                    <div class="p-5 rounded-2xl border border-border space-y-3">
                      <div class="flex items-center justify-between">
                        <input [(ngModel)]="round.name" (change)="saveRounds()" placeholder="Round name"
                               class="font-bold text-sm bg-transparent outline-none flex-1 focus:bg-muted/30 rounded-lg px-2 py-1 transition-all">
                        <div class="flex items-center gap-2">
                          <select [(ngModel)]="round.status" (change)="saveRounds()"
                                  class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-border bg-white outline-none"
                                  [ngClass]="{
                                    'text-teal-600': round.status === 'active',
                                    'text-muted-foreground': round.status === 'pending',
                                    'text-blue-600': round.status === 'done'
                                  }">
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="done">Done</option>
                          </select>
                          <button (click)="removeRound(i)" class="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all">
                            <lucide-icon [name]="Trash2" [size]="13"></lucide-icon>
                          </button>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                          <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Start</label>
                          <input [(ngModel)]="round.startDate" (change)="saveRounds()" placeholder="e.g. Sep 1, 2025"
                                 class="w-full text-sm px-3 py-2 rounded-xl border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-teal-600/20">
                        </div>
                        <div class="space-y-1">
                          <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">End</label>
                          <input [(ngModel)]="round.endDate" (change)="saveRounds()" placeholder="e.g. Oct 15, 2025"
                                 class="w-full text-sm px-3 py-2 rounded-xl border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-teal-600/20">
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-center text-muted-foreground py-8 text-sm">No rounds defined yet.</p>
                  }
                </div>
              }

              <!-- Tab: Rules -->
              @if (activeTab() === 'Rules') {
                <div class="p-6 space-y-4">
                  <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Competition Rules</label>
                  <textarea [(ngModel)]="rulesText" rows="10" placeholder="Enter competition rules, one per line…"
                            class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/20 font-medium text-sm focus:ring-2 focus:ring-teal-600/20 outline-none resize-none leading-relaxed"></textarea>
                  <button (click)="saveRules()" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                    Save Rules
                  </button>
                </div>
              }

            </div>
          } @else {
            <div class="h-80 bg-white rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <lucide-icon [name]="Trophy" [size]="40" class="opacity-20"></lucide-icon>
              <p class="font-bold">Select a competition to manage it</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Add Participant Modal -->
    @if (showParticipantModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showParticipantModal.set(false)"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-5 border border-border">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">Add Participant</h3>
            <button (click)="showParticipantModal.set(false)" class="p-2 hover:bg-muted rounded-xl transition-all">
              <lucide-icon [name]="X" [size]="18"></lucide-icon>
            </button>
          </div>
          <div class="space-y-3">
            <input [(ngModel)]="newParticipantName" placeholder="Full name *"
                   class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
            <input [(ngModel)]="newParticipantEmail" placeholder="Email address *"
                   class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
          </div>
          <div class="flex gap-3">
            <button (click)="addParticipant()" [disabled]="!newParticipantName || !newParticipantEmail"
                    class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all active:scale-95">
              Add
            </button>
            <button (click)="showParticipantModal.set(false)" class="px-5 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      </div>
    }

    <!-- Create / Edit Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-border overflow-hidden">
          <div class="flex items-center justify-between px-8 pt-8 pb-4 border-b border-border">
            <h2 class="text-xl font-bold">{{ isEditing() ? 'Edit Competition' : 'New Competition' }}</h2>
            <button (click)="closeModal()" class="p-2 rounded-xl hover:bg-muted"><lucide-icon [name]="X" [size]="20"></lucide-icon></button>
          </div>
          <form (ngSubmit)="save()" class="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Title *</label>
              <input [(ngModel)]="form.title" name="title" required placeholder="Competition name"
                     class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Description *</label>
              <textarea [(ngModel)]="form.description" name="description" required rows="2" placeholder="Brief description…"
                        class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Category *</label>
                <input [(ngModel)]="form.category" name="category" required placeholder="e.g. Speaking"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Status *</label>
                <select [(ngModel)]="form.status" name="status"
                        class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Prize *</label>
                <input [(ngModel)]="form.prize" name="prize" required placeholder="e.g. $5,000"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Deadline *</label>
                <input [(ngModel)]="form.deadline" name="deadline" required placeholder="e.g. Oct 15, 2025"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Max Participants</label>
                <input [(ngModel)]="form.maxParticipants" name="maxParticipants" type="number" placeholder="100"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Tags (comma-sep)</label>
                <input [ngModel]="(form.tags || []).join(', ')" (ngModelChange)="onTagsChange($event)" name="tags"
                       placeholder="speaking, fluency"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none">
              </div>
            </div>
            <div class="flex gap-3 pt-4 border-t border-border">
              <button type="submit" [disabled]="!form.title || !form.prize || !form.deadline"
                      class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                {{ isEditing() ? 'Save Changes' : 'Create' }}
              </button>
              <button type="button" (click)="closeModal()" class="px-6 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirm -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="deleteTarget.set(null)"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 border border-border text-center">
          <div class="w-14 h-14 rounded-3xl bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <lucide-icon [name]="AlertTriangle" [size]="26"></lucide-icon>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-2">Delete Competition?</h3>
            <p class="text-muted-foreground text-sm">"<strong>{{ deleteTarget()!.title }}</strong>" will be permanently removed.</p>
          </div>
          <div class="flex gap-3">
            <button (click)="doDelete()" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all active:scale-95">Delete</button>
            <button (click)="deleteTarget.set(null)" class="flex-1 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminCompetitionsComponent {
  data = inject(DataService);

  readonly Trophy = Trophy; readonly Plus = Plus; readonly Calendar = Calendar;
  readonly Search = Search; readonly Pencil = Pencil; readonly Trash2 = Trash2;
  readonly X = X; readonly CheckCircle2 = CheckCircle2; readonly Clock = Clock;
  readonly AlertTriangle = AlertTriangle; readonly Users = Users;
  readonly ListChecks = ListChecks; readonly BookOpen = BookOpen; readonly Tag = Tag;
  readonly ChevronDown = ChevronDown; readonly ChevronUp = ChevronUp;
  readonly Medal = Medal; readonly Star = Star; readonly Flag = Flag;

  tabs = ['Overview', 'Participants', 'Leaderboard', 'Rounds', 'Rules'];
  activeTab = signal('Overview');
  selected = signal<Competition | null>(null);
  searchQuery = '';
  showModal = signal(false);
  isEditing = signal(false);
  editId = signal<number | string | null>(null);
  deleteTarget = signal<Competition | null>(null);
  showParticipantModal = signal(false);
  newParticipantName = '';
  newParticipantEmail = '';
  rulesText = '';
  form: Omit<Competition, 'id'> = EMPTY_COMP();

  stats = computed(() => {
    const all = this.data.competitions();
    const totalP = all.reduce((s, c) => s + (c.participants?.length ?? 0), 0);
    return [
      { label: 'Total', value: all.length, bg: 'bg-teal-50', color: 'text-teal-600', icon: this.Trophy },
      { label: 'Ongoing', value: all.filter(c => c.status === 'ongoing').length, bg: 'bg-teal-50', color: 'text-teal-600', icon: this.CheckCircle2 },
      { label: 'Upcoming', value: all.filter(c => c.status === 'upcoming').length, bg: 'bg-orange-50', color: 'text-orange-500', icon: this.Clock },
      { label: 'Participants', value: totalP, bg: 'bg-purple-50', color: 'text-purple-600', icon: this.Users },
    ];
  });

  leaderboard = computed(() => {
    const participants = this.selected()?.participants ?? [];
    return [...participants]
      .filter(p => p.status !== 'disqualified')
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  });

  filtered() {
    const q = this.searchQuery.toLowerCase();
    return q
      ? this.data.competitions().filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      : this.data.competitions();
  }

  select(comp: Competition) {
    this.selected.set(comp);
    this.activeTab.set('Overview');
    this.rulesText = comp.rules ?? '';
  }

  openCreate() {
    this.form = EMPTY_COMP();
    this.isEditing.set(false);
    this.editId.set(null);
    this.showModal.set(true);
  }

  openEdit(comp: Competition) {
    const { id, ...rest } = comp;
    this.form = { ...rest, tags: [...(rest.tags ?? [])], participants: [...(rest.participants ?? [])], rounds: [...(rest.rounds ?? [])] };
    this.editId.set(id);
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  onTagsChange(value: string) {
    this.form.tags = value.split(',').map(t => t.trim()).filter(t => !!t);
  }

  save() {
    if (!this.form.title || !this.form.prize || !this.form.deadline) return;
    if (!this.form.slug) {
      this.form.slug = this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (this.isEditing() && this.editId() !== null) {
      const updated = { id: this.editId()!, ...this.form };
      this.data.updateCompetition(updated);
      this.selected.set(updated);
    } else {
      const newComp: Competition = { id: Date.now(), ...this.form };
      this.data.addCompetition(newComp);
    }
    this.closeModal();
  }

  confirmDelete(comp: Competition) { this.deleteTarget.set(comp); }

  doDelete() {
    if (this.deleteTarget()) {
      if (this.selected()?.id === this.deleteTarget()!.id) this.selected.set(null);
      this.data.deleteCompetition(this.deleteTarget()!.id);
      this.deleteTarget.set(null);
    }
  }

  toggleResults() {
    if (!this.selected()) return;
    const updated = { ...this.selected()!, resultsPublished: !this.selected()!.resultsPublished };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  // ---------- Participants ----------
  openAddParticipant() {
    this.newParticipantName = '';
    this.newParticipantEmail = '';
    this.showParticipantModal.set(true);
  }

  addParticipant() {
    if (!this.selected() || !this.newParticipantName || !this.newParticipantEmail) return;
    const newP: Participant = {
      id: Date.now(), name: this.newParticipantName,
      email: this.newParticipantEmail,
      registeredAt: new Date().toISOString().slice(0, 10),
      status: 'registered'
    };
    const updated = { ...this.selected()!, participants: [...(this.selected()!.participants ?? []), newP] };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
    this.showParticipantModal.set(false);
  }

  updateParticipantStatus(p: Participant, status: Participant['status']) {
    if (!this.selected()) return;
    const participants = (this.selected()!.participants ?? []).map(x => x.id === p.id ? { ...x, status } : x);
    const updated = { ...this.selected()!, participants };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  removeParticipant(id: number | string) {
    if (!this.selected()) return;
    const participants = (this.selected()!.participants ?? []).filter(p => p.id !== id);
    const updated = { ...this.selected()!, participants };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  setScore(p: Participant, value: string) {
    const score = parseInt(value, 10);
    if (isNaN(score)) return;
    this.updateParticipantStatus({ ...p, score } as any, p.status);
    if (!this.selected()) return;
    const participants = (this.selected()!.participants ?? []).map(x => x.id === p.id ? { ...x, score } : x);
    const updated = { ...this.selected()!, participants };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  // ---------- Rounds ----------
  addRound() {
    if (!this.selected()) return;
    const rounds: CompetitionRound[] = [...(this.selected()!.rounds ?? []), { name: 'New Round', startDate: '', endDate: '', status: 'pending' }];
    const updated = { ...this.selected()!, rounds };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  removeRound(index: number) {
    if (!this.selected()) return;
    const rounds = (this.selected()!.rounds ?? []).filter((_, i) => i !== index);
    const updated = { ...this.selected()!, rounds };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }

  saveRounds() {
    if (!this.selected()) return;
    this.data.updateCompetition({ ...this.selected()! });
  }

  // ---------- Rules ----------
  saveRules() {
    if (!this.selected()) return;
    const updated = { ...this.selected()!, rules: this.rulesText };
    this.data.updateCompetition(updated);
    this.selected.set(updated);
  }
}
