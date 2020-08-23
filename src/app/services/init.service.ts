import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  headers;
  orgId = '5acf986f-fccc-ea11-a815-000d3a0a82c9';
  legalRepId = 860140004;
  constructor(private http: HttpClient) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN');
    this.headers = new HttpHeaders ({
      'Authorization': `Bearer ${access_token}`,
    });
  }

  getOrganization() {
    return this.http.get(environment.DYNAMICS_API_URL+ '/accounts('+this.orgId+')',{headers: this.headers});
  }

  getLegalRep() {
    return this.http.get(environment.DYNAMICS_API_URL+'/contacts?$filter=_fsc_organization_value eq %27'+this.orgId +'%27 and fsc_fsccontactid eq '+this.legalRepId,{headers: this.headers});
  }
}
