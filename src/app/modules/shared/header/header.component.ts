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
    this.initService.getOrganization().subscribe((res: any) => {
      let organization = res;
      localStorage.setItem('organization',JSON.stringify(res));
      this.organization = organization.name;
    });
  }

  ngOnInit(): void {
  }

}
