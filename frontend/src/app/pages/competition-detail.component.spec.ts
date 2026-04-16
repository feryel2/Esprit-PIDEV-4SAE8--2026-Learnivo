import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompetitionDetailComponent } from './competition-detail.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('CompetitionDetailComponent', () => {
  let component: CompetitionDetailComponent;
  let fixture: ComponentFixture<CompetitionDetailComponent>;

  const mockCompetition = {
    id: 1, title: 'Code Challenge', slug: 'code-challenge',
    status: 'upcoming', deadline: '2050-12-31T23:59:59', // Future mock date
    maxParticipants: 10,
    participants: [{ name: 'User 1', email: 'u1@ex.com' }, { name: 'User 2', email: 'u2@ex.com' }]
  };

  let registerCalled = false;

  const mockDataService = {
    competitions: signal([mockCompetition]),
    getAnnouncements: () => of([]),
    getVoteStats: () => of({ likes: 5, dislikes: 1, score: 4, userVote: null }),
    registerForCompetition: () => { registerCalled = true; return null; }
  };

  const mockAuthService = {
    isAuthenticated: () => false,
    getCurrentUser: () => null
  };

  const mockActivatedRoute = {
    params: of({ slug: 'code-challenge' })
  };

  beforeEach(async () => {
    registerCalled = false;
    await TestBed.configureTestingModule({
      imports: [CompetitionDetailComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear(); // Ensure clean state across tests
  });

  it('should create and load the correct competition by slug', () => {
    expect(component).toBeTruthy();
    expect(component.comp()?.title).toBe('Code Challenge');
  });

  it('should correctly calculate remaining spots and capacity percentage', () => {
    // maxParticipants is 10, and 2 participants mocked
    expect(component.spotsLeft()).toBe(8);
    expect(component.capacityPct()).toBe(20);
  });

  it('should initialize deadline check as false since mock date is in 2050', () => {
    expect(component.isDeadlinePassed()).toBe(false);
  });

  it('should flag already registered if local storage exists', () => {
    localStorage.setItem(`reg_comp_1`, 'true');
    // Force ngOnInit again
    component.ngOnInit();
    expect(component.alreadyRegistered()).toBe(true);
  });

  it('should call register on submitRegistration', () => {
    // Fill out form
    component.regName = 'John Doe';
    component.regEmail = 'john@example.com';
    component.regPhone = '12345678';
    
    component.submitRegistration();
    
    expect(registerCalled).toBe(true);
  });
});
