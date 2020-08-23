import { Component, OnInit } from '@angular/core';
import { CommunicateService } from '../../services/communicate.service';
import { Router } from '@angular/router';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-communicate',
  templateUrl: './communicate.component.html',
  styleUrls: ['./communicate.component.scss']
})
export class CommunicateComponent implements OnInit {

  legalRepName = '';
  legalRepEmail = '';
  orgName = '';

  constructor(
    private communicateService: CommunicateService,
    private router: Router,
    private stepService: StepsService
  ) { 
    this.setData();
    if(this.router.url.endsWith('/?event=signing_complete')) {
      console.log('signing complete');
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
    window.open('http://localhost:3001/datasharing?name='+this.legalRepName+'&email='+this.legalRepEmail+'&orgName='+this.orgName,'_self');
  }

  next() {
    this.stepService.currentStep.next(7);
    localStorage.setItem('currentStep', '7');
  }

  ngOnInit(): void {
  }

}
