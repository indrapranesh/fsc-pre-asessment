import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-submit',
  templateUrl: './sign-submit.component.html',
  styleUrls: ['./sign-submit.component.scss']
})
export class SignSubmitComponent implements OnInit {

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
    let org = JSON.parse(localStorage.getItem('organization'));
    this.orgName = org.name;
  }

  openSign() {
    let date = Date.now();
    window.open(environment.BACKEND_URL+ '/declaration?orgName='+this.orgName+'&date='+date,'_self');
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
