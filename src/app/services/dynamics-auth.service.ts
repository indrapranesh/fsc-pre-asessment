import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicsAuthService {

  constructor(private http: HttpClient) { }

  authenticate() {
    return this.http.get(environment.BACKEND_URL).subscribe((res: any) => {
      if(res.access_token) {
        localStorage.setItem('ACCESS_TOKEN', res.access_token);
        localStorage.setItem('REFRESH_TOKEN', res.refresh_token);
      }
    });
  }

  refresh() {
    let refreshToken = localStorage.getItem('REFRESH_TOKEN');
    let params = {
      refresh_token: refreshToken
    }
    return this.http.post(environment.BACKEND_URL+'/refresh',params).subscribe((res: any) => {
      if(res.access_token) {
        localStorage.setItem('ACCESS_TOKEN', res.access_token);
        localStorage.setItem('REFRESH_TOKEN', res.refresh_token);
      }
    })
  }
}
