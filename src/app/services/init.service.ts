import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  headers;
  orgId = '55c3a005-edea-ea11-a815-000d3a0a82cb';
  constructor(private http: HttpClient) {
    
  }

  getOrganization() {
    let access_token = localStorage.getItem('ACCESS_TOKEN');
      this.headers = new HttpHeaders ({
        'Authorization': `Bearer ${access_token}`,
      });
    return new Promise(async(resolve) => {
      this.http.get(environment.DYNAMICS_API_URL + `/accounts(${this.orgId})`,{headers:this.headers}).subscribe((res) => {
        localStorage.setItem('organization',JSON.stringify(res));
        resolve();
      })
    });
  }
}
