import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DynamicsAuthService } from '../services/dynamics-auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: DynamicsAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if(err.status === 401) {
        this.authService.refresh();
      }
      return Observable.throw(err);
    }));
  }
}
