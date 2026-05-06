import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    DataService,
    EnglishBingoClassDto,
    EnglishBingoWordItemDto,
} from '../services/data.service';
import { NotificationService } from '../services/notification.service';

const GAME_SECONDS = 180;

type GameEndReason = 'timer' | 'all-words' | 'board-full';

@Component({
    selector: 'app-english-bingo-play',
    standalone: true,
    imports: [CommonModule, RouterLink],
    host: {
        class: 'block w-full',
    },
    template: `
    <div style="width:100%; background-color:#1a1625; color:white; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; padding-bottom:20px; min-height:100vh; overflow:hidden;">
      <!-- Navigation Fine -->
      <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; background-color: rgba(0,0,0,0.6); border-bottom: 1px solid rgba(255,255,255,0.1); shrink-0;">
        <a routerLink="/" style="font-size: 9px; font-weight: 900; color: rgba(255,255,255,0.4); text-decoration: none; text-transform: uppercase; letter-spacing: 0.2em; display: flex; align-items: center; gap: 4px;">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            RETOUR
        </a>
        <button (click)="restart()" style="background: none; border: none; font-size: 9px; font-weight: 900; color: #d2f500; text-transform: uppercase; letter-spacing: 0.2em; cursor: pointer;">
          RECOMMENCER
        </button>
      </div>

      <!-- Bloc Central Miniature -->
      <div *ngIf="sessionLoaded && !loadError" style="width: 100%; max-width: 300px; display: flex; flex-direction: column; gap: 10px; padding: 15px 0;">
        
        <!-- Header Miniature -->
        <div style="background-color: #36318E; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
           <div style="padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                 <div style="width: 40px; height: 40px; border-radius: 100%; background-color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="font-size: 20px; font-weight: 950; color: #0f172a;">{{ currentWordIndex + 1 }}</span>
                 </div>
                 <div style="min-width: 0;">
                    <p style="font-size: 7px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; margin: 0;">MOT ACTUEL</p>
                    <h1 style="font-size: 16px; font-weight: 950; color: white; text-transform: uppercase; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                       {{ activeWordText }}
                    </h1>
                 </div>
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                 <button (click)="next()" style="background-color: #d2f500; border: none; color: #0f172a; font-weight: 950; text-transform: uppercase; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px;">
                    NEXT <svg style="width: 14px; height: 14px;" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                 </button>
                 <p style="font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.2); text-transform: uppercase; margin: 2px 0 0 0;">{{ words.length - currentWordIndex }} RESTANTS</p>
              </div>
           </div>
           <div style="padding: 0 12px 10px 12px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display:flex; gap:6px;">
                <button style="background-color: rgba(255,255,255,0.1); color: white; font-size: 9px; font-weight: 950; border: none; border-radius: 6px; padding: 5px 12px; text-transform: uppercase; cursor: pointer;">
                   WILDCARD
                </button>
              </div>
              <div style="font-size: 10px; font-weight: 950; color: #d2f500; background-color: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px;">{{ timerMmSs }}</div>
           </div>
        </div>

        <!-- Grille Miniature -->
        <div style="background-color: #2b2738; border-radius: 12px; overflow: hidden; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; border: 1px solid rgba(255,255,255,0.05);">
           <button
             type="button"
             *ngFor="let t of gridClasses; let i = index"
             (click)="onTileClick(t)"
             [disabled]="gameOver || !hasCurrentWord"
             style="position: relative; width: 100%; height: 95px; background-color: #353145; display: flex; flex-direction: column; align-items: center; justify-content: center; border: none; outline: none; padding: 5px; cursor: pointer;"
           >
             <div style="width: 100%; height: 65%; display: flex; align-items: center; justify-content: center; margin-bottom: 2px;">
                <img [src]="t.imageUrl" [alt]="t.label" 
                     style="max-width: 100%; max-height: 100%; object-fit: contain;"
                     [class.grayscale]="wordOnTile(t.id)" />
             </div>
             <span style="font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.5); text-transform: uppercase; text-align: center;">{{ t.label }}</span>
             
             <!-- Overlay word(s) linked to this tile -->
             <div *ngIf="wordOnTile(t.id) as wtext" style="position: absolute; inset: 0; background-color: rgba(26,22,37,0.92); z-index: 10; display: flex; align-items: center; justify-content: center; padding: 4px; text-align: center; backdrop-blur: 2px;">
                <span style="font-size: 10px; font-weight: 950; color: #d2f500; text-transform: uppercase;">{{ wtext }}</span>
             </div>
           </button>
        </div>

        <!-- Footbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.2); text-transform: uppercase;">
           <span>PREVIOUS</span>
           <span>#{{ currentWordIndex + 948 }}</span>
        </div>

        <!-- Progress -->
        <div style="width: 100%; height: 4px; background-color: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
           <div [style.width.%]="(assignment.size / gridClasses.length) * 100" style="height: 100%; background-color: #d2f500; transition: width 0.4s ease;"></div>
        </div>
      </div>

      <!-- Modal Fin Miniature (Résumé complet) -->
      <div *ngIf="gameOver" style="position: fixed; inset: 0; background-color: rgba(0,0,0,0.92); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-blur: 5px;">
        <div style="background-color: #36318E; padding: 20px; border-radius: 24px; text-align: center; width: 100%; max-width: 290px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); max-height: 85vh; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.1);">
           
           <div style="flex-shrink: 0; margin-bottom: 5px;">
             <h2 style="font-size: 18px; font-weight: 950; color: white; text-transform: uppercase; margin: 0;">{{ endTitle }}</h2>
             <div style="margin: 10px 0;">
                <p style="font-size: 32px; font-weight: 950; color: #d2f500; margin: 0; line-height: 1;">{{ scoreCount }}<span style="font-size: 16px; color: rgba(255,255,255,0.3);">/{{ gridClasses.length }}</span></p>
                <p style="font-size: 7px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-top: 4px; letter-spacing: 0.1em;">SCORE (TILES MATCHES)</p>
             </div>
           </div>

           <!-- Liste Détail Scrolable -->
           <div style="flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin: 10px 0; padding-right: 4px; scrollbar-width: thin;">
              <div *ngFor="let r of gameResults" style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                 <div style="text-align: left; min-width: 0;">
                    <p style="font-size: 10px; font-weight: 950; color: white; text-transform: uppercase; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ r.word }}</p>
                    <p style="font-size: 7px; font-weight: 950; color: rgba(255,255,255,0.3); text-transform: uppercase; margin: 0;">CASE: {{ r.tile }}</p>
                 </div>
                 <div style="flex-shrink:0; margin-left: 10px;">
                    <div *ngIf="r.isCorrect" style="width: 18px; height: 18px; border-radius: 100%; background-color: #d2f500; display: flex; align-items: center; justify-content: center;">
                       <svg style="width: 12px; height: 12px; color: #0f172a;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div *ngIf="!r.isCorrect" style="width: 18px; height: 18px; border-radius: 100%; background-color: #f43f5e; display: flex; align-items: center; justify-content: center;">
                       <svg style="width: 12px; height: 12px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                 </div>
              </div>
           </div>

           <button (click)="restart()" style="flex-shrink: 0; width: 100%; background-color: #d2f500; color: #0f172a; border: none; padding: 14px; border-radius: 16px; font-size: 11px; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: transform 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
             REJOUER MAINTENANT
           </button>
        </div>
      </div>
    </div>
    `,
})
export class EnglishBingoPlayComponent implements OnInit, OnDestroy {
    private readonly data = inject(DataService);
    private readonly notify = inject(NotificationService);

    gridClasses: EnglishBingoClassDto[] = [];
    words: EnglishBingoWordItemDto[] = [];
    loadError: string | null = null;

    /** Index du mot actuel (liste mélangée côté serveur). */
    currentWordIndex = 0;
    
    // CID -> WID (Une case a un mot, mais un mot peut être sur plusieurs cases)
    assignment = new Map<number, number>(); 
    gameResults: { word: string; tile: string; isCorrect: boolean; wordId: number; classId: number }[] = [];

    secondsLeft = GAME_SECONDS;
    gameOver = false;
    endReason: GameEndReason | null = null;
    private timerId: ReturnType<typeof setInterval> | null = null;

    ngOnInit(): void {
        this.loadSession();
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    get sessionLoaded(): boolean {
        return this.gridClasses.length > 0 && this.words.length > 0;
    }

    get hasCurrentWord(): boolean {
        return !this.gameOver && this.currentWordIndex < this.words.length;
    }

    get currentWord(): EnglishBingoWordItemDto | null {
        if (this.currentWordIndex >= this.words.length) {
            return null;
        }
        return this.words[this.currentWordIndex];
    }

    get timerMmSs(): string {
        const m = Math.floor(this.secondsLeft / 60);
        const s = this.secondsLeft % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    get activeWordText(): string {
        const w = this.currentWord;
        return w ? w.word : '—';
    }

    get endTitle(): string {
        switch (this.endReason) {
            case 'timer':
                return 'Temps écoulé';
            case 'all-words':
                return 'Bravo !';
            case 'board-full':
                return 'Plateau complet';
            default:
                return 'Partie terminée';
        }
    }

    get scoreCount(): number {
        return this.gameResults.filter(r => r.isCorrect).length;
    }

    loadSession(): void {
        this.clearTimer();
        this.loadError = null;
        this.gameOver = false;
        this.endReason = null;
        this.secondsLeft = GAME_SECONDS;
        this.assignment = new Map();
        this.currentWordIndex = 0;
        this.gridClasses = [];
        this.words = [];
        this.gameResults = [];
        this.data.englishBingoGameSession().subscribe({
            next: s => {
                this.gridClasses = s.gridClasses;
                this.words = s.words;
                if (!s.words.length || !s.gridClasses.length) {
                    this.loadError = 'Pas assez de données pour jouer.';
                    return;
                }
                this.startTimer();
            },
            error: err => {
                const body = err?.error;
                const msg =
                    (typeof body?.error === 'string' && body.error) ||
                    (typeof body?.message === 'string' && body.message) ||
                    '';
                this.loadError =
                    typeof msg === 'string' && msg.length
                        ? msg
                        : 'Impossible de charger la partie. Vérifiez l’API et le contenu admin.';
            },
        });
    }

    private startTimer(): void {
        this.clearTimer();
        this.timerId = setInterval(() => {
            if (this.gameOver) return;
            this.secondsLeft--;
            if (this.secondsLeft <= 0) {
                this.secondsLeft = 0;
                this.finishGame('timer');
            }
        }, 1000);
    }

    private clearTimer(): void {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    private finishGame(reason: GameEndReason): void {
        if (this.gameOver) return;
        this.gameOver = true;
        this.endReason = reason;
        this.clearTimer();
    }

    restart(): void {
        this.loadSession();
    }

    next(): void {
        if (this.gameOver || !this.hasCurrentWord) return;
        this.currentWordIndex++;
        if (this.currentWordIndex >= this.words.length) {
            this.finishGame('all-words');
        }
    }

    onTileClick(t: EnglishBingoClassDto): void {
        if (this.gameOver) return;
        const cw = this.currentWord;
        if (!cw) return;
        const cid = t.id;

        const existingWordId = this.assignment.get(cid);
        if (existingWordId != null) {
            if (existingWordId === cw.wordId) {
                this.assignment.delete(cid);
                this.gameResults = this.gameResults.filter(r => r.classId !== cid);
                this.assignment = new Map(this.assignment);
                this.notify.info('Mot retiré.', '');
            } else {
                this.notify.warning('Cette case est déjà prise.', 'Occupé');
            }
            return;
        }

        this.assignment.set(cid, cw.wordId);
        this.assignment = new Map(this.assignment);

        this.data.englishBingoCheck(cw.wordId, [cid]).subscribe(res => {
            this.gameResults = this.gameResults.filter(r => r.classId !== cid);
            this.gameResults.push({
                word: cw.word,
                tile: t.label,
                isCorrect: res.perfectMatch,
                wordId: cw.wordId,
                classId: cid
            });
        });

        if (this.assignment.size >= this.gridClasses.length) {
            this.finishGame('board-full');
        }
    }

    wordOnTile(classId: number): string | null {
        const wid = this.assignment.get(classId);
        if (wid == null) return null;
        const w = this.words.find(word => word.wordId === wid);
        return w ? w.word : null;
    }

    isTileActive(classId: number): boolean {
        return false;
    }
}
