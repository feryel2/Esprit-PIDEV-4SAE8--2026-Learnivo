import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingsComponent } from './trainings.component';
import { DataService } from '../services/data.service';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TrainingsComponent', () => {
  let component: TrainingsComponent;
  let fixture: ComponentFixture<TrainingsComponent>;

  let mockDataService: any;

  const mockTrainings: any[] = [
    {
      id: "1", title: "Angular Basics", instructor: "John Doe",
      rating: 4.5, students: "1K", level: "Beginner", duration: "10h",
      price: 1500, type: "Blended training", slug: "angular-basics"
    },
    {
      id: "2", title: "Advanced React", instructor: "Jane Smith",
      rating: 4.9, students: "500", level: "Advanced", duration: "20h",
      price: 1800, type: "Live classes", slug: "advanced-react"
    }
  ];

  beforeEach(async () => {
    mockDataService = {
      trainings: signal(mockTrainings)
    };

    await TestBed.configureTestingModule({
      imports: [TrainingsComponent], // Standalone component
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and load all trainings when filters are default', () => {
    expect(component).toBeTruthy();
    expect(component.filteredTrainings().length).toBe(2);
  });

  it('should filter trainings by search term', () => {
    component.search.set('react');
    expect(component.filteredTrainings().length).toBe(1);
    expect(component.filteredTrainings()[0].title).toBe('Advanced React');
  });

  it('should filter trainings by type', () => {
    component.typeFilter.set('Live');
    expect(component.filteredTrainings().length).toBe(1);
    expect(component.filteredTrainings()[0].type).toBe('Live classes');
  });

  it('should filter trainings by level through toggle', () => {
    // Add level array filter
    component.toggleLevel('Advanced');
    expect(component.levelFilters()).toEqual(['Advanced']);
    expect(component.filteredTrainings().length).toBe(1);
    expect(component.filteredTrainings()[0].level).toBe('Advanced');

    // Remove level array filter
    component.toggleLevel('Advanced');
    expect(component.levelFilters().length).toBe(0);
    expect(component.filteredTrainings().length).toBe(2);
  });

  it('should filter trainings by price range', () => {
    component.priceRange.set(1600); // Excludes Advanced React (1800)
    expect(component.filteredTrainings().length).toBe(1);
    expect(component.filteredTrainings()[0].title).toBe('Angular Basics');
  });

  it('should reset all filters', () => {
    component.search.set('dummy');
    component.typeFilter.set('Live');
    component.priceRange.set(10);
    component.levelFilters.set(['Advanced']);
    
    component.resetFilters();
    
    expect(component.search()).toBe('');
    expect(component.typeFilter()).toBe('All');
    expect(component.priceRange()).toBe(2000);
    expect(component.levelFilters()).toEqual([]);
    expect(component.filteredTrainings().length).toBe(2);
  });

  it('should update current page', () => {
    component.onPageChange(2);
    expect(component.currentPage()).toBe(2);
  });
});
