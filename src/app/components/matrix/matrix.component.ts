import { Component, OnInit } from '@angular/core';
import { matrix, FilterOutcome } from '../../constants/matrix';
import { StepsService } from 'src/app/services/steps.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

  results;
  isLikely: boolean;
  resultText: string;

  constructor(
    private stepService: StepsService
  ) { 
    this.getLikelihood();
  }

  // Getting the likelihood of the Filter Response

  getLikelihood() {
    let _result = this.getFilterCodes();
    console.log(_result);
    let primaryCode = _result[1].outcomeCode;
    if(_result[3].outcomeCode == 'CRMOL') {
      this.isLikely = true;
      this.resultText = 'Great, You are likely eligible for remote audit'
    } else if(_result[3].outcomeCode == 'NO') {
      this.isLikely = false;
      this.resultText = 'Oops, You are not likely eligible for remote audit'
    } else {
      matrix.map((primaryFilter) => {
        if(primaryCode == primaryFilter.filter1) {
          primaryFilter.Likely.map((x) => {
            if(x.filter2 == _result[2].outcomeCode && x.filter3 == _result[3].outcomeCode) {
              this.isLikely = true;
              this.resultText = 'Great, You are likely eligible for remote audit'
            }
          });
          primaryFilter.NotLikely.map((x) => {
            if(x.filter2 == _result[2].outcomeCode && x.filter3 == _result[3].outcomeCode) {
              this.isLikely = false;
              this.resultText = 'Oops, You are not likely eligible for remote audit'
            }
          });
        }
      });
    }
    console.log(this.isLikely);
  }

  //Converting Outcome Text to Codes

  getFilterCodes() {
    let result = JSON.parse(localStorage.getItem('result')); 
    FilterOutcome.map((filter) => {
      if(result[1].outcome == filter.outcome) {
        result[1].outcomeCode = filter.code
      };
      if(result[2].outcome == filter.outcome) {
        result[2].outcomeCode = filter.code
      };
      if(result[3].outcome == filter.outcome) {
        result[3].outcomeCode = filter.code
      };
    });
    return result;
  }

  next() {
    this.stepService.currentStep.next(2);
    localStorage.setItem('currentStep', '2');
  }

  ngOnInit(): void {
  }

}
