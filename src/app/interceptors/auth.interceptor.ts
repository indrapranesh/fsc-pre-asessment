import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DynamicsAuthService } from '../services/dynamics-auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: DynamicsAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if(localStorage.getItem('ACCESS_TOKEN')) {
        if(err.status === 401) {
          this.refresh();
        }
      }
      return throwError(new Error(err));
    }));
  }

  async refresh() {
    this.authService.refresh();
    window.location.reload();
  }
}
