import { Component, OnInit } from '@angular/core';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-steps-filter',
  templateUrl: './steps-filter.component.html',
  styleUrls: ['./steps-filter.component.scss']
})
export class StepsFilterComponent implements OnInit {

  current: number;

  constructor(private stepService: StepsService) {
    this.stepService.getCurrentStep().subscribe((value) => {
      this.current = value;
    })
  }

  ngOnInit(): void {
  }

}
