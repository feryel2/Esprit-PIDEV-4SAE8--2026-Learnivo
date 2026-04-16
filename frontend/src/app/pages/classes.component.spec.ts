import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassesComponent } from './classes.component';
import { DataService, PlatformClass } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let fixture: ComponentFixture<ClassesComponent>;

  const mockClass: PlatformClass = {
    id: 1, title: 'Math Basics', instructor: 'Dr. Jane', day: 'Monday', time: '10:00 AM',
    duration: '2h', level: 'Beginner', type: 'Live Class', status: 'active',
    maxCapacity: 10, enrolled: [], attendance: [], materials: [], recurring: true, link: 'https://meet.google.com/test'
  };

  let mockDataService: any;
  let mockAuthService: any;
  let joinCalled = false;

  beforeEach(async () => {
    joinCalled = false;
    
    mockDataService = {
      classes: signal([mockClass]),
      joinClass: () => { joinCalled = true; return null; } // returns null on success
    };

    mockAuthService = {
      getCurrentUser: () => ({ email: 'student@test.com', firstName: 'Test', lastName: 'User' })
    };

    await TestBed.configureTestingModule({
      imports: [ClassesComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should list classes and calculate capacity fraction', () => {
    expect(component).toBeTruthy();
    expect(component.filtered().length).toBe(1);
    expect(component.enrolledFrac(mockClass)).toBe(0);
  });

  it('should filter correctly by day', () => {
    component.filterDay.set('Tuesday');
    expect(component.filtered().length).toBe(0);

    component.filterDay.set('Monday');
    expect(component.filtered().length).toBe(1);
  });

  it('should auto-fill modal from auth service on opening', () => {
    component.openJoinModal(mockClass);
    expect(component.showModal()).toBe(true);
    expect(component.joinEmail).toBe('student@test.com');
    expect(component.joinName).toBe('Test User');
    expect(component.joinStep()).toBe('form');
  });

  it('should block continuing if email is invalid', () => {
    component.openJoinModal(mockClass);
    component.joinEmail = 'not-an-email';
    component.goToJoinConfirm();
    
    expect(component.joinError()).toBe('Please enter a valid email address.');
    expect(component.joinStep()).toBe('form');
  });

  it('should proceed to confirm screen and join successfully', () => {
    component.openJoinModal(mockClass);
    component.joinEmail = 'valid@test.com';
    component.joinName = 'Student Valid';
    
    component.goToJoinConfirm();
    expect(component.joinError()).toBeNull();
    expect(component.joinStep()).toBe('confirm');

    component.submitJoin();
    expect(joinCalled).toBe(true);
    expect(component.joinStep()).toBe('success');
    expect(component.enrolledMeetLink()).toBe('https://meet.google.com/test');
    expect(component.isAlreadyJoined(mockClass)).toBe(true);
  });
});
