import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-submit',
  templateUrl: './sign-submit.component.html',
  styleUrls: ['./sign-submit.component.scss']
})
export class SignSubmitComponent implements OnInit {

  legalRepName = '';
  legalRepEmail = '';
  orgName = '';

  signingComplete = false;
  resultText = 'Great, you have signed the Declaration of Authenticity';

  constructor(private router: Router) { 
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
    window.open('http://localhost:5000/declaration?orgName='+this.orgName+'&date='+date,'_self');
  }

  finish() {
    if(this.router.url.endsWith('/?state=123')) {
      this.signingComplete = true;
    }
    localStorage.clear();
    window.location.reload();
  }

  ngOnInit(): void {
  }

}
