import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCompetitionsComponent } from './admin-competitions.component';
import { DataService } from '../../services/data.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('AdminCompetitionsComponent', () => {
  let component: AdminCompetitionsComponent;
  let fixture: ComponentFixture<AdminCompetitionsComponent>;

  let mockDataService: any;

  let addCalled = false;
  let updateCalled = false;
  let deleteCalled = false;
  let publishCalled = false;

  beforeEach(async () => {
    addCalled = false;
    updateCalled = false;
    deleteCalled = false;
    publishCalled = false;

    mockDataService = {
      competitions: signal([
        { 
          id: 1, title: 'Sample Competition', description: 'Desc', 
          status: 'ongoing', slug: 'sample', maxParticipants: 50, participants: []
        }
      ]),
      addCompetition: () => { addCalled = true; },
      updateCompetition: () => { updateCalled = true; },
      deleteCompetition: () => { deleteCalled = true; },
      publishResults: () => {
        publishCalled = true;
        return of({ 
          id: 1, title: 'Sample Competition', status: 'completed', resultsPublished: true 
        });
      },
      getAnnouncements: () => of([]),
      loadCompetitions: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [AdminCompetitionsComponent],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Teardown intervals
    component.ngOnDestroy && component.ngOnDestroy();
  });

  it('should create the component and load stats', () => {
    expect(component).toBeTruthy();
    expect(component.stats().length).toBeGreaterThan(0);
    expect(component.filtered().length).toBe(1);
    expect(component.filtered()[0].title).toBe('Sample Competition');
  });

  it('should open create modal with empty form', () => {
    expect(component.showModal()).toBe(false);
    component.openCreate();
    expect(component.showModal()).toBe(true);
    expect(component.isEditing()).toBe(false);
    expect(component.form.title).toBe('');
  });

  it('should prevent save if form is invalid', () => {
    component.openCreate();
    // Empty form by default
    component.save();
    expect(addCalled).toBe(false);
  });

  it('should allow save if form is fully valid for a new competition', () => {
    component.openCreate();
    
    // Future dates
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const futureDate1 = new Date(Date.now() - tzOffset + 86400000).toISOString().slice(0, 16); // +1 day
    const futureDate2 = new Date(Date.now() - tzOffset + 86400000 * 2).toISOString().slice(0, 16); // +2 days

    component.form.title = 'New Code Jam';
    component.form.description = 'This is a long description to pass validation of length 20 characters.';
    component.form.prize = 'MacBook Pro';
    component.form.startDate = futureDate1;
    component.form.deadline = futureDate2;
    component.form.maxParticipants = 20;
    
    expect(component.isFormValid()).toBe(true);
    
    component.save();
    expect(addCalled).toBe(true);
    expect(component.showModal()).toBe(false);
  });

  it('should call updateCompetition when editing an existing competition', () => {
    const comp = component.filtered()[0];
    component.openEdit(comp);
    expect(component.isEditing()).toBe(true);
    expect(component.showModal()).toBe(true);
    expect(component.editId()).toBe(1);

    // Mock form to be valid
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const futureDate1 = new Date(Date.now() - tzOffset + 86400000).toISOString().slice(0, 16);
    const futureDate2 = new Date(Date.now() - tzOffset + 86400000 * 2).toISOString().slice(0, 16);

    component.form.title = 'Updated Title';
    component.form.description = 'Valid description length over 20 chars.';
    component.form.prize = 'Updated Prize';
    component.form.startDate = futureDate1;
    component.form.deadline = futureDate2;
    component.form.maxParticipants = 100;

    component.save();
    expect(updateCalled).toBe(true);
  });

  it('should call delete competition after confirm', () => {
    const comp = component.filtered()[0];
    component.confirmDelete(comp);
    expect(component.deleteTarget()?.id).toBe(1);
    
    component.doDelete();
    expect(deleteCalled).toBe(true);
  });
});
