import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from './api-config';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private config = inject(API_CONFIG);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    // prepend base URL for relative paths
    if (!url.match(/^https?:\/\//)) {
      url = this.config.baseUrl + url;
    }
    const cloned = req.clone({ url });
    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        // basic global error handling
        console.error('HTTP error', err);
        return throwError(() => err);
      })
    );
  }
}
