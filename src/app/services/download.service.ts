import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  headers = new HttpHeaders;

  constructor(
    private http: HttpClient) { 
      let access_token = localStorage.getItem('ACCESS_TOKEN');
      this.headers = this.headers.append('Authorization', `Bearer ${access_token}`);
  }

  getTemplateResources() {
    return this.http.get(environment.DYNAMICS_API_URL+'/new_template_resources?$select=new_resource_name,new_resource_file,new_resource_file_name',{headers: this.headers});
  }

  downloadTemplate(id, startBytes, increment) {
    this.headers = this.headers.append('Range', 'bytes=' + startBytes + '-' + (startBytes + increment - 1));
    let url = environment.DYNAMICS_API_URL+'new_template_resources('+id+')/new_resource_file?size=full';
    return this.http.get(url,{headers: this.headers, observe: 'response'});
  }
}
