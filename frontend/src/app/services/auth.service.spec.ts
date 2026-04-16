import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthResponse, Role } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store tokens locally', () => {
    const mockResponse: AuthResponse = {
      token: 'jwt-1234',
      userId: 1,
      email: 'test@test.com',
      role: Role.STUDENT
    };

    service.login({ email: 'test@test.com', password: 'password' }).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('jwt-1234');
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual({
      id: 1,
      email: 'test@test.com',
      role: Role.STUDENT
    });
  });

  it('should clear stored items on logout', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('user', '{}');
    localStorage.setItem('reg_comp_123', 'true');
    localStorage.setItem('learnivo_voter_email', 'v@v.com');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('reg_comp_123')).toBeNull();
    expect(localStorage.getItem('learnivo_voter_email')).toBeNull();
  });

  it('should correctly determine authentication state', () => {
    expect(service.isAuthenticated()).toBe(false);
    localStorage.setItem('token', 'stub');
    expect(service.isAuthenticated()).toBe(true);
  });
});
