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

  async ngOnInit() {
    if(!localStorage.getItem('organization')) {
      await this.initService.getOrganization();
    }
    this.organization = JSON.parse(localStorage.getItem('organization')).name;
  }

}
