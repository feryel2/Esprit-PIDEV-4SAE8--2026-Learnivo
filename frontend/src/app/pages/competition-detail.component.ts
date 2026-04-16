import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideAngularModule, Trophy, Calendar, ArrowRight, Users, Clock,
  CheckCircle2, Flag, Tag, X, AlertTriangle, ChevronRight, Star, Zap,
  ThumbsUp, ThumbsDown, Medal, XCircle, Award
} from 'lucide-angular';
import { DataService, Competition, VoteStats, Announcement, Exercise } from '../services/data.service';
import { AuthService } from '../services/auth.service';

type ModalStep = 'form' | 'confirm' | 'success';

interface PracticeState {
  exercise: Exercise;
  currentTask: number;
  selectedAnswers: (number | null)[];
  confirmed: boolean[];
  finished: boolean;
  score: number;
}

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
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-xs font-black text-muted-foreground uppercase tracking-widest hidden sm:block">Share</span>

            <button (click)="shareOn('whatsapp')" title="WhatsApp"
                    style="background-color: #25D366" 
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>

            <button (click)="shareOn('linkedin')" title="LinkedIn"
                    style="background-color: #0077b5"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>

            <button (click)="shareOn('twitter')" title="X / Twitter"
                    style="background-color: #000000"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </button>

            <button (click)="copyLink()"
                    [ngClass]="linkCopied() ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border text-foreground hover:bg-muted'"
                    class="flex items-center border-border gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm">
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
                  <span class="px-3 py-1 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-lg shadow-red-600/20">
                    <lucide-icon [name]="Trophy" [size]="10"></lucide-icon> High Difficulty
                  </span>
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

              <!-- ── POST-COMPETITION REVIEW (registered participants only) ── -->
              @if (alreadyRegistered() && comp()!.status === 'completed') {
                <div class="bg-white rounded-3xl border border-border p-8 shadow-lg space-y-6">

                  <!-- Header -->
                  <div class="flex items-center justify-between border-b border-border pb-5">
                    <div>
                      <h2 class="text-2xl font-extrabold flex items-center gap-3">
                        <span class="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xl">&#128202;</span>
                        Your Performance Review
                      </h2>
                      <p class="text-muted-foreground text-sm mt-1">
                        Competition ended — see the questions and correct answers to understand your level.
                        Results feed your <strong class="text-teal-600">AI Recommendations</strong>.
                      </p>
                    </div>
                    <span class="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full shrink-0">
                      {{ comp()!.category }}
                    </span>
                  </div>

                  <!-- Questions & Answers -->
                  <div class="space-y-4">
                    <h4 class="font-extrabold text-base">&#128221; Questions &amp; Correct Answers</h4>
                    @for (r of getCategoryReview(); track r.question; let i = $index) {
                      <div class="p-5 rounded-2xl border-2 border-border bg-muted/10">
                        <div class="flex items-start gap-3">
                          <span class="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5">
                            {{ i + 1 }}
                          </span>
                          <div class="flex-1">
                            <p class="font-bold text-sm mb-3">{{ r.question }}</p>
                            <div class="flex flex-col sm:flex-row gap-2">
                              <div class="flex items-center gap-2 p-3 rounded-xl text-sm font-bold bg-teal-600 text-white flex-1">
                                <span>&#10003;</span>
                                <div>
                                  <p class="text-[9px] uppercase tracking-widest opacity-70 font-black">Correct Answer</p>
                                  <p>{{ r.correctAnswer }}</p>
                                </div>
                              </div>
                            </div>
                            @if (r.explanation) {
                              <p class="mt-2 text-xs text-muted-foreground italic border-l-2 border-teal-400 pl-3">{{ r.explanation }}</p>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- CTA -->
                  <div class="rounded-2xl p-6 text-center" style="background:linear-gradient(135deg,#f0fdfa,#e6fffa);border:1px solid #99f6e4">
                    <p class="font-black text-teal-700 text-base mb-2">&#129514; Your learning profile has been updated!</p>
                    <p class="text-sm text-teal-600 mb-4">The AI has recalculated your personalized recommendations based on this competition.</p>
                    <a routerLink="/competitions"
                       [queryParams]="{tab: 'recommended', email: regEmail}"
                       class="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                       style="background:#0d9488">
                      View My Recommendations &#8594;
                    </a>
                  </div>

                </div>
              }

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

                @if (voteError()) {
                  <div class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    <span>⚠️</span>
                    <span>{{ voteError() }}</span>
                  </div>
                }
              </div>

              <!-- Rounds Timeline -->
              @if (alreadyRegistered() && (comp()!.rounds || []).length > 0) {
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
              @if (alreadyRegistered() && comp()!.rules) {
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
              @if (alreadyRegistered()) {
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
              }

              <!-- Royal Night & Gold Podium -->
              @if (comp()!.resultsPublished && (comp()!.participants || []).length > 0) {
                <div class="royal-night rounded-[3rem] border border-white/10 p-12 shadow-2xl relative overflow-hidden group/podium">
                  
                  <!-- Floating Star Particles -->
                  <div class="absolute inset-0 pointer-events-none overflow-hidden">
                    <div class="star-particle w-1 h-1 top-1/4 left-1/4" style="animation-delay: 0s"></div>
                    <div class="star-particle w-1.5 h-1.5 top-1/2 left-1/3" style="animation-delay: 2s"></div>
                    <div class="star-particle w-1 h-1 top-3/4 left-2/3" style="animation-delay: 1s"></div>
                    <div class="star-particle w-2 h-2 top-1/3 left-3/4" style="animation-delay: 4s"></div>
                  </div>

                  <div class="text-center space-y-4 relative z-10 mb-20">
                    <div class="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <lucide-icon [name]="Trophy" [size]="20" class="text-amber-400"></lucide-icon>
                      <span class="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">Champions Hall</span>
                    </div>
                    <h2 class="text-5xl font-black text-white tracking-tighter">The Winners</h2>
                    <p class="text-slate-400 text-sm font-medium max-w-md mx-auto">Celebrating the legendary performers who climbed to the summit of this competition.</p>
                  </div>

                  <!-- The Podium -->
                  <div class="perspective-2000 w-full pt-10 pb-16 px-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 items-end gap-x-12 gap-y-24 max-w-5xl mx-auto preserve-3d">
                      
                      <!-- 2nd Place: Silver -->
                      <div class="flex flex-col items-center md:order-1 hover-tilt preserve-3d">
                        @if (getWinners()[1]; as p) {
                          <div class="relative mb-12">
                            <div class="aura-silver absolute -inset-4 bg-slate-400/20 blur-2xl rounded-full"></div>
                            <div class="w-28 h-28 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-900 border-4 border-white shadow-2xl relative z-10">
                              <span class="text-5xl font-black uppercase tracking-tighter italic">{{ p.name.charAt(0) }}</span>
                            </div>
                            <div class="absolute -top-4 -right-4 bg-slate-200 text-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border-4 border-slate-950 shadow-xl rotate-12 z-20">2nd</div>
                          </div>
                          
                          <div class="text-center mb-10 z-10">
                            <p class="font-black text-xl text-white tracking-tight">{{ p.name }}</p>
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{{ p.score }} PTS</span>
                          </div>

                          <!-- Silver Platform -->
                          <div class="w-full h-32 royal-glass rounded-3xl border-b-[12px] border-slate-400/30 flex items-center justify-center relative overflow-hidden group">
                            <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"></div>
                            <lucide-icon [name]="Medal" [size]="48" class="text-slate-400/40 group-hover:scale-125 transition-transform duration-700"></lucide-icon>
                          </div>
                        } @else {
                          <div class="opacity-10 grayscale flex flex-col items-center">
                            <div class="w-28 h-28 bg-white/10 rounded-3xl mb-12"></div>
                            <div class="w-full h-32 bg-white/5 rounded-3xl border-b-8 border-white/10"></div>
                          </div>
                        }
                      </div>

                      <!-- 1st Place: Gold -->
                      <div class="flex flex-col items-center relative z-20 md:order-2 hover-tilt preserve-3d -translate-y-12">
                        @if (getWinners()[0]; as p) {
                          <div class="relative mb-16">
                            <div class="aura-gold absolute -inset-8 bg-amber-400/30 blur-3xl rounded-full"></div>
                            <div class="w-44 h-44 rounded-[2.5rem] gold-silk flex items-center justify-center text-white border-8 border-amber-200 shadow-[0_30px_60px_-15px_rgba(251,191,36,0.5)] relative z-10">
                              <span class="text-8xl font-black drop-shadow-2xl uppercase tracking-tighter italic">{{ p.name.charAt(0) }}</span>
                            </div>
                            <div class="absolute -top-6 -right-6 bg-amber-400 text-amber-950 w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black border-8 border-amber-200 shadow-2xl rotate-12 z-20">1st</div>
                          </div>
                          
                          <div class="text-center mb-12 z-10">
                            <p class="font-black text-4xl text-white tracking-tighter leading-none mb-4 italic">{{ p.name }}</p>
                            <div class="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-8 py-3 rounded-full font-black text-sm tracking-widest shadow-2xl">
                              <lucide-icon [name]="Trophy" [size]="18"></lucide-icon>
                              {{ p.score }} PTS
                            </div>
                          </div>

                          <!-- Gold Platform -->
                          <div class="w-full h-48 royal-glass rounded-[2rem] border-b-[16px] border-amber-500/40 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                             <div class="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-orange-400/10 opacity-50"></div>
                             <lucide-icon [name]="Star" [size]="72" class="text-amber-400 fill-amber-400 animate-pulse relative z-10"></lucide-icon>
                             <span class="text-amber-400 font-black uppercase tracking-[0.5em] text-[10px] relative z-10">Ultimate Champion</span>
                             <!-- Shine Sweep -->
                             <div class="absolute -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40 animate-shine"></div>
                          </div>
                        } @else {
                          <div class="opacity-10 grayscale flex flex-col items-center">
                            <div class="w-44 h-44 bg-white/10 rounded-[2.5rem] mb-16"></div>
                            <div class="w-full h-48 bg-white/5 rounded-[2rem] border-b-8 border-white/10"></div>
                          </div>
                        }
                      </div>

                      <!-- 3rd Place: Bronze -->
                      <div class="flex flex-col items-center md:order-3 hover-tilt preserve-3d">
                        @if (getWinners()[2]; as p) {
                          <div class="relative mb-12">
                            <div class="aura-bronze absolute -inset-4 bg-orange-700/20 blur-2xl rounded-full"></div>
                            <div class="w-28 h-28 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-900 border-4 border-white shadow-2xl relative z-10">
                              <span class="text-5xl font-black uppercase tracking-tighter italic">{{ p.name.charAt(0) }}</span>
                            </div>
                            <div class="absolute -top-4 -right-4 bg-orange-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border-4 border-slate-950 shadow-xl -rotate-12 z-20">3rd</div>
                          </div>
                          
                          <div class="text-center mb-10 z-10">
                            <p class="font-black text-xl text-white tracking-tight">{{ p.name }}</p>
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{{ p.score }} PTS</span>
                          </div>

                          <!-- Bronze Platform -->
                          <div class="w-full h-28 royal-glass rounded-3xl border-b-[8px] border-orange-700/30 flex items-center justify-center relative overflow-hidden group">
                            <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-700/50 to-transparent"></div>
                            <lucide-icon [name]="Medal" [size]="40" class="text-orange-700/40 group-hover:scale-125 transition-transform duration-700"></lucide-icon>
                          </div>
                        } @else {
                          <div class="opacity-10 grayscale flex flex-col items-center">
                            <div class="w-28 h-28 bg-white/10 rounded-3xl mb-12"></div>
                            <div class="w-full h-28 bg-white/5 rounded-3xl border-b-8 border-white/10"></div>
                          </div>
                        }
                      </div>

                    </div>
                  </div>

                  <!-- Rest of Leaderboard (Royal Dark) -->
                  @if (getSortedParticipants().length > 3) {
                    <div class="space-y-4 pt-12 mt-12 border-t border-white/10 relative z-10">
                      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 text-center">Finalists Honor Roll</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (p of getSortedParticipants() | slice:3:11; track p.id; let i = $index) {
                          <div class="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/item">
                            <span class="text-xs font-black text-slate-500 w-8">#0{{ i + 4 }}</span>
                            <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-sm font-black border border-white/10 group-hover/item:scale-110 transition-transform">{{ p.name.charAt(0) }}</div>
                            <div class="flex-1">
                              <p class="font-bold text-white group-hover/item:text-amber-400 transition-colors">{{ p.name }}</p>
                              <p class="text-[9px] text-slate-500 uppercase tracking-widest">{{ p.status }}</p>
                            </div>
                            <div class="text-right">
                              <span class="font-black text-sm text-slate-300">{{ p.score }}</span>
                              <p class="text-[8px] text-slate-600 font-black uppercase tracking-tighter">points</p>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
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

                    @if (mySubmission(); as sub) {
                      <div class="p-6 rounded-2xl bg-teal-50 border-2 border-teal-100 text-center space-y-3 animate-in fade-in zoom-in duration-500">
                        <div class="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                          <lucide-icon [name]="CheckCircle2" [size]="24"></lucide-icon>
                        </div>
                        <div>
                          <p class="font-black text-teal-900 text-lg">Challenge Completed</p>
                          <p class="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-1">Submission Verified & Locked</p>
                        </div>
                        <div class="pt-3 border-t border-teal-100 grid grid-cols-2 gap-2 text-[10px] font-black uppercase text-teal-800">
                          <div class="bg-white/50 p-2 rounded-xl">Score: {{ sub.score }}%</div>
                          <div class="bg-white/50 p-2 rounded-xl">Errors: {{ sub.errorsCount }}</div>
                        </div>
                        @if (sub.submissionUrl && sub.submissionUrl !== 'task-based-submission') {
                          <a [href]="sub.submissionUrl" target="_blank" 
                             class="block py-2 text-[10px] font-bold text-teal-700 bg-white/40 rounded-xl hover:bg-white/60 transition-all truncate px-3">
                             📎 Attached: {{ sub.submissionUrl }}
                          </a>
                        }
                      </div>
                    } @else if (comp()!.status !== 'completed' && !isDeadlinePassed()) {
                      <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1 mb-2">
                        <p class="font-black text-teal-700 text-sm">✓ You are Registered</p>
                        <p class="text-[10px] text-teal-600">Ready to take the challenge?</p>
                      </div>
                      <button (click)="openAssessment()"
                              class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 group relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <lucide-icon [name]="Medal" [size]="20" class="group-hover:animate-bounce"></lucide-icon>
                        Start Challenge Tasks
                      </button>
                      <div class="flex items-center justify-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-tighter animate-pulse">
                        <lucide-icon [name]="AlertTriangle" [size]="12"></lucide-icon>
                        Warning: You only have one chance to submit
                      </div>
                      <button (click)="openSubmitModal()"
                              class="w-full py-3 border-2 border-teal-600 text-teal-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-50 transition-all active:scale-95">
                        📎 Submit My Project
                      </button>
                    }
                  </div>
                } @else if (comp()!.status === 'completed') {
                  <div class="p-4 rounded-2xl bg-muted text-center space-y-1">
                    <p class="font-bold text-muted-foreground text-sm">Competition Ended</p>
                  </div>
                } @else if (isDeadlinePassed()) {
                  <div class="p-4 rounded-2xl bg-muted text-center space-y-1">
                    <p class="font-bold text-muted-foreground text-sm">Registration Closed</p>
                    <p class="text-[10px] text-muted-foreground">The deadline for registration has passed.</p>
                  </div>
                } @else if (spotsLeft() <= 0) {
                  <div class="p-4 rounded-2xl bg-amber-50 text-center space-y-1">
                    <p class="font-bold text-amber-700 text-sm">Registration Full</p>
                    <p class="text-[10px] text-amber-600">There are no spots remaining.</p>
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
                       [ngClass]="{'border-red-500 ring-red-500/10': submitUrl && !isValidUrl(submitUrl)}"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                @if (submitUrl && !isValidUrl(submitUrl)) {
                  <p class="text-[10px] text-red-500 font-bold px-1">Must be a valid URL (http/https).</p>
                }
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Notes (optional)</label>
                <textarea [(ngModel)]="submitNotes" rows="3" placeholder="Describe your project briefly…"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none transition-all"></textarea>
              </div>
              <button (click)="doSubmit()" [disabled]="!isValidUrl(submitUrl) || isSubmitting()"
                      class="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                {{ isSubmitting() ? 'Submitting…' : '📎 Submit Project' }}
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- ── CHALLENGE ASSESSMENT MODAL ────────────────────────────────────── -->
    @if (assessmentState(); as s) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col" style="max-height:90vh;">
          
          <!-- Header -->
          <div class="px-8 py-6 flex items-start justify-between border-b border-border shrink-0"
               [style.background]="s.finished ? 'linear-gradient(135deg,#0d9488,#0f766e)' : 'linear-gradient(135deg,#6366f1,#4f46e5)'">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Interactive Challenge</p>
              <h2 class="text-xl font-black text-white">{{ s.exercise.title }}</h2>
              <div class="flex items-center gap-3 mt-2 text-white/80 text-xs font-bold">
                <span>{{ s.currentTask + 1 }} / {{ s.exercise.tasks.length }} Tasks</span>
                <span class="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Category: {{ s.exercise.category }}</span>
              </div>
            </div>
            <button (click)="closeAssessment()" class="p-2 hover:bg-white/20 rounded-xl transition-all text-white">
              <lucide-icon [name]="XCircle" [size]="24"></lucide-icon>
            </button>
          </div>

          <!-- Progress -->
          @if (!s.finished) {
            <div class="h-1.5 bg-muted shrink-0">
              <div class="h-full bg-blue-500 transition-all duration-500"
                   [style.width.%]="((s.currentTask + (s.confirmed[s.currentTask] ? 1 : 0)) / s.exercise.tasks.length * 100)"></div>
            </div>
          }

          <!-- Body -->
          <div class="overflow-y-auto flex-1 p-8">
            @if (s.finished) {
              <div class="text-center space-y-6 py-6">
                <div class="w-24 h-24 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-5xl mx-auto shadow-xl">
                  {{ s.score >= 70 ? '🎉' : '📈' }}
                </div>
                <div class="space-y-2">
                  <h3 class="text-3xl font-black text-teal-700">{{ s.score }}% Complete!</h3>
                  <p class="text-muted-foreground font-medium">Excellent work. Your results have been submitted and your AI profile updated.</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-teal-50 border border-teal-100 p-4 rounded-2xl text-center">
                    <p class="text-2xl font-black text-teal-600">{{ getCorrectCount(s) }}</p>
                    <p class="text-[10px] font-black uppercase tracking-widest text-teal-700 mt-1">Found correct</p>
                  </div>
                  <div class="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center">
                    <p class="text-2xl font-black text-blue-600">+{{ s.score }}</p>
                    <p class="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-1">Skill Points</p>
                  </div>
                </div>
                <button (click)="closeAssessment()" class="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 mt-6">
                  Great, Return to Competition
                </button>
              </div>
            } @else {
              @let task = s.exercise.tasks[s.currentTask];
              @let confirmed = s.confirmed[s.currentTask];
              @let selected = s.selectedAnswers[s.currentTask];

              <div class="space-y-8">
                <div class="space-y-2">
                  <h4 class="text-2xl font-black text-foreground leading-tight">{{ task.question }}</h4>
                  <p class="text-muted-foreground text-sm font-medium">Select the most accurate response to validate this task.</p>
                </div>

                <div class="space-y-3">
                  @for (opt of task.options; track opt; let oi = $index) {
                    <button (click)="selectAssessmentAnswer(oi)" [disabled]="confirmed"
                            [ngClass]="{
                              'border-blue-500 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20': !confirmed && selected === oi,
                              'border-teal-500 bg-teal-50 text-teal-700': confirmed && oi === task.correctIndex,
                              'border-red-400 bg-red-50 text-red-600': confirmed && selected === oi && oi !== task.correctIndex,
                              'border-border hover:border-blue-300 hover:bg-muted/30': !confirmed && selected !== oi
                            }"
                            class="w-full text-left px-6 py-5 border-2 rounded-2xl font-bold text-base transition-all flex items-center gap-4">
                      <span class="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0"
                            [ngClass]="{
                              'bg-blue-500 border-blue-500 text-white': !confirmed && selected === oi,
                              'bg-teal-500 border-teal-500 text-white': confirmed && oi === task.correctIndex,
                              'bg-red-400 border-red-400 text-white': confirmed && selected === oi && oi !== task.correctIndex,
                              'border-muted-foreground/30 text-muted-foreground': !confirmed && selected !== oi
                            }">{{ ['A','B','C','D'][oi] }}</span>
                      {{ opt }}
                    </button>
                  }
                </div>

                @if (confirmed) {
                  <div class="p-6 rounded-2xl border-2 animate-in slide-in-from-bottom-2 duration-300" 
                       [class]="selected === task.correctIndex ? 'bg-teal-50 border-teal-100 text-teal-800' : 'bg-amber-50 border-amber-100 text-amber-800'">
                    <p class="font-black text-sm mb-2 uppercase tracking-widest">{{ selected === task.correctIndex ? '✨ Task Validated!' : '💡 Guidance' }}</p>
                    <p class="text-sm font-medium leading-relaxed">{{ task.explanation }}</p>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          @if (!s.finished) {
            <div class="px-8 py-6 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
               @if (!s.confirmed[s.currentTask]) {
                 <button (click)="confirmAssessmentAnswer()" [disabled]="s.selectedAnswers[s.currentTask] === null"
                         class="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95">
                   Validate Task
                 </button>
               } @else if (s.currentTask < s.exercise.tasks.length - 1) {
                 <button (click)="nextAssessmentTask()" class="px-10 py-4 bg-foreground text-background hover:opacity-90 rounded-2xl font-black transition-all flex items-center gap-2">
                   Next Task <lucide-icon [name]="ArrowRight" [size]="18"></lucide-icon>
                 </button>
               } @else {
                 <button (click)="finishAssessment()" class="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg active:scale-95">
                   <lucide-icon [name]="Award" [size]="18"></lucide-icon>
                   Finish Challenge
                 </button>
               }
               <div class="text-right">
                 <p class="text-xs font-black text-muted-foreground uppercase tracking-widest">{{ s.currentTask + 1 }} of {{ s.exercise.tasks.length }}</p>
                 <p class="text-[10px] text-muted-foreground font-bold">Category Match: 100%</p>
               </div>
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
                       [ngClass]="{'border-red-500 ring-red-500/10': regName && regName.length < 3}"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                @if (regName && regName.length < 3) {
                  <p class="text-[10px] text-red-500 font-bold px-1">Must be at least 3 characters.</p>
                }
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address *</label>
                <input [(ngModel)]="regEmail" type="email" placeholder="you@example.com"
                       [ngClass]="{'border-red-500 ring-red-500/10': regEmail && !isValidEmail(regEmail)}"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                @if (regEmail && !isValidEmail(regEmail)) {
                  <p class="text-[10px] text-red-500 font-bold px-1">Please enter a valid email.</p>
                }
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone (optional)</label>
                <input [(ngModel)]="regPhone" placeholder="+213 555 000 000"
                       [ngClass]="{'border-red-500 ring-red-500/10': regPhone && !isValidPhone(regPhone)}"
                       class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none transition-all">
                @if (regPhone && !isValidPhone(regPhone)) {
                  <p class="text-[10px] text-red-500 font-bold px-1">Invalid phone format (e.g. +216 55 555 555).</p>
                }
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black uppercase tracking-widest text-muted-foreground">Why do you want to join?</label>
                <textarea [(ngModel)]="regMotivation" rows="3" placeholder="Tell us about your background and motivation..."
                          [ngClass]="{'border-red-500 ring-red-500/10': regMotivation && regMotivation.length < 10}"
                          class="w-full px-4 py-3 rounded-2xl border border-border bg-muted/30 font-medium focus:ring-2 focus:ring-teal-600/20 outline-none resize-none transition-all"></textarea>
                @if (regMotivation && regMotivation.length < 10) {
                  <p class="text-[10px] text-red-500 font-bold px-1">Write at least 10 characters.</p>
                }
              </div>

              <button (click)="goToConfirm()" [disabled]="!isFormValid()"
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


              <div class="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-sm text-teal-700 font-medium space-y-1 text-left">
                <p>🏆 Competing for: <strong>{{ comp()!.prize }}</strong></p>
                @if (comp()!.startDate) {
                  <p>📅 Starts: <strong>{{ comp()!.startDate }}</strong></p>
                }
                <p>📧 Confirmation sent to <strong>{{ regEmail }}</strong></p>
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
  private authService = inject(AuthService);

  readonly Trophy = Trophy; readonly Calendar = Calendar; readonly ArrowRight = ArrowRight;
  readonly Users = Users; readonly Clock = Clock; readonly CheckCircle2 = CheckCircle2;
  readonly Flag = Flag; readonly Tag = Tag; readonly X = X; readonly AlertTriangle = AlertTriangle;
  readonly ChevronRight = ChevronRight; readonly Star = Star; readonly Zap = Zap;
  readonly ThumbsUp = ThumbsUp; readonly ThumbsDown = ThumbsDown;
  readonly Medal = Medal;

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
  voteError = signal<string | null>(null);

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

  assessmentState = signal<PracticeState | null>(null);

  readonly XCircle = XCircle;
  readonly Award = Award;
  postCompetitionReview = computed(() => this.getCategoryReview());

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
  isDeadlinePassed = signal(false);
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
        this.runTimers(comp);
        const key = `reg_comp_${comp.id}`;
        const emailKey = `reg_comp_email_${comp.id}`;
        const registered = localStorage.getItem(key) === 'true';

        // Pre-fill form fields for logged-in users (does NOT count as registered)
        if (this.authService.isAuthenticated()) {
          const loggedInUser = this.authService.getCurrentUser();
          const userEmail = loggedInUser?.email ?? '';
          if (userEmail && !registered) {
            this.regEmail = userEmail;
            this.regName = (loggedInUser?.firstName || loggedInUser?.lastName)
              ? `${loggedInUser.firstName ?? ''} ${loggedInUser.lastName ?? ''}`.trim()
              : userEmail.split('@')[0];
          }
        }

        this.alreadyRegistered.set(registered);
        if (registered) {
          const storedEmail = localStorage.getItem(emailKey);
          if (storedEmail) this.regEmail = storedEmail;
        }
        this.loadVoteStats(comp.id, registered ? localStorage.getItem(emailKey) ?? undefined : undefined);
        this.loadAnnouncements(comp.id);
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  private runTimers(comp: Competition) {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    const deadline = new Date(comp.deadline).getTime();
    const pad = (n: number) => Math.floor(n).toString().padStart(2, '0');

    const tick = () => {
      const now = new Date().getTime();
      
      // 1. Registration Deadline Timer
      const dDiff = deadline - now;
      if (dDiff <= 0 || isNaN(dDiff)) {
        this.countdown.set([
          { label: 'Days', value: '00' }, { label: 'Hrs', value: '00' },
          { label: 'Min', value: '00' }, { label: 'Sec', value: '00' }
        ]);
        this.isDeadlinePassed.set(true);
      } else {
        this.isDeadlinePassed.set(false);
        this.countdown.set([
          { label: 'Days', value: pad(dDiff / 86400000) },
          { label: 'Hrs', value: pad((dDiff % 86400000) / 3600000) },
          { label: 'Min', value: pad((dDiff % 3600000) / 60000) },
          { label: 'Sec', value: pad((dDiff % 60000) / 1000) }
        ]);
      }
    };
    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  getRules(): string[] {
    return (this.comp()?.rules ?? '').split('\n').map(r => r.replace(/^\d+\.\s*/, '').trim()).filter(r => !!r);
  }

  openSubmitModal() {
    this.submitSuccess.set(false);
    this.submitError.set(null);
    this.submitUrl = '';
    this.submitNotes = '';
    this.showSubmitModal.set(true);
  }

  isValidUrl(url: string) {
    if (!url) return false;
    return /^(http|https):\/\/[^ "]+$/.test(url.trim());
  }

  doSubmit() {
    const comp = this.comp();
    if (!comp || !this.isValidUrl(this.submitUrl)) return;
    const email = this.regEmail || this.voterEmail() || localStorage.getItem('learnivo_voter_email') || '';
    if (!email) { this.submitError.set('Your email is not available. Please re-register.'); return; }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.dataService.submitProject(comp.id, email, this.submitUrl.trim(), this.submitNotes).subscribe((res: any) => {
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

  isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string) {
    if (!phone) return true;
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''));
  }

  isFormValid() {
    return this.regName.trim().length >= 3 &&
           this.isValidEmail(this.regEmail) &&
           this.isValidPhone(this.regPhone) &&
           (!this.regMotivation || this.regMotivation.length >= 10);
  }

  goToConfirm() {
    if (!this.isFormValid()) {
      this.formError.set('Please fix the errors in the form.');
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

  loadVoteStats(competitionId: number | string, emailOverride?: string) {
    const email = emailOverride ?? (this.regEmail.trim() || undefined);
    this.dataService.getVoteStats(competitionId, email).subscribe(stats => {
      if (stats) this.voteStats.set(stats);
    });
  }

  castVote(type: 'LIKE' | 'DISLIKE') {
    const comp = this.comp();
    if (!comp || !this.alreadyRegistered() || this.isVoting()) return;

    const email = this.regEmail.trim() || localStorage.getItem(`reg_comp_email_${comp.id}`);
    if (!email) return;

    this.isVoting.set(true);
    this.voteError.set(null);
    this.dataService.voteCompetition(comp.id, email, type).subscribe({
      next: stats => {
        if (stats) {
          this.voteStats.set(stats);
        } else {
          this.voteError.set('Vote failed — you must be registered for this competition.');
        }
        this.isVoting.set(false);
      },
      error: err => {
        const msg = err?.error?.message ?? 'Vote failed — you must be registered for this competition.';
        this.voteError.set(msg);
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
    const err = this.dataService.registerForCompetition(comp.id, this.regName.trim(), this.regEmail.trim(), this.regPhone.trim(), this.regMotivation.trim());
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

  getCategoryReview(): { question: string; correctAnswer: string; explanation: string }[] {
    const comp = this.comp();
    if (!comp) return [];
    const cat = (comp.category ?? '').toLowerCase();
    
    if (cat.includes('coding') || cat.includes('programming') || cat.includes('hackathon')) {
      return [
        { question: 'What is the prime advantage of B-Trees in databases?', correctAnswer: 'Minimized disk I/O through high branching factor', explanation: 'B-Trees keep data sorted and allow for logarithmic time for searches, sequential access, insertions, and deletions.' },
        { question: 'Difference between Process and Thread?', correctAnswer: 'Processes have independent memory; threads share it', explanation: 'Threads within the same process share the same data space, making communication easier but synchronization harder.' },
        { question: 'What does the CAP theorem state?', correctAnswer: 'Consistency, Availability, and Partition Tolerance balance', explanation: 'A distributed system can only provide two of the three guarantees simultaneously.' },
        { question: 'What is an idempotent API operation?', correctAnswer: 'Result is same for one or many identical requests', explanation: 'Operations like GET and PUT should be idempotent, while POST is typically not.' },
        { question: 'Complexity of balancing an AVL tree?', correctAnswer: 'O(log n)', explanation: 'AVL trees maintain a height balance factor, ensuring logarithmic search performance.' }
      ];
    }
    if (cat.includes('science') || cat.includes('physics') || cat.includes('chemistry') || cat.includes('biology')) {
      return [
        { question: 'How does the Doppler Effect affect light from receding stars?', correctAnswer: 'Redshift (Frequency decreases)', explanation: 'As a source moves away, the observed wavelength increases (shifts toward red).' },
        { question: 'What is the "Central Dogma" of molecular biology?', correctAnswer: 'DNA → RNA → Protein', explanation: 'Describes the flow of genetic information within a biological system.' },
        { question: 'First law of Thermodynamics?', correctAnswer: 'Energy cannot be created or destroyed, only transformed', explanation: 'Total energy in an isolated system remains constant.' },
        { question: 'Role of enzymes in activation energy?', correctAnswer: 'They lower activation energy to speed up reactions', explanation: 'Enzymes act as biological catalysts.' },
        { question: 'What is Heisenberg\'s Uncertainty Principle?', correctAnswer: 'Position and momentum cannot both be precisely known', explanation: 'The more precisely one property is measured, the less precisely the other can be controlled/known.' }
      ];
    }
    if (cat.includes('math')) {
      return [
        { question: 'Result of Euler\'s Identity (e^iπ + 1)?', correctAnswer: '0', explanation: 'Considered one of the most beautiful equations in math, linking 5 fundamental constants.' },
        { question: 'What determines if a function is surjective?', correctAnswer: 'Every element in the codomain is mapped', explanation: 'The range of the function is equal to its codomain.' },
        { question: 'What is the Law of Large Numbers?', correctAnswer: 'Sample mean converges to population mean as n grows', explanation: 'Describes the result of performing the same experiment many times.' },
        { question: 'Derivative of ln(x)?', correctAnswer: '1/x', explanation: 'Fundamental rule in calculus for logarithmic functions.' },
        { question: 'Goldbach\'s Conjecture states?', correctAnswer: 'Every even integer > 2 is sum of two primes', explanation: 'One of the oldest and most famous unsolved problems in number theory.' }
      ];
    }
    if (cat.includes('art')) {
      return [
        { question: 'Pioneer of the "Readymade" movement?', correctAnswer: 'Marcel Duchamp', explanation: 'Duchamp challenged traditional notions of art with works like "Fountain".' },
        { question: 'What defines the "Golden Ratio" in composition?', correctAnswer: 'Ratio of approx 1:1.618 (Phi)', explanation: 'Commonly used in art and architecture for aesthetically pleasing proportions.' },
        { question: 'Avent-garde movement focused on dreams and the unconscious?', correctAnswer: 'Surrealism', explanation: 'Led by figures like Salvador Dalí and René Magritte.' },
        { question: 'Technique of using small dots to create an image?', correctAnswer: 'Pointillism', explanation: 'Developed by Georges Seurat and Paul Signac.' },
        { question: 'What is "Atmospheric Perspective"?', correctAnswer: 'Using color/blur to suggest depth & distance', explanation: 'Objects further away appear less detailed and bluer/grayer.' }
      ];
    }
    if (cat.includes('music')) {
      return [
        { question: 'Standard frequency of concert A?', correctAnswer: '440 Hz', explanation: 'Standard tuning pitch for most modern orchestras.' },
        { question: 'What is a "Tritone" interval?', correctAnswer: 'An augmented fourth or diminished fifth', explanation: 'Historically known as "Diabolus in Musica" due to its dissonance.' },
        { question: 'Composition style using all 12 chromatic tones equally?', correctAnswer: 'Serialism / 12-Tone Technique', explanation: 'Pioneered by Arnold Schoenberg.' },
        { question: 'A "Suite" in classical music is?', correctAnswer: 'An ordered set of instrumental/orchestral pieces', explanation: 'Often based on dance forms.' },
        { question: 'Difference between major and minor scales?', correctAnswer: 'The third scale degree (Major 3rd vs Minor 3rd)', explanation: 'This interval primarily determines the scale\'s "happy" or "sad" quality.' }
      ];
    }
    if (cat.includes('language') || cat.includes('english') || cat.includes('french')) {
      return [
        { question: 'What is "Etymology"?', correctAnswer: 'The study of word origins and history', explanation: 'Tracks how word meanings and spellings evolve over time.' },
        { question: 'A "Spoonerism" is a linguistic error where?', correctAnswer: 'Initial sounds of two words are swapped', explanation: 'Named after William Archibald Spooner (e.g., "The queer old dean" vs "The dear old queen").' },
        { question: 'The "Sapir-Whorf Hypothesis" suggests?', correctAnswer: 'Language influences or determines thought', explanation: 'Proposes that the structure of a language affects its speakers\' world view.' },
        { question: 'A "Portmanteau" word is formed by?', correctAnswer: 'Joining parts of two words (e.g., Brunch)', explanation: 'Combines the meanings of both source words.' },
        { question: 'Difference between a Clause and a Phrase?', correctAnswer: 'Clauses have a subject and verb; phrases do not', explanation: 'A clause can sometimes stand alone as a sentence, a phrase cannot.' }
      ];
    }
    if (cat.includes('robotics')) {
      return [
        { question: 'Inverse Kinematics (IK) solves for?', correctAnswer: 'Joint angles needed for a specific end-effector pose', explanation: 'Essential for robot arm precision.' },
        { question: 'What is a "PID Controller"?', correctAnswer: 'Proportional-Integral-Derivative feedback loop', explanation: 'Continuously calculates an error value and applies a correction.' },
        { question: 'Degrees of Freedom (DoF) of a typical human arm?', correctAnswer: '7 DoF', explanation: '3 at the shoulder, 1 at the elbow, and 3 at the wrist.' },
        { question: 'A "Lidar" sensor uses what to measure distance?', correctAnswer: 'Pulsed laser light', explanation: 'Light Detection and Ranging.' },
        { question: 'Dead Reckoning is a navigation method based on?', correctAnswer: 'Previous position and estimated speeds/times', explanation: 'Subject to cumulative errors over time.' }
      ];
    }
    return [];
  }

  // ── ASSESSMENT LOGIC ───────────────────────────────────────────────────────

  openAssessment() {
    const comp = this.comp();
    if (!comp || this.isDeadlinePassed() || this.mySubmission()) return;

    // Find exercise matching category
    const cat = comp.category || 'General';
    const exercises = this.dataService.exercises();
    let ex = exercises.find(e => e.category.toLowerCase() === cat.toLowerCase());
    if (!ex) ex = exercises[0]; // Fallback

    if (!ex) return;

    this.assessmentState.set({
      exercise: ex,
      currentTask: 0,
      selectedAnswers: new Array(ex.tasks.length).fill(null),
      confirmed: new Array(ex.tasks.length).fill(false),
      finished: false,
      score: 0
    });
  }

  closeAssessment() {
    this.assessmentState.set(null);
  }

  selectAssessmentAnswer(idx: number) {
    const s = this.assessmentState();
    if (!s || s.confirmed[s.currentTask] || s.finished) return;
    const newAnswers = [...s.selectedAnswers];
    newAnswers[s.currentTask] = idx;
    this.assessmentState.set({ ...s, selectedAnswers: newAnswers });
  }

  confirmAssessmentAnswer() {
    const s = this.assessmentState();
    if (!s || s.selectedAnswers[s.currentTask] === null || s.confirmed[s.currentTask]) return;
    const newConfirmed = [...s.confirmed];
    newConfirmed[s.currentTask] = true;
    this.assessmentState.set({ ...s, confirmed: newConfirmed });
  }

  nextAssessmentTask() {
    const s = this.assessmentState();
    if (!s || s.currentTask >= s.exercise.tasks.length - 1) return;
    this.assessmentState.set({ ...s, currentTask: s.currentTask + 1 });
  }

  finishAssessment() {
    const s = this.assessmentState();
    const comp = this.comp();
    if (!s || !comp) return;

    // Calculate score
    const correctCount = s.selectedAnswers.filter((ans, i) => ans === s.exercise.tasks[i].correctIndex).length;
    const scorePct = Math.round((correctCount / s.exercise.tasks.length) * 100);
    const errorsCount = s.exercise.tasks.length - correctCount;

    this.assessmentState.set({ ...s, finished: true, score: scorePct });

    // Submit to backend
    const email = this.regEmail.trim() || localStorage.getItem(`reg_comp_email_${comp.id}`);
    if (email) {
      this.dataService.submitProject(comp.id, email, 'task-based-submission', `Completed challenge with ${scorePct}% score.`, scorePct, errorsCount).subscribe(res => {
        if (res) {
          const currentComp = this.comp();
          if (currentComp) {
            const others = (currentComp.participants ?? []).filter(p => p.email.toLowerCase() !== email.toLowerCase());
            this.comp.set({ ...currentComp, participants: [...others, res] });
          }
        }
      });
    }
  }

  getSortedParticipants() {
    return [...(this.comp()?.participants ?? [])]
      .filter(p => p.status !== 'disqualified')
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  }

  getWinners() {
    return this.getSortedParticipants().slice(0, 3);
  }

  getCorrectCount(s: PracticeState): number {
    if (!s || !s.exercise || !s.exercise.tasks) return 0;
    return s.selectedAnswers.filter((ans, i) => ans === s.exercise.tasks[i].correctIndex).length;
  }
}

