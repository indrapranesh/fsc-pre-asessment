import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services/init.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  organization;

  constructor(private initService: InitService) { 
  }

  ngOnInit() {
    if(localStorage.getItem('organization')) {
      let org = JSON.parse(localStorage.getItem('organization'));
      this.organization = org.name
    }
  }

}
