import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicsAuthService {

  constructor(private http: HttpClient) { }

  authenticate() {
    this.http.get(environment.BACKEND_URL).subscribe((res: any) => {
      if(res.access_token) {
        localStorage.setItem('ACCESS_TOKEN', res.access_token);
        localStorage.setItem('REFRESH_TOKEN', res.refresh_token);
      } else {
        console.log('Something went wrong');
      }
    });
  }
}
