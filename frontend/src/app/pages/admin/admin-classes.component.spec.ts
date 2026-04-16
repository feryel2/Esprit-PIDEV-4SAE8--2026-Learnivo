import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClassesComponent } from './admin-classes.component';
import { DataService, PlatformClass } from '../../services/data.service';
import { signal } from '@angular/core';

describe('AdminClassesComponent', () => {
  let component: AdminClassesComponent;
  let fixture: ComponentFixture<AdminClassesComponent>;

  let mockDataService: any;
  const mockClass: PlatformClass = {
    id: 1, title: 'Math 101', instructor: 'Bob', day: 'Monday', time: '10:00AM',
    duration: '2h', level: 'Beginner', type: 'Live Class', status: 'active',
    maxCapacity: 20, enrolled: [], attendance: [], materials: [], recurring: true
  };

  let addCalled = false;
  let updateCalled = false;
  let deleteCalled = false;

  beforeEach(async () => {
    addCalled = false;
    updateCalled = false;
    deleteCalled = false;

    mockDataService = {
      classes: signal([mockClass]),
      addClass: () => { addCalled = true; },
      updateClass: () => { updateCalled = true; },
      deleteClass: () => { deleteCalled = true; }
    };

    await TestBed.configureTestingModule({
      imports: [AdminClassesComponent],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should list classes and open creation modal automatically', () => {
    expect(component).toBeTruthy();
    expect(component.filtered().length).toBe(1);
    
    component.openCreate();
    expect(component.showModal()).toBe(true);
    expect(component.isEditing()).toBe(false);
  });

  it('should validate before adding a new class', () => {
    component.openCreate();
    // Leave required fields blank
    component.save();
    expect(addCalled).toBe(false);

    // Fill fields
    component.form.title = 'New Class';
    component.form.instructor = 'Alice';
    component.form.time = '2:00 PM';
    component.save();

    expect(addCalled).toBe(true);
  });

  it('should update class on edit', () => {
    component.openEdit(mockClass);
    expect(component.isEditing()).toBe(true);
    
    component.form.title = 'Updated Title';
    component.save();
    
    expect(updateCalled).toBe(true);
  });

  it('should confirm and execute deletion', () => {
    component.confirmDelete(mockClass);
    expect(component.deleteTarget()).toEqual(mockClass);

    component.doDelete();
    expect(deleteCalled).toBe(true);
  });

  it('should correctly select class and save notes', () => {
    component.select(mockClass);
    expect(component.selected()).toEqual(mockClass);
    expect(component.activeTab()).toBe('Enrolled');
    
    component.notesText = 'New instructor notes';
    component.saveNotes();
    expect(updateCalled).toBe(true);
  });
});
