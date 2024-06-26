import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { devEnvironment } from 'src/environments/environment.development';
import { prodEnvironment } from 'src/environments/environment.production';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  API_USERS = '/users';
  API_RECIPES = '/recipes';

  constructor(private errorService: ErrorService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const environment = isDevMode() ? devEnvironment : prodEnvironment;
    const { usersApiUrl, recipesApiUrl } = environment;

    if (
      req.url.startsWith(this.API_USERS) ||
      req.url.startsWith(this.API_RECIPES)
    ) {
      req = req.clone({
        url: req.url.startsWith(this.API_USERS)
          ? req.url.replace(this.API_USERS, usersApiUrl)
          : req.url.replace(this.API_RECIPES, recipesApiUrl),
        withCredentials: true,
      });
    }

    return next.handle(req).pipe(
      tap(() => {

        console.log(req.headers);
        
      }),
      catchError((err) => {
        this.errorService.setError(err);

        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
        }

        if (err.error.message === 'Invalid recipe ID!') {
          this.router.navigate(['/']);
        }

        return [err];
      })
    );
  }
}

export const appInterceptorProvider: Provider = {
  useClass: AppInterceptor,
  multi: true,
  provide: HTTP_INTERCEPTORS,
};
