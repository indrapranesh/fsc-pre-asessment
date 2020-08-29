import { Component, OnInit } from '@angular/core';
import  { DownloadService } from '../../services/download.service';
import { StepsService } from 'src/app/services/steps.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileSaverService } from 'ngx-filesaver';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  resources;
  isDownloading: boolean = false;
  
  constructor(private downloadService: DownloadService,
    private stepService: StepsService,
    private _FileSaverService: FileSaverService) {
    this.loadData();
  }

  loadData() {
    this.downloadService.getTemplateResources().subscribe((res: any)=> {
      this.resources = res.value;
      console.log(this.resources);
    })
  }

  async downloadFile(data: any) {
    this.isDownloading = true;
    let startBytes = 0;
    let increment = 4194304;
    let templateId = data.new_template_resourceid;
    let finalContent = "";
    let fileSize = 0;
    let fileName = data.new_resource_file_name;
    while (startBytes <= fileSize) {
      let res: any = await this.downloadService.downloadTemplate(templateId, startBytes, increment);
      if(res.status == 206) {
        console.log(res);
        startBytes += increment;
        this.prepareFile(res.body, fileName);
      } else {
        startBytes = 4194305;
      }
    }
  }

  prepareFile(res, fileName) {
    let b64Data = res.value;
    let blob = this.base64ToBlob(b64Data, 'application/octet-stream');
    this._FileSaverService.save(blob, fileName);
    this.isDownloading = false;
  }

  base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
}

  next() {
    this.stepService.currentStep.next(5);
    localStorage.setItem('currentStep', '5');
  }

  ngOnInit() {}


}
