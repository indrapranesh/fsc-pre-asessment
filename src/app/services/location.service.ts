import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  headers;

  constructor(private http: HttpClient) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
  }

  getReverseGeoCoding(latitude,longitude) {
    let params = '?location='+latitude+','+longitude;
    return this.http.get(environment.BACKEND_URL+'/getAddress'+params);
  }

  getGeocoding(address) {
    let params = '?address='+address;
    return this.http.get(environment.BACKEND_URL+'/geocode'+params);
  }

  createSiteLocation(payload) {
    return this.http.post(environment.DYNAMICS_API_URL+ '/fsc_sites',payload,{headers: this.headers});
  }

}
