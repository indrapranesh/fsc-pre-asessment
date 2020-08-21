import { Component, OnInit } from '@angular/core';
import  { DownloadService } from '../../services/download.service';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  resources;
  
  constructor(private downloadService: DownloadService,
    private stepService: StepsService) {
    this.loadData();
  }

  loadData() {
    this.downloadService.getTemplateResources().subscribe((res: any)=> {
      this.resources = res.value;
      console.log(this.resources);
    })
  }

  downloadFile(data: any) {
    console.log(data);
    let startBytes = 0;
    let increment = 4194304;
    let templateId = data.new_template_resourceid;
    let finalContent = "";
    let fileSize = 0;
    let fileName = '';
    // while (startBytes <= fileSize) {
    //   this.downloadService.downloadTemplate(templateId, startBytes, increment).subscribe((res) => {
    //     if(res.headers.get('status') === '206') {
    //       console.log(res);
    //       startBytes += increment;
    //     } else {
    //       startBytes = 4194305;
    //     }
    //   })
    // }
  }

  next() {
    this.stepService.currentStep.next(5);
    localStorage.setItem('currentStep', '5');
  }

  ngOnInit() {}

}
