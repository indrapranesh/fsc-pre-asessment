import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getReverseGeoCoding(latitude,longitude) {
    let params = '?location='+latitude+','+longitude;
    return this.http.get(environment.BACKEND_URL+'/getAddress'+params);
  }

}
