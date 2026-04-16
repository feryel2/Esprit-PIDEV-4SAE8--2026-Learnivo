import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SpeechService, SpeechSentence, SpeechEvaluateResponse } from './speech.service';

describe('SpeechService', () => {
  let service: SpeechService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpeechService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SpeechService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a random sentence without difficulty param', () => {
    const mockSentence: SpeechSentence = { id: 1, text: 'Hello World', difficulty: 'easy', category: 'basic' };

    service.getRandomSentence().subscribe(res => {
      expect(res).toEqual(mockSentence);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/speech/sentence');
    expect(req.request.method).toBe('GET');
    req.flush(mockSentence);
  });

  it('should get a random sentence with difficulty param', () => {
    const mockSentence: SpeechSentence = { id: 2, text: 'Hard sentence here', difficulty: 'hard', category: 'advanced' };

    service.getRandomSentence('hard').subscribe(res => {
      expect(res).toEqual(mockSentence);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/speech/sentence?difficulty=hard');
    expect(req.request.method).toBe('GET');
    req.flush(mockSentence);
  });

  it('should evaluate speech transcript correctly', () => {
    const mockResponse: SpeechEvaluateResponse = {
      originalText: 'Hello World',
      transcript: 'Hello World',
      score: 100,
      label: 'Perfect',
      feedback: 'Great job!',
      wordResults: [{ expected: 'Hello', heard: 'Hello', correct: true }]
    };

    service.evaluate(1, 'Hello World', 'test@test.com').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/speech/evaluate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      sentenceId: 1,
      transcript: 'Hello World',
      userEmail: 'test@test.com'
    });
    req.flush(mockResponse);
  });
});
