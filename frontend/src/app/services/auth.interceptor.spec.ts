import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should attach the bearer token from localStorage', () => {
    localStorage.setItem('learnivo.auth-user', JSON.stringify({ token: 'demo-token' }));

    const httpClient = TestBed.inject(HttpClient);
    httpClient.get('/api/demo').subscribe();

    const request = httpMock.expectOne('/api/demo');
    expect(request.request.headers.get('Authorization')).toBe('Bearer demo-token');
    request.flush({});
  });
});
