import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepsService {

  public currentStep: BehaviorSubject<number>;

  getCurrentStep() {
    return this.currentStep.asObservable();
  }

  constructor() {
   
   if(localStorage.getItem('currentStep')) {
    let step = localStorage.getItem('currentStep');
    this.currentStep = new BehaviorSubject<number>(Number(step));
   } else {
    this.currentStep = new BehaviorSubject<number>(0);
    localStorage.setItem('currentStep', '0');
   }
    
  }
}
