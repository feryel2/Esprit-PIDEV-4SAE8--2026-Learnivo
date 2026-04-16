import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompetitionsComponent } from './competitions.component';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('CompetitionsComponent', () => {
  let component: CompetitionsComponent;
  let fixture: ComponentFixture<CompetitionsComponent>;

  const mockDataService = {
    competitions: signal([
      { id: 1, title: 'Test Comp 1', category: 'Coding', status: 'ongoing', slug: 'comp-1' }
    ]),
    trainings: signal([]),
    exercises: signal([]),
    getCompetitionRanking: () => of([]),
    getIntelligentProfile: () => of(null)
  };

  const mockAuthService = {
    getCurrentUser: () => ({ email: 'hazem@example.com', name: 'Hazem' })
  };

  const mockActivatedRoute = {
    queryParams: of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionsComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with "all" tab by default', () => {
    expect(component.activeTab()).toBe('all');
  });

  it('should display competitions from DataService', () => {
    const comps = component.filteredCompetitions;
    expect(comps.length).toBe(1);
    expect(comps[0].title).toBe('Test Comp 1');
  });

  it('should change active tab when set explicitly', () => {
    component.activeTab.set('ranking');
    expect(component.activeTab()).toBe('ranking');
  });

  it('should filter competitions based on category', () => {
    // Initial category filter is 'All'
    expect(component.selectedCategory()).toBe('All');
    
    // Test filter correctly updates
    component.selectedCategory.set('Math');
    
    // Should be empty since the mock comp is "Coding"
    fixture.detectChanges();
    expect(component.filteredCompetitions.length).toBe(0);
    
    // Change back to coding
    component.selectedCategory.set('Coding');
    expect(component.filteredCompetitions.length).toBe(1);
  });
});
