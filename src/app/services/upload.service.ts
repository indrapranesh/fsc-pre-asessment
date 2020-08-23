import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  fileByteArray;
  headers: HttpHeaders;
  postHeaders;
  token: string;
  count;
  content;


  orgId = '58cf986f-fccc-ea11-a815-000d3a0a82c9';
  orgRequirementId;
  fileName;

  fileUploading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fileUploaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`,
        'x-ms-transfer-mode': 'chunked',
        'x-ms-file-name': 'Labelling_Agreement.xlsx',
        'Content-Type': 'application/octet-stream'
    });
    this.postHeaders = new HttpHeaders ({
      'Authorization': `Bearer ${access_token}`,
    });
  }

  getFileUploading() {
    return this.fileUploading.asObservable();
  }

  getFileUploaded() {
    return this.fileUploaded.asObservable();
  }

  getOrgRequirements() {
    return this.http.get(environment.DYNAMICS_API_URL+'/new_organization_requirements ?$filter=_new_fsc_organization_value eq %27'+this.orgId+'%27',{headers: this.postHeaders})
  }

  createOrgRequirement(requirement) {
    let payload = {
      'new_fsc_requirment_type_per_coc_scenario@odata.bind': '/fsc_requirment_type_per_coc_scenario_stds('+ requirement.fsc_requirment_type_per_coc_scenario_stdid + ')',
      'new_fsc_organization@odata.bind': 'accounts(58cf986f-fccc-ea11-a815-000d3a0a82c9)'
    }
    return this.http.post(environment.DYNAMICS_API_URL+'/new_organization_requirements',payload,{headers: this.postHeaders});
  }

  getOrgRequirement(requirementId) {
    return this.http.get(environment.DYNAMICS_API_URL+'/new_organization_requirements?$filter=_new_fsc_organization_value eq %27'+this.orgId+'%27' + ' and _new_fsc_requirment_type_per_coc_scenario_value eq %27' + requirementId + '%27',{headers: this.postHeaders});
  }

  upload(bytes, orgRequirementId, fileName) {
    this.fileByteArray = bytes;
    this.orgRequirementId = orgRequirementId;
    this.fileName = fileName
    this.headers = this.headers.append('x-ms-file-name', this.fileName);
    this.getToken();
  }

  getToken() {
    return this.http.patch('https://indrapranesh.api.crm8.dynamics.com/api/data/v9.1/new_organization_requirements('+this.orgRequirementId + ')/new_coc_document',null, {headers: this.headers,observe: 'response'})
    .subscribe((res) => {
      this.token = res.headers.get('location');
      let length: number = +(res.headers.get('content-length'));
      let chunkSize = 4194304;
      this.uploadFile(this.token,length,chunkSize);
    })
  }

  async uploadFile(url,length, chunkSize) {
    
    let offset = 0;
    let fileArray = new Uint8Array(this.fileByteArray);
    // console.log(fileArray);
    // console.log('fileArrayLength',fileArray.length);
    // console.log('chunksize',chunkSize);
    while (offset <= fileArray.length) {
      this.count = (offset+chunkSize) > fileArray.length ? fileArray.length % chunkSize : chunkSize;
      console.log(this.count);
      this.content = new Uint8Array(this.count);
      console.log('content',this.content);
      for (var i = 0; i < this.count; i++) {
        this.content[i] = fileArray[offset + i]; 
      }
      console.log('pushing');
      await this.patchFile(url,i,offset, fileArray);
    }
  }

  patchFile(url,i,offset, fileArray) {
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'x-ms-transfer-mode': 'chunked',
      'x-ms-file-name': this.fileName,
      'Content-Type': 'application/octet-stream',
      'Content-Range': 'bytes '+offset+'-'+(offset+this.count -1)+'/'+ fileArray.length
    });
    console.log('headers',this.headers);
    return new Promise( async(resolve) => {
      this.http.patch(url,this.fileByteArray,{headers:this.headers, observe: 'response'}).subscribe((res)=> {
        if(res.status == 206) {
          this.content[i] = fileArray[offset + i];
        };
        this.fileUploading.next(false);
        this.fileUploaded.next(true);
      });
    })
  }

}
