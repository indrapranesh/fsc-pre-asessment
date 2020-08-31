import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  requirements = [];
  selectedRequirement;
  fileByteArray;
  fileName;
  fileUploading: boolean;

  uploadForm = this.formBuilder.group({
    requirement: ['', [Validators.required]],
    file: [null, [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private message: NzMessageService,
    private stepService: StepsService
  ) { 
    this.requirements = JSON.parse(localStorage.getItem('requirements'));
    console.log(this.requirements);
    this.uploadService.fileUploading.subscribe((res) => {
      this.fileUploading = res;
    });
  }

  onInput(event: Event): void {
    console.log(event);
    const value = (event.target as HTMLInputElement).value;
    this.requirements = value ? [value, value + value, value + value + value] : [];
  }

  fileChanged(event) {
    this.fileName = event.target.files[0].name;
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onload = (e) => {
      this.fileByteArray = reader.result;
      console.log(this.fileByteArray);
    }
    reader.readAsArrayBuffer(file);
  }

  resetForm() {
    this.uploadForm.reset();
  }

  upload() {
    this.uploadService.fileUploading.next(true);
    console.log(this.uploadForm.value);
    console.log(this.selectedRequirement);
    this.uploadService.getOrgRequirement(this.selectedRequirement.fsc_requirment_type_per_coc_scenario_stdid).subscribe((res: any) => {
      if(!res.value[0]) {
        this.uploadService.createOrgRequirement(this.selectedRequirement).subscribe((res) => {
          this.upload();
        });
      }
      if(res.value[0]) {
        this.uploadService.fileUploaded.subscribe((res) => {
          if(res == true) {
            this.message.success('Document Uploaded', {
              nzDuration: 3000
            });
            this.uploadForm.reset();
            this.updateDocumentList();
          }
        })
        console.log(res.value[0].new_organization_requirementid);
        this.uploadService.upload(this.fileByteArray, res.value[0].new_organization_requirementid, this.fileName);
      }
      console.log(res.value);
    })
  };

  updateDocumentList() {
    this.uploadService.getOrgRequirements().subscribe((res: any) => {
      let requirements = [];
      requirements = res.value;
      requirements.map((orgReq) => {
        this.requirements.map((req) => {
          if(orgReq._new_fsc_requirment_type_per_coc_scenario_value == req.fsc_requirment_type_per_coc_scenario_stdid && orgReq.new_coc_document_name !== null) {
            req['fileName'] = orgReq.new_coc_document_name
          }
        })
      });
      localStorage.setItem('requirements', JSON.stringify(this.requirements));
    })
  }

  next() {
    this.stepService.currentStep.next(6);
    localStorage.setItem('currentStep', '6');
  }

  ngOnInit(): void {
  }

}
