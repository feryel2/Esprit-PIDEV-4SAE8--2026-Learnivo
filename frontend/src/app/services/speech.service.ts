import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpeechSentence {
  id: number;
  text: string;
  difficulty: string;
  category: string;
}

export interface WordResult {
  expected: string;
  heard: string;
  correct: boolean;
}

export interface SpeechEvaluateResponse {
  originalText: string;
  transcript: string;
  score: number;
  label: string;
  feedback: string;
  wordResults: WordResult[];
}

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private readonly api = 'http://localhost:8081/api/speech';

  constructor(private http: HttpClient) {}

  getRandomSentence(difficulty?: string): Observable<SpeechSentence> {
    let params = new HttpParams();
    if (difficulty) params = params.set('difficulty', difficulty);
    return this.http.get<SpeechSentence>(`${this.api}/sentence`, { params });
  }

  evaluate(sentenceId: number, transcript: string, userEmail?: string): Observable<SpeechEvaluateResponse> {
    return this.http.post<SpeechEvaluateResponse>(`${this.api}/evaluate`, {
      sentenceId,
      transcript,
      userEmail: userEmail ?? '',
    });
  }
}
