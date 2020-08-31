import { Component, OnInit } from '@angular/core';
import { CommunicateService } from '../../services/communicate.service';
import { Router } from '@angular/router';
import { StepsService } from 'src/app/services/steps.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-communicate',
  templateUrl: './communicate.component.html',
  styleUrls: ['./communicate.component.scss']
})
export class CommunicateComponent implements OnInit {

  orgName = '';
  signingComplete = false;
  resultText = 'Great, You have signed the Data Sharing Confidentiality Agreement';
  selectedType = '';
  orgId;
  isContactAdding: boolean = false;
  contactAdded: boolean = false;

  contactTypes = [
    {
      name: 'Applicant',
      value: 860140003
    },
    {
      name: 'CH Legal Representative',
      value: 860140004
    },
    {
      name: 'Certificate Holder',
      value: 860140001
    }
  ]

  contactForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    organization: ['', [Validators.required]],
    contactId:['',[Validators.required]]
  })

  constructor(
    private communicateService: CommunicateService,
    private router: Router,
    private stepService: StepsService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { 
    if(localStorage.getItem('contactAdded')) {
      this.contactAdded = true;
    }
    this.setData();
    if(this.router.url.endsWith('/?state=123')) {
      this.signingComplete = true;
      this.contactAdded = true;
    }
}

  setData() {
    let org = JSON.parse(localStorage.getItem('organization'));
    this.orgName = org.name;
    this.orgId = org.accountid;
    this.contactForm.patchValue({
      organization: this.orgId
    })
  }

  submitForm(value) {
    this.isContactAdding = true;
    let payload = {
      'firstname': value.firstName,
      'lastname': value.lastName,
      'fsc_fsccontactid': value.contactId,
      'emailaddress1': value.email,
      'mobilephone': value.mobile,
      'fsc_Organization@odata.bind': `accounts(${value.organization})`
    }
    console.log(payload);
    this.communicateService.addContact(payload).subscribe((res:any) => {
      console.log(res);
      this.contactAdded = true;
      this.message.success('Contact Added', {
        nzDuration: 3000
      });
      localStorage.setItem('contactAdded', 'true');
    })
  }

  openSign() {
    let date = Date.now();
    window.open(environment.BACKEND_URL+'/datasharing?orgName='+this.orgName,'_self');
  }

  next() {
    let url: string = this.router.url.substring(0, this.router.url.indexOf("?"));
    this.router.navigateByUrl(url);
    this.stepService.currentStep.next(7);
    localStorage.setItem('currentStep', '7');
  }

  ngOnInit(): void {
  }

}
