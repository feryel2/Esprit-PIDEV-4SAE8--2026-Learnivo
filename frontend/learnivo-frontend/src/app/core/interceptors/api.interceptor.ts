import { Injectable, inject, signal } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading = signal(false);
  private count = 0;
  start() { this.count++; this.loading.set(true); }
  stop()  { if (--this.count <= 0) { this.count = 0; this.loading.set(false); } }
}

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private loader = inject(LoadingService);
  private snack  = inject(MatSnackBar);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.start();
    const cloned = req.clone({
      setHeaders: { 'Content-Type': 'application/json' }
    });
    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message ?? err.message ?? 'An error occurred';
        this.snack.open(msg, 'Close', { duration: 4000, panelClass: 'snack-error' });
        return throwError(() => err);
      }),
      finalize(() => this.loader.stop())
    );
  }
}
