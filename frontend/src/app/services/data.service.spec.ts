import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DataService, Competition, PlatformClass } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockCompetitions: Competition[] = [
    {
      id: 1, title: 'Code Challenge', description: 'desc', image: 'img.jpg',
      slug: 'code-challenge', status: 'ongoing', deadline: '2025-12-31',
      prize: '$500', category: 'Coding', participants: []
    }
  ];

  const mockClasses: PlatformClass[] = [
    {
      id: 1, title: 'Math 101', instructor: 'Dr. John', day: 'Monday',
      time: '10:00 AM', duration: '2h', level: 'Beginner', type: 'Live', status: 'active'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no outstanding requests
    httpMock.verify();
  });

  it('should be created and load initial data', () => {
    expect(service).toBeTruthy();

    // The constructor calls loadClasses() and loadCompetitions() automatically
    const classReq = httpMock.expectOne('http://localhost:8081/api/classes');
    expect(classReq.request.method).toBe('GET');
    classReq.flush(mockClasses);

    const compReq = httpMock.expectOne('http://localhost:8081/api/competitions');
    expect(compReq.request.method).toBe('GET');
    compReq.flush(mockCompetitions);

    // Verify signal state has been updated
    expect(service.classes().length).toBe(1);
    expect(service.classes()[0].title).toBe('Math 101');

    expect(service.competitions().length).toBe(1);
    expect(service.competitions()[0].slug).toBe('code-challenge');
  });

  it('should retrieve vote stats using mocked HTTP', () => {
    // Flush initial requests
    httpMock.expectOne('http://localhost:8081/api/classes').flush([]);
    httpMock.expectOne('http://localhost:8081/api/competitions').flush([]);

    const mockStats = { likes: 10, dislikes: 2, score: 8, userVote: 'LIKE' as const };
    
    let result: any;
    service.getVoteStats(1, 'test@example.com').subscribe(res => result = res);

    const req = httpMock.expectOne('http://localhost:8081/api/competitions/1/votes?email=test%40example.com');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);

    expect(result).toEqual(mockStats);
  });

  it('should submit a project successfully', () => {
    // Flush initial requests
    httpMock.expectOne('http://localhost:8081/api/classes').flush([]);
    httpMock.expectOne('http://localhost:8081/api/competitions').flush([]);

    const mockParticipant = { 
      id: 99, name: 'Hazem', email: 'hazem@example.com', 
      status: 'registered' as const, submissionUrl: 'http://myproject.com' 
    };

    let result: any;
    service.submitProject(1, 'hazem@example.com', 'http://myproject.com', 'Done!', 100, 0).subscribe(res => {
      result = res;
    });

    const req = httpMock.expectOne('http://localhost:8081/api/competitions/1/submit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'hazem@example.com',
      submissionUrl: 'http://myproject.com',
      submissionNotes: 'Done!',
      score: 100,
      errorsCount: 0
    });
    
    req.flush(mockParticipant);

    expect(result).toEqual(mockParticipant);
  });
});
