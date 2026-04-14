import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SpeechService, SpeechSentence, SpeechEvaluateResponse, WordResult } from '../services/speech.service';

@Component({
  selector: 'app-speech-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './speech-test.component.html',
  styleUrls: ['./speech-test.component.css'],
})
export class SpeechTestComponent implements OnInit, OnDestroy {

  // ── State ──────────────────────────────────────────────────────────────────
  sentence: SpeechSentence | null = null;
  transcript  = '';
  result: SpeechEvaluateResponse | null = null;
  isRecording    = false;
  isLoadingSentence = false;
  isEvaluating   = false;
  errorMsg       = '';
  difficulty     = 'EASY';
  recordingDots  = '';

  // ── SpeechRecognition ──────────────────────────────────────────────────────
  private recognition: any = null;
  private dotInterval: any = null;

  // switchMap subject so rapid "new sentence" clicks only fire one request
  private sentenceLoad$ = new Subject<string>();
  private sentenceSub!: Subscription;

  readonly difficulties = ['EASY', 'MEDIUM', 'HARD'];

  constructor(private speechService: SpeechService, private zone: NgZone) {}

  ngOnInit(): void {
    this.sentenceSub = this.sentenceLoad$
      .pipe(switchMap(diff => this.speechService.getRandomSentence(diff)))
      .subscribe({
        next: s => this.zone.run(() => {
          this.sentence = s;
          this.isLoadingSentence = false;
          this.errorMsg = '';
        }),
        error: () => this.zone.run(() => {
          this.isLoadingSentence = false;
          this.errorMsg = 'Could not load sentence — is the competition service running?';
        }),
      });

    this.loadSentence();
  }

  ngOnDestroy(): void {
    this.stopRecognition();
    this.sentenceSub?.unsubscribe();
  }

  // ── Load a random sentence ─────────────────────────────────────────────────
  loadSentence(): void {
    if (this.isLoadingSentence) return;
    this.isLoadingSentence = true;
    this.result     = null;
    this.transcript = '';
    this.errorMsg   = '';
    this.sentenceLoad$.next(this.difficulty);
  }

  changeDifficulty(d: string): void {
    if (this.isRecording || this.isLoadingSentence) return;
    this.difficulty = d;
    this.loadSentence();
  }

  // ── Start / Stop recording ─────────────────────────────────────────────────
  toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecognition();
    } else {
      this.startRecognition();
    }
  }

  private startRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition
                           || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.errorMsg = 'Speech Recognition not supported. Please use Chrome or Edge.';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    let finalTranscript = '';

    this.recognition.onstart = () => this.zone.run(() => {
      this.isRecording   = true;
      this.transcript    = '';
      this.result        = null;
      this.errorMsg      = '';
      finalTranscript    = '';
      this.animateDots();
    });

    this.recognition.onresult = (event: any) => this.zone.run(() => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interim += t;
        }
      }
      this.transcript = finalTranscript + interim;
    });

    this.recognition.onerror = (event: any) => this.zone.run(() => {
      if (event.error === 'no-speech') return;
      this.errorMsg    = `Microphone error: ${event.error}. Please allow microphone access.`;
      this.isRecording = false;
      this.stopDots();
    });

    this.recognition.onend = () => this.zone.run(() => {
      this.isRecording = false;
      this.stopDots();
      const captured = (finalTranscript || this.transcript).trim();
      if (captured && this.sentence) {
        this.transcript = captured;
        this.evaluate();
      }
    });

    this.recognition.start();
  }

  private stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isRecording = false;
    this.stopDots();
  }

  // ── Evaluate ───────────────────────────────────────────────────────────────
  evaluate(): void {
    if (!this.sentence || !this.transcript.trim() || this.isEvaluating) return;
    this.isEvaluating = true;
    this.errorMsg     = '';
    this.speechService.evaluate(this.sentence.id, this.transcript).subscribe({
      next: r => {
        this.result       = r;
        this.isEvaluating = false;
      },
      error: err => {
        this.isEvaluating = false;
        this.errorMsg     = `Evaluation failed (${err.status ?? 'network error'}). Check that competition-service is running.`;
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  get scoreColor(): string {
    if (!this.result) return '';
    if (this.result.score >= 90) return 'text-emerald-500';
    if (this.result.score >= 75) return 'text-green-500';
    if (this.result.score >= 60) return 'text-yellow-500';
    if (this.result.score >= 40) return 'text-orange-500';
    return 'text-red-500';
  }

  get scoreBarColor(): string {
    if (!this.result) return 'bg-gray-300';
    if (this.result.score >= 90) return 'bg-emerald-500';
    if (this.result.score >= 75) return 'bg-green-500';
    if (this.result.score >= 60) return 'bg-yellow-400';
    if (this.result.score >= 40) return 'bg-orange-400';
    return 'bg-red-500';
  }

  get labelEmoji(): string {
    const map: Record<string, string> = {
      'Excellent': '🏆', 'Very Good': '⭐', 'Good': '👍', 'Fair': '📖', 'Poor': '💪'
    };
    return this.result ? (map[this.result.label] ?? '') : '';
  }

  trackWord(_: number, w: WordResult) { return w.expected; }

  private animateDots(): void {
    let count = 0;
    this.dotInterval = setInterval(() => {
      count = (count + 1) % 4;
      this.recordingDots = '.'.repeat(count);
    }, 400);
  }

  private stopDots(): void {
    if (this.dotInterval) { clearInterval(this.dotInterval); this.dotInterval = null; }
    this.recordingDots = '';
  }
}
