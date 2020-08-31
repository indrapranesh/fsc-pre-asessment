import { Component } from '@angular/core';
import { DynamicsAuthService } from './services/dynamics-auth.service';
import { DecisionTreeService } from './services/decision-tree.service';
import { InitService } from './services/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fsc-pre-asessment';
  showLoader = false;
  isAuthenticated = false;

  constructor(private authService: DynamicsAuthService,
    private initService: InitService) {
    this.getToken();
  }

  async getToken() {

    if(localStorage.getItem('ACCESS_TOKEN')) {
      this.isAuthenticated = true;
    }
    
    if(!localStorage.getItem('ACCESS_TOKEN')) {
      this.showLoader = true;
      await this.authService.authenticate();
      this.showLoader = false;
      await this.initService.getOrganization();
      this.isAuthenticated = true;
    }
  }
}
