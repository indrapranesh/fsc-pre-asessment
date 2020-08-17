import { Component, OnInit } from '@angular/core';
import { matrix, FilterOutcome } from '../../constants/matrix';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

  results;
  isLikely: boolean;
  resultText: string;

  constructor() { 
    this.getLikelihood();
  }

  // Getting the likelihood of the Filter Response

  getLikelihood() {
    let _result = this.getFilterCodes();
    console.log(_result);
    let primaryCode = _result[1];
    matrix.map((primaryFilter) => {
      if(primaryCode == primaryFilter.filter1) {
        primaryFilter.Likely.map((x) => {
          if(x.filter2 == _result[2] && x.filter3 == _result[3]) {
            this.isLikely = true;
            this.resultText = 'Great, You are likely eligible for remote audit'
          }
        });
        primaryFilter.NotLikely.map((x) => {
          if(x.filter2 == _result[2] && x.filter3 == _result[3]) {
            this.isLikely = false;
            this.resultText = 'Oops, You are not likely eligible for remote audit'
          }
        });
      }
    });
    console.log(this.isLikely);
  }

  //Converting Outcome Text to Codes

  getFilterCodes() {
    let result = JSON.parse(localStorage.getItem('result')); 
    FilterOutcome.map((filter) => {
      if(result[1] == filter.outcome) {
        result[1] = filter.code
      };
      if(result[2] == filter.outcome) {
        result[2] = filter.code
      };
      if(result[3] == filter.outcome) {
        result[3] = filter.code
      };
    });
    return result;
  }

  ngOnInit(): void {
  }

}
