import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-steps-filter',
  templateUrl: './steps-filter.component.html',
  styleUrls: ['./steps-filter.component.scss']
})
export class StepsFilterComponent implements OnInit {

  filter = 1;
  current = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
