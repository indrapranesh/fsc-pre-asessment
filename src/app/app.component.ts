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

  constructor(private authService: DynamicsAuthService) {
    if(!localStorage.getItem('ACCESS_TOKEN')) {
      this.authService.authenticate();
    }
  }
}
