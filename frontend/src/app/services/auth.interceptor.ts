import { HttpInterceptorFn } from '@angular/common/http';

const storageKey = 'learnivo.auth-user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const rawUser = localStorage.getItem(storageKey);
  if (!rawUser) {
    return next(req);
  }

  try {
    const parsed = JSON.parse(rawUser) as { token?: string };
    if (!parsed.token) {
      return next(req);
    }

    return next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${parsed.token}`
      }
    }));
  } catch {
    localStorage.removeItem(storageKey);
    return next(req);
  }
};
