import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  headers;
  
  constructor(private http: HttpClient) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
  }

  addContact(payload) {
    return this.http.post(environment.DYNAMICS_API_URL + '/contacts',payload, {headers: this.headers});
  }
}
