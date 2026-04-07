import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideAngularModule, Trophy, Calendar, ArrowRight, Users, Clock,
  CheckCircle2, Flag, Tag, X, AlertTriangle, ChevronRight, Star, Zap,
  ThumbsUp, ThumbsDown
} from 'lucide-angular';
import { DataService, Competition, VoteStats, Announcement } from '../services/data.service';

type ModalStep = 'form' | 'confirm' | 'success';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    @if (comp()) {
      <div class="min-h-screen bg-background pb-24 pt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <!-- Back link + Share -->
          <div class="flex items-center justify-between flex-wrap gap-4">
            <a routerLink="/competitions" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-teal-600 transition-colors group">
              <lucide-icon [name]="ArrowRight" [size]="16" class="rotate-180 group-hover:-translate-x-1 transition-transform"></lucide-icon>
              Back to Competitions
            </a>

            <!-- Share buttons -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-black text-muted-foreground uppercase tracking-widest">Share</span>

              <button (click)="shareOn('whatsapp')" title="WhatsApp"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs transition-all active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.533 5.857L0 24l6.335-1.506A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.822 0-3.536-.49-5.01-1.346l-.36-.213-3.76.894.952-3.656-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </button>

              <button (click)="shareOn('linkedin')" title="LinkedIn"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-all active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>

              <button (click)="shareOn('twitter')" title="X / Twitter"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs transition-all active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </button>

              <button (click)="copyLink()"
                      [ngClass]="linkCopied() ? 'bg-teal-600 text-white' : 'bg-white border border-border text-foreground hover:bg-muted'"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all active:scale-95">
                {{ linkCopied() ? '✓ Copied!' : '🔗 Copy link' }}
              </button>
            </div>
          </div>

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

              <!-- ── VOTE SECTION ──────────────────────────────────────────── -->
              <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-5">
                <h2 class="text-2xl font-extrabold flex items-center gap-3">
                  <lucide-icon [name]="ThumbsUp" [size]="22" class="text-teal-600"></lucide-icon>
                  Participants' Reaction
                </h2>

                @if (!alreadyRegistered()) {
                  <!-- Non inscrit → lecture seule -->
                  <div class="p-4 rounded-2xl bg-muted/30 border border-border text-center space-y-2">
                    <p class="text-sm font-bold text-muted-foreground">🔒 Only registered participants can vote</p>
                    <p class="text-xs text-muted-foreground">Register for this competition to share your reaction.</p>
                  </div>
                }

                <!-- Stats (visibles par tous) + boutons (inscrits seulement) -->
                <div class="flex items-center gap-4">
                  <button (click)="castVote('LIKE')"
                          [disabled]="!alreadyRegistered() || isVoting()"
                          [ngClass]="voteStats()?.userVote === 'LIKE'
                            ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/25'
                            : 'bg-white border-border text-foreground hover:border-teal-400 hover:text-teal-600'"
                          class="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                    <lucide-icon [name]="ThumbsUp" [size]="18"></lucide-icon>
                    <span>{{ voteStats()?.likes ?? 0 }}</span>
                  </button>

                  <button (click)="castVote('DISLIKE')"
                          [disabled]="!alreadyRegistered() || isVoting()"
                          [ngClass]="voteStats()?.userVote === 'DISLIKE'
                            ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25'
                            : 'bg-white border-border text-foreground hover:border-red-400 hover:text-red-500'"
                          class="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                    <lucide-icon [name]="ThumbsDown" [size]="18"></lucide-icon>
                    <span>{{ voteStats()?.dislikes ?? 0 }}</span>
                  </button>

                  @if (voteStats()) {
                    <div class="ml-auto text-right">
                      <p class="text-2xl font-black"
                         [ngClass]="voteStats()!.score >= 0 ? 'text-teal-600' : 'text-red-500'">
                        {{ voteStats()!.score >= 0 ? '+' : '' }}{{ voteStats()!.score }}
                      </p>
                      <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Score</p>
                    </div>
                  }
                </div>

                @if (alreadyRegistered()) {
                  <p class="text-xs text-muted-foreground">
                    Voting as <strong>{{ regEmail }}</strong>
                  </p>
                }
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

              <!-- News Feed -->
              <div class="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-6">
                <h2 class="text-2xl font-extrabold flex items-center gap-3">
                  📢 News Feed
                  @if (announcements().length > 0) {
                    <span class="px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-black">{{ announcements().length }}</span>
                  }
                </h2>

                @if (announcements().length === 0) {
                  <div class="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                    <span class="text-4xl opacity-30">📭</span>
                    <p class="text-sm font-medium">No announcements yet. Check back soon!</p>
                  </div>
                }

                <div class="space-y-4">
                  @for (a of announcements(); track a.id) {
                    <div class="flex gap-4 p-5 rounded-2xl border"
                         [ngClass]="{
                           'bg-blue-50 border-blue-200':   a.type === 'INFO',
                           'bg-yellow-50 border-yellow-200': a.type === 'REMINDER',
                           'bg-teal-50 border-teal-200':   a.type === 'RESULT',
                           'bg-red-50 border-red-200':     a.type === 'ALERT'
                         }">
                      <span class="text-2xl shrink-0 mt-0.5">
                        {{ a.type === 'INFO' ? 'ℹ️' : a.type === 'REMINDER' ? '⏰' : a.type === 'RESULT' ? '🏆' : '🚨' }}
                      </span>
                      <div class="flex-1 space-y-1">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                          <p class="font-black text-sm">{{ a.title }}</p>
                          <span class="text-[10px] font-bold text-muted-foreground">{{ a.createdAt | date:'MMM d, y · HH:mm' }}</span>
                        </div>
                        <p class="text-sm text-foreground/80 leading-relaxed">{{ a.content }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

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
                  <div class="space-y-3">
                    <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                      <p class="text-2xl">✅</p>
                      <p class="font-black text-teal-700 text-sm">You're Registered!</p>
                      <p class="text-xs text-teal-600">Good luck in the competition.</p>
                    </div>
                    @if (comp()!.status !== 'completed') {
                      <button (click)="openSubmitModal()"
                              class="w-full py-3 border-2 border-teal-600 text-teal-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-50 transition-all active:scale-95">
                        📎 Submit My Project
                      </button>
                      @if (mySubmission()) {
                        <p class="text-[10px] text-teal-600 text-center font-bold">
                          ✓ Submitted · <a [href]="mySubmission()!.submissionUrl" target="_blank" class="underline">View link</a>
                        </p>
                      }
                    }
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

    <!-- ── SUBMISSION MODAL ───────────────────────────────────────────────── -->
    @if (showSubmitModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="showSubmitModal.set(false)"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
          <div class="px-8 pt-8 pb-4 border-b border-border flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Project Submission</p>
              <h2 class="text-xl font-extrabold">Submit Your Work</h2>
            </div>
            <button (click)="showSubmitModal.set(false)" class="p-2 hover:bg-muted rounded-xl transition-all">
              <lucide-icon [name]="X" [size]="20"></lucide-icon>
            </button>
          </div>

          @if (submitSuccess()) {
            <div class="p-10 text-center space-y-4">
              <p class="text-5xl">📎</p>
              <h3 class="text-xl font-extrabold text-teal-700">Submission Received!</h3>
              <p class="text-muted-foreground text-sm">Your project has been submitted successfully. Good luck!</p>
              <button (click)="showSubmitModal.set(false)"
                      class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold transition-all active:scale-95">
                Done ✓
              </button>
            </div>
          } @else {
            <div class="p-8 space-y-5">
              @if (submitError()) {
                <div class="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
                  <lucide-icon [name]="AlertTriangle" [size]="16" class="shrink-0"></lucide-icon>
                  <p class="text-sm font-medium">{{ submitError() }}</p>
                </div>
              }
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Project URL *</label>
                <input [(ngModel)]="submitUrl" placeholder="https://github.com/you/project"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                <p class="text-[10px] text-muted-foreground">GitHub, Drive, Notion, YouTube, etc.</p>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Notes (optional)</label>
                <textarea [(ngModel)]="submitNotes" rows="3" placeholder="Describe your project briefly…"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none transition-all"></textarea>
              </div>
              <button (click)="doSubmit()" [disabled]="!submitUrl || isSubmitting()"
                      class="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                {{ isSubmitting() ? 'Submitting…' : '📎 Submit Project' }}
              </button>
            </div>
          }
        </div>
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
  readonly ThumbsUp = ThumbsUp; readonly ThumbsDown = ThumbsDown;

  comp = signal<Competition | null>(null);
  showModal = signal(false);
  step = signal<ModalStep>('form');
  formError = signal<string | null>(null);
  alreadyRegistered = signal(false);

  // Vote
  voteStats = signal<VoteStats | null>(null);
  voterEmail = signal<string>('');
  isVoting = signal(false);
  voteEmailInput = '';

  // Share
  linkCopied = signal(false);

  // News Feed
  announcements = signal<Announcement[]>([]);

  // Submission
  showSubmitModal = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);
  isSubmitting = signal(false);
  submitUrl = '';
  submitNotes = '';

  mySubmission = computed(() => {
    const comp = this.comp();
    const email = this.regEmail || localStorage.getItem('learnivo_voter_email') || '';
    if (!comp || !email) return null;
    return comp.participants?.find(p => p.email.toLowerCase() === email.toLowerCase() && p.submissionUrl) ?? null;
  });

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
    // Restore voter email from localStorage
    this.voterEmail.set(localStorage.getItem('learnivo_voter_email') ?? '');

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const found = this.dataService.competitions().find(c => c.slug === slug);
      const comp = found ?? this.dataService.competitions()[0];
      this.comp.set(comp ?? null);
      if (comp) {
        this.startCountdown(comp.deadline);
        const key = `reg_comp_${comp.id}`;
        this.alreadyRegistered.set(localStorage.getItem(key) === 'true');
        this.loadVoteStats(comp.id);
        this.loadAnnouncements(comp.id);
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

  openSubmitModal() {
    this.submitSuccess.set(false);
    this.submitError.set(null);
    this.submitUrl = '';
    this.submitNotes = '';
    this.showSubmitModal.set(true);
  }

  doSubmit() {
    const comp = this.comp();
    if (!comp || !this.submitUrl.trim()) return;
    const email = this.regEmail || this.voterEmail() || localStorage.getItem('learnivo_voter_email') || '';
    if (!email) { this.submitError.set('Your email is not available. Please re-register.'); return; }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.dataService.submitProject(comp.id, email, this.submitUrl.trim(), this.submitNotes).subscribe(res => {
      this.isSubmitting.set(false);
      if (res) {
        this.submitSuccess.set(true);
        // Refresh participants localement
        const updated = {
          ...comp,
          participants: (comp.participants ?? []).map(p =>
            p.email.toLowerCase() === email.toLowerCase()
              ? { ...p, submissionUrl: res.submissionUrl, submissionNotes: res.submissionNotes, submittedAt: res.submittedAt }
              : p
          )
        };
        this.comp.set(updated);
      } else {
        this.submitError.set('Submission failed. Make sure you are registered for this competition.');
      }
    });
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

  // ── Vote methods ───────────────────────────────────────────────────────────

  saveVoterEmail() {
    const email = this.voteEmailInput.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    localStorage.setItem('learnivo_voter_email', email);
    this.voterEmail.set(email);
    this.voteEmailInput = '';
  }

  clearVoterEmail() {
    localStorage.removeItem('learnivo_voter_email');
    this.voterEmail.set('');
    this.voteEmailInput = '';
  }

  loadAnnouncements(competitionId: number | string) {
    if (Number(competitionId) > 9_999_999_999) return; // local temp ID
    this.dataService.getAnnouncements(competitionId).subscribe(list => {
      this.announcements.set(list);
    });
  }

  loadVoteStats(competitionId: number | string) {
    this.dataService.getVoteStats(competitionId, this.voterEmail() || undefined).subscribe(stats => {
      if (stats) this.voteStats.set(stats);
    });
  }

  castVote(type: 'LIKE' | 'DISLIKE') {
    const comp = this.comp();
    if (!comp || !this.alreadyRegistered() || !this.regEmail || this.isVoting()) return;

    this.isVoting.set(true);
    this.dataService.voteCompetition(comp.id, this.regEmail, type).subscribe({
      next: stats => {
        if (stats) this.voteStats.set(stats);
        this.isVoting.set(false);
      },
      error: () => {
        this.isVoting.set(false);
      }
    });
  }

  shareOn(platform: 'whatsapp' | 'linkedin' | 'twitter') {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this competition: ${this.comp()?.title ?? ''}`);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2000);
    });
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
    localStorage.setItem(`reg_comp_email_${comp.id}`, this.regEmail.trim());
    this.alreadyRegistered.set(true);
    this.step.set('success');
    this.formError.set(null);
  }
}