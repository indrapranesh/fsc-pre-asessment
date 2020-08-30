import { Component } from '@angular/core';
import { DynamicsAuthService } from './services/dynamics-auth.service';
import { DecisionTreeService } from './services/decision-tree.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fsc-pre-asessment';
  showLoader = false;

  constructor(private authService: DynamicsAuthService) {
    this.getToken();
  }

  async getToken() {
    if(!localStorage.getItem('ACCESS_TOKEN')) {
      this.showLoader = true;
      await this.authService.authenticate();
      this.showLoader = false;
    }
  }
}
