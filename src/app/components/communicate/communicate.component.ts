import { Component, OnInit } from '@angular/core';
import { CommunicateService } from '../../services/communicate.service';
import { Router } from '@angular/router';
import { StepsService } from 'src/app/services/steps.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-communicate',
  templateUrl: './communicate.component.html',
  styleUrls: ['./communicate.component.scss']
})
export class CommunicateComponent implements OnInit {

  legalRepName = '';
  legalRepEmail = '';
  orgName = '';
  signingComplete = false;
  resultText = 'Great, You have signed the Data Sharing Confidentiality Agreement';

  constructor(
    private communicateService: CommunicateService,
    private router: Router,
    private stepService: StepsService
  ) { 
    this.setData();
    if(this.router.url.endsWith('/?state=123')) {
      this.signingComplete = true;
    }
}

  setData() {
    let representative = JSON.parse(localStorage.getItem('legalRep'));
    this.legalRepName = representative.fullname;
    this.legalRepEmail = representative.emailaddress1;
    let org = JSON.parse(localStorage.getItem('organization'));
    this.orgName = org.name;
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
