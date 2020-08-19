import { Component, OnInit } from '@angular/core';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-steps-filter',
  templateUrl: './steps-filter.component.html',
  styleUrls: ['./steps-filter.component.scss']
})
export class StepsFilterComponent implements OnInit {

  current: number;
  firstSegment: boolean;

  constructor(private stepService: StepsService) {
    this.stepService.getCurrentStep().subscribe((value) => {
      this.current = value;
      if(this.current <= 3) {
        this.firstSegment = true;
      } else {
        this.firstSegment = false;
      }
    })
  }

  ngOnInit(): void {
  }

}
