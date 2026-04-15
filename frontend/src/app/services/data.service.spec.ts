import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);

    flushInitialLoads();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should map course recommendations from the backend API', async () => {
    const training = {
      id: 4,
      title: 'Business English for Meetings and Presentations',
      description: 'Course description',
      type: 'Blended course' as const,
      status: 'Published' as const,
      level: 'Intermediate',
      image: '/images/training-1.jpg',
      banner: '/images/course-banner.jpg',
      slug: 'business-english',
      action: 'Enroll now',
      category: 'Business English',
      chapters: 3,
      duration: '5 weeks',
      chaptersData: []
    };

    const promise = service.getCourseRecommendations(training, { limit: 2 });

    const request = httpMock.expectOne('http://localhost:8080/api/courses/recommendations/ai');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.basedOnCourseId).toBe(4);
    expect(request.request.body.limit).toBe(2);

    request.flush({
      source: 'LOCAL_FALLBACK',
      strategy: 'rule-based-ranking',
      requestedLimit: 2,
      recommendations: [
        {
          course: {
            id: 7,
            title: 'English Grammar Bootcamp for Real Communication',
            description: 'Improve grammar through communication.',
            type: 'Blended course',
            status: 'Published',
            level: 'Intermediate',
            difficultyScore: 62,
            difficultyLabel: 'Intermediate',
            image: '/images/training-2.jpg',
            banner: '/images/course-banner.jpg',
            slug: 'grammar-bootcamp',
            action: 'Enroll now',
            instructor: 'Hannah Reed',
            category: 'Grammar',
            chapters: 3,
            duration: '5 weeks',
            chaptersData: []
          },
          reason: 'matches your preferred category.',
          matchScore: 96.5
        }
      ]
    });

    const result = await promise;
    expect(result.source).toBe('LOCAL_FALLBACK');
    expect(result.recommendations.length).toBe(1);
    expect(result.recommendations[0].course.title).toContain('Grammar');
    expect(result.recommendations[0].matchScore).toBe(96.5);
  });

  function flushInitialLoads() {
    const initialRequests = httpMock.match((request) =>
      request.url === 'http://localhost:8080/api/courses' || request.url === 'http://localhost:8080/api/quizzes'
    );
    for (const request of initialRequests) {
      request.flush([]);
    }
  }
});
